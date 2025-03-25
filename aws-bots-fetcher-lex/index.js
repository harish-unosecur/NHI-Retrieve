const { LexModelsV2Client, ListBotsCommand } = require("@aws-sdk/client-lex-models-v2");

// Initialize Lex V2 client
const client = new LexModelsV2Client({
    region: "us-east-1", // Change this if needed
});

// Function to fetch all Lex V2 bots
async function getAllLexBots() {
    try {
        let bots = [];
        let nextToken = null;

        do {
            const command = new ListBotsCommand({
                nextToken, // Handles pagination
            });

            const response = await client.send(command);

            // Add fetched bots to the list
            bots = [...bots, ...response.botSummaries];

            // Update nextToken if more results exist
            nextToken = response.nextToken;
        } while (nextToken);

        // Print the fetched bots
        console.log("Bots List:", JSON.stringify(bots, null, 2));
    } catch (error) {
        console.error("Error fetching bots:", error);
    }
}

// Run the function
getAllLexBots();
