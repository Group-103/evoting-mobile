const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

async function uploadVoters() {
    try {
        // Read the CSV file
        const csvPath = path.join(__dirname, 'frontend', 'public', 'sample_voters.csv');
        const formData = new FormData();
        formData.append('file', fs.createReadStream(csvPath));

        console.log('📁 Reading CSV file from:', csvPath);
        console.log('📤 Uploading voters to backend...\n');

        // Note: You'll need to get an admin token first
        // For now, we'll try without auth to see what happens
        const response = await axios.post('http://localhost:5000/api/voters/import', formData, {
            headers: {
                ...formData.getHeaders(),
                // Add your admin token here if needed
                // 'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
            }
        });

        console.log('✅ Upload successful!\n');
        console.log('Summary:');
        console.log('━'.repeat(50));
        console.log(`Total rows processed: ${response.data.summary.total}`);
        console.log(`✅ Created: ${response.data.summary.created}`);
        console.log(`🔄 Updated: ${response.data.summary.updated}`);
        console.log(`❌ Errors: ${response.data.summary.errors}`);
        console.log(`📊 Total in database: ${response.data.summary.actualCountInDatabase}`);
        console.log('━'.repeat(50));

        if (response.data.errors && response.data.errors.length > 0) {
            console.log('\n⚠️  Errors encountered:');
            response.data.errors.forEach(err => console.log(`  - ${err}`));
        }

    } catch (error) {
        if (error.response?.status === 401) {
            console.error('\n❌ Authentication required!');
            console.error('You need to provide an admin token to upload voters.');
            console.error('\nHow to get a token:');
            console.error('1. Open the web interface at http://localhost:5173');
            console.error('2. Login as admin');
            console.error('3. Open browser DevTools (F12)');
            console.error('4. Go to Application/Storage > Local Storage');
            console.error('5. Copy the "token" value');
            console.error('6. Add it to this script or use the web interface to upload.\n');
        } else if (error.response) {
            console.error('\n❌ Upload failed:', error.response.data?.error || error.message);
        } else {
            console.error('\n❌ Error:', error.message);
            console.error('\nMake sure the backend server is running on http://localhost:5000');
        }
    }
}

uploadVoters();
