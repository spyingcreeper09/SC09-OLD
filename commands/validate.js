const { Tellraw, Text } = require('./../utils/tellraw.js');
const util = require('./../utils/util.js');
const config = require('./../config.json');
const { working } = require('./test.js');

async function validateHash(context, core, inputHash) {
    if (context.hash !== inputHash && context.ownerHash !== inputHash) {
        core.run((new Tellraw("@a", [new Text("Invalid Hash").setColor("red")])).get());
        return false; 
    }
    return true; 
}

module.exports = {
    name: "validate",
    aliases: [],
    description: "Validates a hash",
    usages: [`validate <hash>`],
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

        //Command Logic Here
        if (context.hash === inputHash) {
            context.hash = newHash;
            core.run((new Tellraw("@a", [new Text("Valid Hash").setColor("green")])).get());
        } else {
            context.ownerHash = newHash;
            core.run((new Tellraw("@a", [new Text("Valid Owner Hash").setColor("green")])).get());
        }

        return context;
    }
};