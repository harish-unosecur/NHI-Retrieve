const AWS = require('aws-sdk');

// Set AWS region
AWS.config.update({ region: 'us-east-1' });

// Create the ACM client
const acm = new AWS.ACM();

async function listACMCertificates() {
    try {
        const response = await acm.listCertificates().promise();

        if (response.CertificateSummaryList.length > 0) {
            console.log('ACM Certificates:', JSON.stringify(response.CertificateSummaryList, null, 2));
        } else {
            console.log('No ACM certificates found.');
        }
    } catch (error) {
        console.error('Error fetching ACM certificates:', error);
    }
}

// Execute the function
listACMCertificates();
