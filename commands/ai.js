const { Tellraw, Text } = require('./../utils/tellraw.js');
const config = require('./../config.json');
const { setTimeout: sleep } = require('timers/promises');
const axios = require('axios');

let isRequesting = false;

module.exports = {
    name: "ai",
    aliases: ['freeai', 'uai'],
    description: "Gives a request to a local model (uncensored)",
    usages: [
        'ai <request>'
    ],
    permissionLevel: "0",
    working: false,
    async execute(context) {
        const colors = context.config.colors;
        const core = context.core;
        const args = context.args;
        const question = args.join(" ");
        
        // Check if a request is already in progress
        if (isRequesting) {
            core.run((new Tellraw("@a", [new Text("A request is already in progress. Please wait for it to finish").setColor(colors.primary)])).get());
            return;
        }
        
        // Set the flag to indicate that a request is now in progress
        isRequesting = true;

        core.run((new Tellraw("@a", [new Text("Please be patient while the ai does its thing").setColor(colors.primary)])).get());

        try {
            // Make the AI request
            const response = await axios.post('http://127.0.0.1:11434/api/generate', {
                model: 'dolphin-phi',
                messages: [{ role: 'user', content: question }],
            });

            // Send the AI response to all players
            console.log(response)
            //core.run((new Tellraw("@a", [new Text("AI: " + response.data.message.content).setColor(colors.primary)])).get());
        } catch (error) {
            // Handle errors
            core.run((new Tellraw("@a", [new Text(`ERROR - ` + error).setColor(colors.errorColor).setHover(error.stack).setCopy(error.stack)])).get());
        } finally {
            // Reset the flag to indicate the request is finished
            isRequesting = false;
        }

        return context;
    }
};

/*
Context includes:
- client
- core
- cloop
- args
- senderUUID
- username
- hash
- ownerHash
- currentServer
- config
*/
