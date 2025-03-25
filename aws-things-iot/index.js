const { IoTClient, ListThingsCommand, DescribeThingCommand } = require('@aws-sdk/client-iot');
const { IoTDataPlaneClient, GetThingShadowCommand } = require('@aws-sdk/client-iot-data-plane');

// Initialize the IoT client for SDK v3
const iotClient = new IoTClient({ region: 'us-east-1' });

// Replace with your actual IoT endpoint
const iotDataClient = new IoTDataPlaneClient({ endpoint: 'https://a2gr2t2eophnz3-ats.iot.us-east-1.amazonaws.com' }); // Correct IoT endpoint

// Function to fetch things from AWS IoT and print all available details including Thing Shadow
async function getIoTThingsList() {
    try {
        const params = {
            maxResults: 50
        };

        const listThingsCommand = new ListThingsCommand(params);
        const response = await iotClient.send(listThingsCommand);
        const things = response.things;

        const thingsWithDetails = await Promise.all(things.map(async (thing) => {
            const describeThingCommand = new DescribeThingCommand({ thingName: thing.thingName });
            const thingDetails = await iotClient.send(describeThingCommand);
            
            const shadowParams = { thingName: thing.thingName };
            const getShadowCommand = new GetThingShadowCommand(shadowParams);
            const shadowResponse = await iotDataClient.send(getShadowCommand);

            // Decode and parse shadow data
            let lastUpdated = null;
            if (shadowResponse.payload) {
                const shadowData = JSON.parse(Buffer.from(shadowResponse.payload).toString());

                if (shadowData.metadata?.reported?.lastUpdated) {
                    lastUpdated = new Date(shadowData.metadata.reported.lastUpdated.timestamp * 1000).toISOString();
                }
            }

            return {
                ...thingDetails,
                lastUpdated: lastUpdated || 'N/A'
            };
        }));

        // Log the full response dynamically
        console.log('Things with Shadow Details:', JSON.stringify(thingsWithDetails, null, 2));
    } catch (error) {
        console.error('Error fetching things:', error.message);
    }
}

// Call the function
getIoTThingsList();
