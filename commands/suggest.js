const { Tellraw, Text } = require('./../utils/tellraw.js');
const config = require('./../config.json');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: "suggest",
    aliases: ['tip', 'recommend'],
    description: "Saves your recommendation for the owner to look at later",
    usages: [`suggest <message>`],
    permissionLevel: "0",
    working: true,
    execute(context) {
        const colors = context.config.colors;
        const core = context.core;
        const username = context.username;
        const args = context.args;

        const filePath = path.join(__dirname, '..', 'data', 'suggestions.txt'); // Adjusted file path

        // Prepare the suggestion text
        const suggestion = `${username}: ${args.join(" ")}\n`;

        // Write suggestion to file
        fs.appendFile(filePath, suggestion, (err) => {
            if (err) {
                const tellraw = new Tellraw("@a", [new Text("Error saving suggestion").setColor(colors.primary).setHover(err)]);
                core.run(tellraw.get());
                return;
            }
        });

        // Notify users
        const tellraw = new Tellraw("@a", [new Text("Suggestion added to list").setColor(colors.primary)]);
        core.run(tellraw.get());
    }
};
