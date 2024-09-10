const { Tellraw, Text } = require('./../utils/tellraw.js');
const util = require('./../utils/util.js');
const config = require('./../config.json');

async function validateHash(context, core, inputHash) {
    if (context.hash !== inputHash && context.ownerHash !== inputHash) {
        core.run((new Tellraw("@a", [new Text("Invalid Hash").setColor(context.config.colors.errorColor)])).get());
        return false;
    }
    return true;
}

module.exports = {
    name: "genhash",
    aliases: ['gh'],
    description: "Gives someone a valid trusted hash",
    usages: [`genhash <selector> <hash>`],
    permissionLevel: "1",
    working: true,
    async execute(context) {
        const colors = context.config.colors;
        const currentServer = context.currentServer;
        const username = context.username;
        const core = context.core;
        const args = context.args;

        if (args.length < 2) {
            core.run(new Tellraw("@a", [new Text("Invalid Syntax").setColor(colors.errorColor)]).get());
            return;
        }


        const selector = args[0];
        const inputHash = args[1];

        if (!await validateHash(context, core, inputHash)) {
            return;
        }

        const newHash = await util.genHash(inputHash === context.hash ? config.main.hashKey : config.main.ownerHashKey);
        if (inputHash !== context.hash) {
            console.log(`Owner Hash for ${currentServer.name} - ${newHash}`);
        }

        core.run(new Tellraw("@a", [new Text(`Trusted ${selector} with a hash`).setColor(colors.primary)]).get());
        core.run(new Tellraw(selector, [
            new Text(`${username} has trusted you with a hash. Click to copy it\n`).setColor(colors.primary),
            new Text(newHash).setBold(true).setColor(colors.primary).setCopy(newHash).setHover("Click to copy")
        ]).get());

        if (context.hash === inputHash) {
            context.hash = newHash;
        } else {
            context.ownerHash = newHash;
        }

        return context;
    }
};
