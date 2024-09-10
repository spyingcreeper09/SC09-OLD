const { Tellraw, Text } = require('./../utils/tellraw.js');
const config = require('./../config.json');
const playeruuid = require("./../utils/playeruuid.js");

module.exports = {
    name: "uuid",
    aliases: ['UUID'],
    description: "Tells the sender their UUID",
    usages: [`uuid <username>`],
    permissionLevel: "0",
    working: true,
    execute(context) {
        const core = context.core;
        const colors = context.config.colors;
        const args = context.args;
        
        if (args.length !== 1) {
            const tellraw = new Tellraw('@a', [new Text(`Usage: ${config.main.prefix}uuid <username>`).setColor(colors.primary)]);
            return core.run(tellraw.get());
        }

        playeruuid(context.client);

        const username = args[0];
        const uuid = context.client.uuid(username);

        const tellraw = new Tellraw('@a', [
            new Text(`${username}'s UUID is `).setColor(colors.primary),
            new Text(uuid).setColor(colors.primary).setUnderlined(true).setCopy(uuid)
        ]);
        core.run(tellraw.get());
    }
};
