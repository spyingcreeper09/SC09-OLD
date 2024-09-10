const { Tellraw, Text } = require('./../utils/tellraw.js');
const config = require('./../config.json')

module.exports = {
    name: "creator",
    aliases: ['owner'],
    description: "Tells you who my creator is",
    usages: [`creator`],
    permissionLevel: "0",
    working: true,
    execute(context) {
        const colors = context.config.colors;
        const core = context.core;
        const args = context.args;

        if (args.length !== 0) { // change the number to the number of args. Ex: 3 args would be args.length !== 3
            const tellraw = new Tellraw("@a", [new Text(`Invalid syntax. Usage: ${this.usage}`).setColor(colors.primary)]);
            core.run(tellraw.get());
        } else {
        const tellraw = new Tellraw("@a", [
            new Text(`My creator is `).setColor(colors.primary),
            new Text(`s`).setColor("#B3B3B3"),
            new Text(`p`).setColor("#A6A6A6"),
            new Text(`y`).setColor("#999999"),
            new Text(`i`).setColor("#8C8C8C"),
            new Text(`n`).setColor("#808080"),
            new Text(`g`).setColor("#737373"),
            new Text(`c`).setColor("#666666"),
            new Text(`r`).setColor("#595959"),
            new Text(`e`).setColor("#4D4D4D"),
            new Text(`e`).setColor("#404040"),
            new Text(`p`).setColor("#333333"),
            new Text(`e`).setColor("#262626"),
            new Text(`r`).setColor("#1A1A1A"),
            new Text(`0`).setColor("#0D0D0D"),
            new Text(`9`).setColor("#000000")
        ]);
        core.run(tellraw.get());
        }
    }
};