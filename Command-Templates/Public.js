const { Tellraw, Text } = require('./../utils/tellraw.js');
const config = require('./../config.json');
const { setTimeout: sleep } = require('timers/promises');

module.exports = {
    name: "cmd",
    aliases: [],
    description: "This is a template for a public command",
    usages: [
        'cmd'
    ],
    permissionLevel: "0",
    working: true,
    async execute(context) {
        try {

            // Command Logic Here

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
- currentServer
- config
*/
