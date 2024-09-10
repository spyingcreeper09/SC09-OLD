const { Tellraw, Text } = require('./../utils/tellraw.js');
const util = require('./../utils/util.js');
const config = require('./../config.json');
const { setTimeout: sleep } = require('timers/promises');

module.exports = {
    name: "cmd",
    aliases: [],
    description: "A trusted template for a command",
    usages: [
        'cmd <hash>'
    ],
    permissionLevel: "2",
    working: true,
    async execute(context) {
        const colors = context.config.colors;
        try {
            const core = context.core;
            const args = context.args; // added this line to define args
            const currentServer = context.currentServer;
            const inputHash = args[args.length - 1]; // corrected how to access the last argument

            //Public Command Logic

            if (context.ownerHash !== inputHash) { // fixed comparison operator
                core.run((new Tellraw("@a", [new Text("Invalid Owner Hash").setColor(colors.error)])).get());
            } else {
                context.ownerHash = util.genHash(config.main.hashKey);
                console.log(`Owner Hash for ${currentServer.name} - ${context.ownerHash}`);

                // Command logic here

            }
        } catch (error) {
            const core = context.core
            core.run((new Tellraw("@a", [new Text(`ERROR - ` + error).setColor(colors.errorColor).setHover(error.stack).setCopy(error.stack)])).get());
        }
        return context;
    }
};

/*
Context:
- client
- core
- args
- senderUUID
- username
- hash
- ownerHash
- currentServer
- config
*/
