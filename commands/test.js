const { Tellraw, Text } = require('./../utils/tellraw.js');
const config = require('./../config.json')

module.exports = {
    name: "test",
    aliases: [],
    description: "Test command for debugging",
    usages: [`test`],    
    permissionLevel: "0",
    working: true,
    async execute(context) {
        const colors = context.config.colors;
        const core = context.core;
        const args = context.args;
        const senderUUID = context.senderUUID;
        const username = context.username;

        if (args.length == 0){
            args.push('None')
        }

        core.run((new Tellraw("@a", [new Text("\nSender UUID\n").setColor(colors.primary).setHover(senderUUID),new Text("Username\n").setColor(colors.primary).setHover(username),new Text("Args").setColor(colors.primary).setHover(args)])).get());

    }
};