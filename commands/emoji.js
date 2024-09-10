const fs = require('fs').promises;
const { Tellraw, Text } = require('./../utils/tellraw.js');
const config = require('./../config.json');

module.exports = {
    name: "emoji",
    aliases: [],
    description: "Displays ascii art of something",
    usages: [
        `emoji list`,
        `emoji <name>`
    ],    
    permissionLevel: "0",
    working: true,
    async execute(context) {
        const colors = context.config.colors;
        const core = context.core;
        const args = context.args;

        if (args[0] === 'list') {
            const commandsFolder = './data/ascii';
            const files = await fs.readdir(commandsFolder);
            
            // Generate the list of commands dynamically
            const commandList = files.map((file) => file.replace('.txt', '')).join(', ');
            core.run((new Tellraw("@a", [new Text(`Available Emojis - ${commandList}`).setColor(colors.primary)])).get());
        } else {
            const emojiName = args[0];
            const commandFile = `./data/ascii/${emojiName}.txt`;

            try {
                let command = await fs.readFile(commandFile, 'utf8');
                command = command.replace(/\r/g, "");
                core.run((new Tellraw("@a", [new Text('\n' + command).setColor(colors.primary)])).get());
            } catch (error) {
                if (error.code === 'ENOENT') {
                    core.run((new Tellraw("@a", [new Text(`Emoji '${emojiName}' was not found`).setColor(colors.primary)])).get());
                } else {
                        const core = context.core
                        core.run((new Tellraw("@a", [new Text(`ERROR - ` + error).setColor(colors.errorColor).setHover(error.stack).setCopy(error.stack)])).get());
                        const now = new Date();
                        const year = now.getFullYear();
                        const month = String(now.getMonth() + 1).padStart(2, '0');
                        const day = String(now.getDate()).padStart(2, '0');
                        const hours = String(now.getHours()).padStart(2, '0');
                        const minutes = String(now.getMinutes()).padStart(2, '0');
                        core.run((new Tellraw("@a", [new Text(`Error while loading '${emojiName}'`).setColor(colors.primary).setHover(error)])).get());
                }
            }
        }
    }
};
