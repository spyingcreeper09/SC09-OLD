const { Tellraw, Text } = require('./../utils/tellraw.js');
const config = require('./../config.json')

module.exports = {
    name: "core",
    aliases: ['cb', 'run'],
    description: "Runs a command in the core",
    usages: [
        `core rc`,
        `core [command to run]`
    ],
    permissionLevel: "0",
    working: true,
    execute(context) {
        const colors = context.config.colors;
        const core = context.core;
        const args = context.args;

        if (args[0] == 'rc'){
            const tellraw = new Tellraw("@a", [new Text("Core Refilled").setColor(colors.primary)]);
            core.refillCore()
            core.run(tellraw.get())
        } else {
            core.run(args.join(' '))
        }
    }
};