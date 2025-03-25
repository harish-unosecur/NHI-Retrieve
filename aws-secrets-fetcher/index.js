const AWS = require('aws-sdk');

// Create SecretsManager instance (IAM role is used automatically)
const secretsManager = new AWS.SecretsManager({ region: 'us-east-1' }); // Change region if needed

// Function to fetch all secrets with their details
async function getAllSecrets() {
    try {
        // List all secrets
        const secretsList = await secretsManager.listSecrets().promise();

        if (!secretsList.SecretList || secretsList.SecretList.length === 0) {
            console.log('No secrets found.');
            return;
        }

        console.log(`Found ${secretsList.SecretList.length} secrets.\n`);
        
        // Fetch each secret's details
        for (const secret of secretsList.SecretList) {
            const secretName = secret.Name;
            try {
                // Get the secret details including metadata, tags, and secret value
                const secretDetails = await secretsManager.describeSecret({ SecretId: secretName }).promise();
                
                console.log(`\nSecret Name: ${secretName}`);

                // Print the secretDetails object in JSON format
                console.log("Secret Details:", JSON.stringify(secretDetails, null, 2));

                // Optionally, fetch the secret value if needed
                const secretValue = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
                console.log(`Secret Value: ${secretValue.SecretString || '[Binary Data]'}`);
                
            } catch (error) {
                console.error(`Failed to fetch details for secret: ${secretName}`, error.message);
            }
        }
    } catch (error) {
        console.error('Error listing secrets:', error.message);
    }
}

// Call the function
getAllSecrets();
