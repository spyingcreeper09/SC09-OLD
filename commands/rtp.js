const { Tellraw, Text } = require('./../utils/tellraw.js');
const config = require('./../config.json')

module.exports = {
    name: "rtp",
    aliases: ['tpr'],
    description: "Randomly teleports the player areound the world",
    usages: [`rtp`],    
    permissionLevel: "0",
    working: true,
    execute(context) {
        const colors = context.config.colors;
        const core = context.core;
        const senderUUID = context.senderUUID;
        const username = context.username
        
        const x = Math.floor(Math.random() * 6000000);
        const z = Math.floor(Math.random() * 6000000);
        core.run(`tp ${senderUUID} ${x} 100 ${z}`)
    
        core.run(new Tellraw("@a", [new Text(`Sending ${username} to ${x} 100 ${z}`).setColor(colors.primary).setCopy(`${x} 100 ${z}`)]).get());
    }
};
