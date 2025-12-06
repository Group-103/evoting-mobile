require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Constituency Voting...');

  // Get admin credentials from .env
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@university.edu';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123!';
  const adminName = process.env.ADMIN_NAME || 'Election Administrator';

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file');
  }

  // Delete all non-admin users
  const deletedCount = await prisma.user.deleteMany({
    where: {
      role: {
        not: 'ADMIN'
      }
    }
  });
  console.log(`🗑️  Deleted ${deletedCount.count} non-admin users`);

  // Create/Update Election Admin
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {
      password: hashedPassword,
      name: adminName,
      status: 'ACTIVE',
      emailVerified: true,
    },
    create: {
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      name: adminName,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });
  console.log('✅ Admin Ready:', admin.email);

  // --- CONSTITUENCY SEED DATA ---

  // 1. Create Seats (Positions)
  // Ensure we delete old ones first to avoid duplicates in dev
  await prisma.position.deleteMany({});

  const positions = [
    { name: 'Guild President', constituency: null, seats: 1 }, // General
    { name: 'Science Rep', constituency: 'Science', seats: 1 },
    { name: 'Arts Rep', constituency: 'Arts', seats: 1 }
  ];

  const now = new Date();
  const votingOpens = new Date(now);
  const votingCloses = new Date(now);
  votingCloses.setDate(votingCloses.getDate() + 7); // Open for 7 days

  for (const pos of positions) {
    await prisma.position.create({
      data: {
        name: pos.name,
        constituency: pos.constituency,
        seats: pos.seats,
        nominationOpens: now,
        nominationCloses: votingCloses,
        votingOpens: now,
        votingCloses: votingCloses
      }
    });
  }
  console.log('✅ Created 3 Positions (1 General, 2 Constituency)');

  // 2. Create Voters
  await prisma.eligibleVoter.deleteMany({});

  const voters = [
    { regNo: 'REG/SCI/001', name: 'Science Voter 1', constituency: 'Science', email: 'voter.sci1@test.com' },
    { regNo: 'REG/SCI/002', name: 'Science Voter 2', constituency: 'Science', email: 'voter.sci2@test.com' },
    { regNo: 'REG/ARTS/001', name: 'Arts Voter 1', constituency: 'Arts', email: 'voter.arts1@test.com' },
    { regNo: 'REG/ARTS/002', name: 'Arts Voter 2', constituency: 'Arts', email: 'voter.arts2@test.com' }
  ];

  for (const v of voters) {
    await prisma.eligibleVoter.create({
      data: {
        regNo: v.regNo,
        name: v.name,
        constituency: v.constituency,
        email: v.email,
        status: 'ELIGIBLE'
      }
    });
  }
  console.log(`✅ Created ${voters.length} Eligible Voters`);

  // Log setup
  await prisma.auditLog.create({
    data: {
      actorType: 'system',
      action: 'SEED_CONSTITUENCY_DATA',
      entity: 'system',
      payload: { positions: positions.length, voters: voters.length },
    },
  });

  console.log('✅ Seed completed with Constituency Data!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
