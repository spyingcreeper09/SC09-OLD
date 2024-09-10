const { Tellraw, Text } = require('./../utils/tellraw.js');
const config = require('./../config.json');
const { setTimeout: sleep } = require('timers/promises');
const path = require('path');
const util = require('./../utils/util.js')
const fs = require('fs');
const bots = require('./../data/bots.json');

const botsFilePath = path.resolve(__dirname, './../data/bots.json');

// Function to log bot details by name
function logBotDetails(botName, context) {
    const colors = context.config.colors;
    const bot = bots.find(b => b.name === botName);

    if (bot) {
        const message = new Tellraw("@a", [
            new Text(`\nName: ${bot.name}\n`).setColor(colors.primary),
            new Text(`Owner: ${bot.owner}\n`).setColor(colors.primary),
            new Text(`Language: ${bot.language}\n`).setColor(colors.primary),
            new Text(`Prefix: ${bot.prefix}\n`).setColor(colors.primary),
            new Text(`Notes: ${bot.notes}`).setColor(colors.primary)
        ]).get();
        context.core.run(message);
    } else {
        const message = new Tellraw("@a", [
            new Text(`Bot with name ${botName} not found.`).setColor(colors.errorColor)
        ]).get();
        context.core.run(message);
    }
}

// Function to list all bots
function listAllBots(context) {
    const colors = context.config.colors;
    let messageText = "Bots List:\n";
    bots.forEach(bot => {
        messageText += `${bot.name}, `;
    });
    const message = new Tellraw("@a", [
        new Text(messageText).setColor(colors.primary)
    ]).get();
    context.core.run(message);
}

function listAllData(context) {
    const colors = context.config.colors;
    let messageText = "Bots List:\n";
    bots.forEach(bot => {
        messageText += `${bot.name}, ${bot.owner}, ${bot.prefix}, ${bot.language}, ${bot.notes}\n`;
    });
    messageText = messageText.trim(); // Remove trailing newline characters
    const message = new Tellraw("@a", [
        new Text(messageText).setColor(colors.primary)
    ]).get();
    context.core.run(message);
}

// Function to add a bot
function addBot(name, owner, language, prefix, notes, context) {
    const colors = context.config.colors;
    const bot = { name, owner, language, prefix, notes }; // Include prefix in the bot object
    bots.push(bot);
    fs.writeFileSync(botsFilePath, JSON.stringify(bots, null, 2));
    const message = new Tellraw("@a", [
        new Text(`Bot ${name} added successfully.`).setColor(colors.primary)
    ]).get();
    context.core.run(message);
}

// Function to remove a bot
function removeBot(name, context) {
    const colors = context.config.colors;
    const index = bots.findIndex(b => b.name === name);
    if (index !== -1) {
        bots.splice(index, 1);
        fs.writeFileSync(botsFilePath, JSON.stringify(bots, null, 2));
        const message = new Tellraw("@a", [
            new Text(`Bot ${name} removed successfully.`).setColor(colors.primary)
        ]).get();
        context.core.run(message);
    } else {
        const message = new Tellraw("@a", [
            new Text(`Bot with name ${name} not found.`).setColor(colors.errorColor)
        ]).get();
        context.core.run(message);
    }
}

async function validateHash(context, core, inputHash) {
    try {
        if (context.hash !== inputHash && context.ownerHash !== inputHash) {
            core.run((new Tellraw("@a", [new Text("Invalid Hash").setColor(context.config.colors.errorColor)])).get());
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error in validating hash:", error);
        return false;
    }
}

module.exports = {
    name: "bot",
    aliases: [],
    description: "Manage bots: list, add, remove, or get details",
    usages: [
        'bot list',
        'bot all',
        'bot <botName>',
        'bot add <name> <owner> <language> <prefix> <note(s)> <hash>',
        'bot remove <name> <hash>'
    ],
    permissionLevel: "0",
    working: true,
    async execute(context) {
        const colors = context.config.colors;
        const core = context.core;
        try {
            // Parse arguments
            const args = context.args;

            if (args.length === 0) {
                // No arguments provided, show usage info
                const message = new Tellraw("@a", [
                    new Text(`Usage: bot <botName>, bot list, bot add <name> <owner> <language>, or bot remove <name>`).setColor(colors.primary)
                ]).get();
                context.core.run(message);
            } else if (args[0] === "list") {
                // List all bots
                listAllBots(context);
            } else if (args[0] === "all") {
                    // List all bots
                    listAllData(context);
            } else if (args[0] === "add" && args.length >= 7) { // Ensure at least 7 arguments including prefix and notes
                // Add a new bot
                const inputHash = args[args.length - 1]
                if (!await validateHash(context, core, inputHash)) {
                    return;
                }
                const newHash = await util.genHash(inputHash === context.hash ? config.main.hashKey : config.main.ownerHashKey);
                if (inputHash !== context.hash) {console.log(`Owner Hash for ${context.currentServer.name} - ${newHash}`);};

                if (context.hash === inputHash) {
                    context.hash = newHash;
                } else {
                    context.ownerHash = newHash;
                }
                const name = args[1];
                const owner = args[2];
                const language = args[3];
                const prefix = args[4];
                const notes = args.slice(5, -1).join(" "); // Concatenate all notes
                addBot(name, owner, language, prefix, notes, context);
            }

             else if (args[0] === "remove" && args.length === 3) {
                const inputHash = args[args.length - 1]
                if (!await validateHash(context, core, inputHash)) {
                    return;
                }
                const newHash = await util.genHash(inputHash === context.hash ? config.main.hashKey : config.main.ownerHashKey);
                if (inputHash !== context.hash) {console.log(`Owner Hash for ${context.currentServer.name} - ${newHash}`);};

                if (context.hash === inputHash) {
                    context.hash = newHash;
                } else {
                    context.ownerHash = newHash;
                }
                // Remove a bot
                removeBot(args[1], context);
            } else if (args.length === 1) {
                // Log details for a specific bot
                logBotDetails(args[0], context);
            } else {
                // Invalid usage
                const message = new Tellraw("@a", [
                    new Text(`Invalid usage. Please use the help command if your stuck`).setColor(colors.errorColor)
                ]).get();
                context.core.run(message);
            }
        } catch (error) {
            const core = context.core;
            core.run((new Tellraw("@a", [new Text(`ERROR - ` + error).setColor(colors.errorColor).setHover(error.stack).setCopy(error.stack)])).get());
        }
        return context;
    }
};

/*
Context includes:
- client
- core
- args
- senderUUID
- username
- hash
- ownerHash
- currentServer
- config
*/
