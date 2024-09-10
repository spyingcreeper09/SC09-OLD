const { Tellraw, Text } = require('./../utils/tellraw.js');
const util = require('./../utils/util.js');
const config = require('./../config.json');
const { setTimeout: sleep } = require('timers/promises');

async function validateHash(context, core, inputHash) {
    try {
        if (context.hash !== inputHash && context.ownerHash !== inputHash) {
            core.run((new Tellraw("@a", [new Text("Invalid Hash").setColor(context.config.colors.errorColor)])).get());
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error in validating hash:", error);
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        context.discordBot.sendMessage(`On ${month}/${day}/${year} At ${hours}:${minutes} | Error in validating hash\`\`\`${error.stack}\`\`\``, config.discord.errorChannelId);
        return false;
    }
}

module.exports = {
    name: "cmd",
    aliases: [],
    description: "A basic trusted command template",
    usages: [
        'cmd <hash>'
    ],
    permissionLevel: "1",
    working: true,
    async execute(context) {
        const colors = context.config.colors;
        try {
            const core = context.core;
            const args = context.args;
            const serverDetails = context.serverDetails;
            const inputHash = args[args.length - 1];

            //Public Command Logic Here

            if (!await validateHash(context, core, inputHash)) {
                return;
            }

            const newHash = await util.genHash(inputHash === context.hash ? config.main.hashKey : config.main.ownerHashKey);
            if (inputHash !== context.hash) {console.log(`Owner Hash for ${serverDetails.name} - ${newHash}`);};

            if (context.hash === inputHash) {
                context.hash = newHash;
                context.discordBot.sendMessage(`Hash for ${serverDetails.name} - \`${context.hash}\``, 'hash')
            } else {
                context.ownerHash = newHash;
            }

            //Command Logic Here

        } catch (error) {
            const core = context.core
            core.run((new Tellraw("@a", [new Text(`ERROR - ` + error).setColor(colors.errorColor).setHover(error.stack).setCopy(error.stack)])).get());
        }
        return context;
    }
};

/*
Context includes:
- client
- core
- args
- senderUUID
- username
- hash
- ownerHash
- serverDetails
- config
*/