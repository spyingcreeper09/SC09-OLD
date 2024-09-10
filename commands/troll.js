const { Tellraw, Text } = require('./../utils/tellraw.js');
const util = require('./../utils/util.js');
const config = require('./../config.json');

async function validateHash(context, core, inputHash) {
    if (context.hash !== inputHash && context.ownerHash !== inputHash) {
        core.run((new Tellraw("@a", [new Text("Invalid Hash").setColor("red")])).get());
        return false; 
    }
    return true; 
}

module.exports = {
    name: "troll",
    aliases: [],
    description: "Trolls the user you tell it to.",
    usages: [`troll <username> <hash>`],
    permissionLevel: "1",
    working: true,
    async execute(context) {
        const client = context.client;
        const core = context.core;
        const currentServer = context.currentServer;
        const args = context.args;

        const inputHash = args[args.length - 1];

        if (!await validateHash(context, core, inputHash)) {
            return;
        }

        const newHash = await util.genHash(inputHash === context.hash ? config.main.hashKey : config.main.ownerHashKey);
        if (inputHash !== context.hash) {console.log(`Owner Hash for ${currentServer.name} - ${newHash}`);};

        if (context.hash === inputHash) {
            context.hash = newHash;
        } else {
            context.ownerHash = newHash;
        }

        const target = args[0];
        client.chat("/createjail SC09");
        setTimeout(() => {
            core.run(`execute run deop @a[name="${target}"]`);
            core.run(`mute ${target} trolled lol`);
            core.run(`jail ${target} SC09`);
            core.run(`execute run clear @a[name="${target}"]`);
            core.run(`minecraft:gamemode adventure @a[name="${target}"]`);
            core.run(`speed fly 0 ${target}`);
            core.run(`speed walk 0 ${target}`);
            
            core.run(`effect give @a[name="${target}"] blindness infinite 255`);
            core.run(`effect give @a[name="${target}"] nausea infinite 255`);
            core.run(`effect give @a[name="${target}"] slowness infinite 255`);
            core.run(`effect give @a[name="${target}"] jump_boost infinite 129`);
            core.run(`effect give @a[name="${target}"] darkness infinite 255`);
            core.run(`effect give @a[name="${target}"] night_vision infinite 255`);
            
            core.run(`title @a[name="${target}"] times 1 999999999 1`);
            core.run(`title @a[name="${target}"] title {"text":"Get trolled lol","bold":true,"italic":true,"color":"yellow"}`);
            core.run(`item replace entity @a[name="${target}"] armor.head with carved_pumpkin{display:{Name:'{"text":"Get Trolled :)","color":"yellow","bold":true}',HideFlags:3,Enchantments:[{id:"minecraft:binding_curse",lvl:255s}],AttributeModifiers:[{AttributeName:"generic.movement_speed",Name:"generic.movement_speed",Amount:-999999999,Operation:0,UUID:[I;-2001798044,-1606266919,-1524873864,1510058743]}]} 1`);
        }, 500);

        return context;
    }
};
