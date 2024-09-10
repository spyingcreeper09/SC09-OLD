const fs = require('fs');
const path = require('path');
const config = require('./../config.json');
const { Tellraw, Text } = require('./../utils/tellraw.js');

module.exports = {
  name: "help",
  aliases: ['cmd', 'h', 'commands', 'cmds', '?', 'heko'],
  description: "Shows the list of available commands or provides information about a specific command.",
  usages: [
    `help [commandName]`,
    `help`
  ],
  permissionLevel: "0",
  working: true,
  execute(context) {
    const colors = context.config.colors;
    const core = context.core;
    const args = context.args;

    if (!(args.length === 0 || args.length === 1)) {
      const tellraw = new Tellraw("@a", [new Text(`Invalid syntax. Usage: ${this.usage}`).setColor(colors.primary)]);
      core.run(tellraw.get());
    } else {
      const commandFiles = fs.readdirSync(path.join(__dirname, '/')).filter(file => file.endsWith('.js'));

      if (args.length === 0) {
        const publicCommands = [];
        const trustedCommands = [];
        const ownerCommands = [];
        const brokenCommands = []

        commandFiles.forEach(file => {
          const command = require(`./${file}`);
          if (command.permissionLevel === "0" && command.working == true) {
            publicCommands.push(command.name);
          } else if (command.permissionLevel === "1" && command.working == true) {
            trustedCommands.push(command.name);
          } else if (command.permissionLevel === "2" && command.working == true) {
            ownerCommands.push(command.name);
          }
          if (command.working == false){
            brokenCommands.push(command.name)
          }
        });

        const tellraw = new Tellraw("@a", [
          new Text(`( ${commandFiles.length} ) - `).setColor(colors.primary),
          new Text(`(`).setColor(colors.primary),
          new Text(`Public`).setColor(colors.primary),
          new Text(` | `).setColor(colors.primary),
          new Text(`Trusted`).setColor(colors.secondary),
          new Text(` | `).setColor(colors.primary),
          new Text(`Owner`).setColor(colors.tertiary),
          new Text(` | `).setColor(colors.primary),
          new Text(`Broken`).setColor(colors.quaternary),
          new Text(`)`).setColor(colors.primary),
          new Text(`\n`).setColor(colors.primary),

          new Text(publicCommands.join(', ')).setColor(colors.primary),
          new Text(' ' + trustedCommands.join(', ')).setColor(colors.secondary),
          new Text(', ' + ownerCommands.join(', ')).setColor(colors.tertiary),
          new Text(', ' + brokenCommands.join(', ')).setColor(colors.quaternary)
        ]);
        core.run(tellraw.get());
      } else {
        const commandName = args[0];
        let commandFile = commandFiles.find(file => file.split('.')[0] === commandName);

        if (!commandFile) {
          // If command not found by name, check aliases
          commandFile = commandFiles.find(file => {
            const command = require(`./${file}`);
            return command.aliases && command.aliases.includes(commandName);
          });
        }

        if (!commandFile) {
          const tellraw = new Tellraw("@a", [
            new Text(`Command "${commandName}" not found.`).setColor(colors.errorColor)
          ]);
          core.run(tellraw.get());
        } else {
          const command = require(`./${commandFile}`);
          const tellraw = new Tellraw("@a", [
            new Text(`Name: ${command.name}\n`).setColor(colors.primary),
            new Text(` | Aliases: ${command.aliases.join(', ')}\n`).setColor(colors.primary),
            new Text(` | Usage: \n | - ${command.usages.join('\n | - ')}\n`).setColor(colors.primary),
            new Text(` | Description: ${command.description}\n`).setColor(colors.primary),
            new Text(` | Permission Level: ${command.permissionLevel}`).setColor(colors.primary)
          ]);
          core.run(tellraw.get());
        }
      }
    }
  }
};
