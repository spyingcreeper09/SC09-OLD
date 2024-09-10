const { Tellraw, Text } = require('./../utils/tellraw.js');
const config = require('./../config.json');

module.exports = {
    name: "error",
    aliases: [],
    description: "Throws an error",
    usages: [`error <custom error>`],    
    permissionLevel: "0",
    working: true,
    async execute(context) {
        const colors = context.config;
        try {
            const args = context.args;
            let message;

            if ((args).length == 0){
                message = 'ERROR'
            } else {
                message = args.join(" ");
            }

            throw new Error(message);

        } catch (error) {
            const core = context.core
            core.run((new Tellraw("@a", [new Text(`ERROR - ` + error).setColor(colors.errorColor).setHover(error.stack).setCopy(error.stack)])).get());
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