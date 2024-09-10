const config = require('./../config.json')
const { Tellraw, Text } = require('./../utils/tellraw.js');

module.exports = {
    name: "echo",
    description: "Echos something in the core",
    aliases: [],
    usages:[`echo <text here>`],
    permissionLevel: "0",
    working: true,
    execute(context) {
        //fix it fucking spamming when you do @echo @echo
        const client = context.client;
        const args = context.args;

        const message = args.join(" ");
        client.chat(message)
    }
};
