const { Tellraw, Text } = require('./../utils/tellraw.js');
const config = require('./../config.json');
const { setTimeout: sleep } = require('timers/promises');

module.exports = {
    name: "clearchat",
    aliases: ['cc'],
    description: "Clears Chat",
    usages: [
        `clearChat`
    ],
    permissionLevel: "0",
    working: true,
    async execute(context) {
        const colors = context.config.colors;
        try {
            const client = context.client;
            const core = context.core;

            core.run((new Tellraw("@a", [new Text(('\n').repeat(500) + "Chat Cleared")])).get());

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
- cloop
- args
- senderUUID
- username
- hash
- ownerHash
- currentServer
*/