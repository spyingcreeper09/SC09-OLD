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
    name: "earrape",
    aliases: [],
    description: "Hurts your ears :)",
    usages: [`earrape <hash>`],
    permissionLevel: "1",
    working: true,
    async execute(context) {
        const core = context.core;
        const args = context.args;
        const currentServer = context.currentServer;
        
        const inputHash = args[args.length - 1];

        if (!await validateHash(context, core, inputHash)) {
            return;
        }

        const newHash = await util.genHash(inputHash === context.hash ? config.main.hashKey : config.main.ownerHashKey);
        if (inputHash !== context.hash) {console.log(`Owner Hash for ${currentServer.name} - ${newHash}`);};

        for (let i = 0; i < 8; i++) {
            core.run('sudo * execute at @a run playsound entity.ender_dragon.death master @a ~ ~ ~ 10000 0.1 1')
            core.run('sudo * execute at @a run playsound entity.wither.death master @a ~ ~ ~ 10000 0.1 1')
        }

        if (context.hash === inputHash) {
            context.hash = newHash;
        } else {
            context.ownerHash = newHash;
        }

        return context;
    }
};
