const { Tellraw, Text } = require('./../utils/tellraw.js');
const config = require('./../config.json');
const { setTimeout: sleep } = require('timers/promises');

module.exports = {
    name: "portal",
    aliases: [],
    description: "Spawns a portal to a destination",
    usages: [`portal <y> <x> <z>`],    
    permissionLevel: "0",
    working: true,
    async execute(context) {
        const colors = context.config.colors;
        try {
            const args = context.args;
            const core = context.core;
            const senderUUID = context.senderUUID;

            core.run(`execute at ${senderUUID} run setblock ~ ~ ~ minecraft:end_gateway{ExitPortal:{X:${args[0]},Y:${args[1]},Z:${args[2]}}}`)

            await sleep(200);

            core.run((new Tellraw("@a", [new Text(`Spawned a portal to ${args[0]}, ${args[1]}, ${args[2]}`).setColor(colors.primary)])).get());

        } catch (error) {
            const core = context.core
            core.run((new Tellraw("@a", [new Text(`ERROR - ` + error).setColor(colors.errorColor).setHover(error.stack).setCopy(error.stack)])).get());
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
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
*/