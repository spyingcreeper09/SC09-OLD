const fs = require("fs");
const path = require("path");
const { Tellraw, Text } = require('./tellraw.js');
const config = require('./../config.json')

class CommandHandler {
    constructor(client, core) {
        this.client = client;
        this.core = core;
        this.commands = new Map();
        this.aliases = new Map();
    }

    loadCommands(commandsDir) {
        fs.readdirSync(commandsDir).forEach(file => {
            const commandPath = path.join(commandsDir, file);
            const command = require(commandPath);
            if (typeof command.execute === "function") {
                this.commands.set(command.name, command);

                // Store aliases if defined
                if (command.aliases && Array.isArray(command.aliases)) {
                    command.aliases.forEach(alias => {
                        this.aliases.set(alias, command.name);
                    });
                }
            } else {
                console.log(`Invalid command file: ${file}`);
            }
        });
    }
    executeCommand(commandName, context) {
        // Check if the command name is an alias, if so, get the actual command name
        const core = context.core;
        const actualCommandName = this.aliases.get(commandName) || commandName;
        const command = this.commands.get(actualCommandName);

        if (!command) {
            const tellraw = new Tellraw("@a", [
                new Text("ERROR: Command ").setColor("gray"),
                new Text(`'${actualCommandName}'`).setColor("red").setUnderlined(true),
                new Text(` is not a command, to get a list of commands please use the help command`).setColor("gray"),
            ]);
            core.run(tellraw.get());
            return;
        }

        // Parse the command file for the variable "working"
        if (command.working === false) {
            const tellraw = new Tellraw("@a", [
                new Text(`Sorry for the inconvenience but the '${actualCommandName}' command is currently nonfunctional`).setColor("gray"),
            ]);
            core.run(tellraw.get());
        } else {
            try {
                command.execute(context);
                return context;
            } catch (error) {
                console.error(`Error executing command "${actualCommandName}":`, error);
                const tellraw = new Tellraw("@a", [
                    new Text(`ERROR: Something happened when executing '${actualCommandName}'`).setColor("red").setHover(error.stack).setCopy(error.stack),
                ]);
                core.run(tellraw.get());
            }
        }
    }
}

module.exports = CommandHandler;
