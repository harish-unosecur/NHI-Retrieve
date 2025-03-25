const AWS = require('aws-sdk');

// Create the AppRegistry client
const appRegistry = new AWS.ServiceCatalogAppRegistry({ region: 'us-east-1' });

async function listApplications() {
    try {
        const params = {};

        // Fetch the list of applications
        const response = await appRegistry.listApplications(params).promise();

        // Check if applications are returned
        if (response.applications && response.applications.length > 0) {
            console.log('Applications:', JSON.stringify(response.applications, null, 2));
        } else {
            console.log('No applications found.');
        }
    } catch (error) {
        console.error('Error fetching applications:', error);
    }
}

// Call the function to list applications
listApplications();
