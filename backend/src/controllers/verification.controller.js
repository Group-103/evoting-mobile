const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { prisma } = require('../config/prisma');
const { logAudit } = require('../utils/auditLogger');
const { sendOTPEmail } = require('../utils/emailService');
const { sendOTPSMS } = require('../utils/smsService');

/**
 * Request OTP for voter verification
 * 
 * Flow:
 * 1. Voter enters registration number
 * 2. System finds eligible voter
 * 3. Generates OTP
 * 4. Sends OTP via SMS only
 * 5. Stores hashed OTP in database
 * 6. Returns success
 */
exports.requestOTP = async (req, res) => {
  try {
    const { reg_no } = req.body;

    if (!reg_no) {
      return res.status(400).json({ error: 'Registration number is required' });
    }

    // Check availability of elections
    const allPositions = await prisma.position.count();
    if (allPositions === 0) {
      return res.status(400).json({
        error: 'No elections are currently set up.',
        hint: 'Please contact the election administrator.'
      });
    }

    // Check for active elections (where voting window is open OR upcoming)
    // We allow logging in if election is future (to see countdown) or active.
    // If closes < now, it's done. 
    const now = new Date();
    const activeOrFuturePositions = await prisma.position.count({
      where: {
        votingCloses: {
          gt: now
        }
      }
    });

    if (activeOrFuturePositions === 0) {
      return res.status(400).json({
        error: 'No election is currently active.',
        hint: 'Voting has ended or not yet started.'
      });
    }


    // Find eligible voter
    const voter = await prisma.eligibleVoter.findUnique({
      where: { regNo: reg_no.toUpperCase() },
    });

    if (!voter) {
      return res.status(404).json({ error: 'Registration number not found' });
    }

    if (voter.status !== 'ELIGIBLE') {
      return res.status(400).json({ error: 'Voter is not eligible' });
    }

    // Check if voter has already voted (prevent repeat verification)
    const existingBallot = await prisma.ballot.findFirst({
      where: {
        voterId: voter.id,
        status: 'CONSUMED',
      },
    });

    if (existingBallot) {
      return res.status(400).json({
        error: 'You have already voted. Ballot already used.',
        hint: 'Each voter can only vote once',
      });
    }

    // Check for recent OTP request (rate limiting)
    // Allow OTP requests every 60 seconds (1 minute) to prevent abuse
    const recentVerification = await prisma.verification.findFirst({
      where: {
        voterId: voter.id,
        issuedAt: {
          gte: new Date(Date.now() - 60 * 1000), // Last 60 seconds
        },
        verifiedAt: null, // Not yet verified
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });

    if (recentVerification) {
      const secondsRemaining = Math.ceil((60 * 1000 - (Date.now() - recentVerification.issuedAt.getTime())) / 1000);
      return res.status(429).json({
        error: 'Please wait before requesting another OTP',
        hint: `You can request a new OTP in ${secondsRemaining} second${secondsRemaining !== 1 ? 's' : ''}`,
        retryAfter: secondsRemaining,
      });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    // Set expiration (5 minutes for security)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Validate that voter has both email and phone
    if (!voter.email) {
      return res.status(400).json({
        error: 'Voter email not found',
        hint: 'Contact administrator to update your email address in the CSV file',
      });
    }

    if (!voter.phone) {
      return res.status(400).json({
        error: 'Voter phone number not found',
        hint: 'Contact administrator to update your phone number in the CSV file',
      });
    }

    // Create verification record
    const verification = await prisma.verification.create({
      data: {
        voterId: voter.id,
        method: 'email', // Changed from 'both' to 'email'
        otpHash,
        expiresAt,
      },
    });

    // Send OTP via Email (non-blocking)
    console.log('🚀 Initiating OTP delivery (non-blocking)...');

    const deliveryPromises = [];

    // 1. Send Email (Primary method)
    if (voter.email) {
      deliveryPromises.push(
        sendOTPEmail(voter.email, otp, voter.regNo)
          .then(() => console.log('✅ OTP Email sent successfully'))
          .catch(err => console.error('⚠️ Email sending failed:', err.message))
      );
    } else {
      // Fallback or error if no email
      console.warn('⚠️ No email found for voter:', voter.regNo);
    }

    // 2. SMS Disabled for now
    /*
    deliveryPromises.push(
      sendOTPSMS(voter.phone, otp, voter.regNo)
        .then(() => console.log('✅ OTP SMS sent successfully'))
        .catch(err => console.error('⚠️ SMS sending failed:', err.message))
    );
    */

    // Wait for all promises to settle (or just let them run if we want truly fire-and-forget)
    // For better reliability, we just let them run in background
    Promise.allSettled(deliveryPromises).then((results) => {
      // Optional: Log results to audit if needed
    });

    // Log audit (non-blocking)
    logAudit({
      actorType: 'system',
      action: 'OTP_REQUESTED',
      entity: 'verification',
      entityId: verification.id,
      payload: {
        voterId: voter.id,
        regNo: voter.regNo,
        method: 'EMAIL',
      },
    }).catch(err => console.error('Failed to log OTP request:', err));

    // Respond immediately
    res.json({
      message: 'OTP is being sent to your email',
      expiresIn: 300, // 5 minutes in seconds
      hint: 'Check your Email for the verification code. It may take a few moments to arrive.',
      sentVia: ['EMAIL'],
    });
  } catch (error) {
    console.error('Request OTP error:', error);
    res.status(500).json({ error: 'Failed to request OTP' });
  }
};

/**
 * Confirm OTP and issue ballot token
 * 
 * Flow:
 * 1. Voter enters OTP
 * 2. System verifies OTP
 * 3. If valid, generates single-use ballot token
 * 4. Returns ballot token
 * 5. Token can be used once to cast vote
 */
exports.confirmOTP = async (req, res) => {
  try {
    const { reg_no, otp } = req.body;

    if (!reg_no || !otp) {
      return res.status(400).json({ error: 'Registration number and OTP are required' });
    }

    // Find eligible voter
    const voter = await prisma.eligibleVoter.findUnique({
      where: { regNo: reg_no.toUpperCase() },
    });

    if (!voter) {
      return res.status(404).json({ error: 'Registration number not found' });
    }

    // Find unverified OTP
    const verification = await prisma.verification.findFirst({
      where: {
        voterId: voter.id,
        verifiedAt: null,
        consumedAt: null,
        expiresAt: {
          gte: new Date(), // Not expired
        },
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });

    if (!verification) {
      return res.status(400).json({
        error: 'No valid OTP found',
        hint: 'Request a new OTP',
      });
    }

    // Verify OTP
    const validOTP = await bcrypt.compare(otp, verification.otpHash);
    if (!validOTP) {
      // Log failed attempt
      await logAudit({
        actorType: 'system',
        action: 'OTP_VERIFICATION_FAILED',
        entity: 'verification',
        entityId: verification.id,
        payload: { voterId: voter.id, regNo: voter.regNo },
      });

      return res.status(401).json({ error: 'Invalid OTP' });
    }

    // Check if voter has already voted
    const existingBallot = await prisma.ballot.findFirst({
      where: {
        voterId: voter.id,
        status: 'CONSUMED',
      },
    });

    if (existingBallot) {
      return res.status(400).json({
        error: 'You have already voted. Ballot already used.',
      });
    }

    // Mark OTP as verified
    await prisma.verification.update({
      where: { id: verification.id },
      data: {
        verifiedAt: new Date(),
      },
    });

    // Generate single-use ballot token
    const ballotToken = crypto.randomBytes(32).toString('hex');

    // Create ballot
    const ballot = await prisma.ballot.create({
      data: {
        voterId: voter.id,
        token: ballotToken,
        status: 'ACTIVE',
      },
    });

    // Link verification to ballot
    await prisma.verification.update({
      where: { id: verification.id },
      data: {
        ballotToken: ballotToken,
      },
    });

    // Log audit
    await logAudit({
      actorType: 'system',
      action: 'OTP_VERIFIED_BALLOT_ISSUED',
      entity: 'ballot',
      entityId: ballot.id,
      payload: {
        voterId: voter.id,
        regNo: voter.regNo,
        ballotToken: ballotToken.substring(0, 8) + '...', // Partial token for logging
      },
    });

    res.json({
      message: 'Verification successful',
      ballotToken,
      expiresAt: ballot.issuedAt,
      note: 'Use this token to cast your vote. It can only be used once.',
    });
  } catch (error) {
    console.error('Confirm OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};


