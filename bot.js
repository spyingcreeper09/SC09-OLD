const { workerData } = require('worker_threads');
const path = require('path');
const ut = require('./utils/util.js');
const { Tellraw, Text } = require('./utils/tellraw.js');
const { setTimeout: sleep } = require('timers/promises');
const CommandCore = require('./utils/core.js');
const inject = require('./utils/tab_complete.js');
const playeruuid = require('./utils/playeruuid.js');
const CommandHandler = require("./utils/commandHandler.js");

const config = workerData.config;
const currentServer = workerData.server;

let core;
let cmdHandler;
let context = {};
let messageQueue = [];

function checkPrefix(input, prefixes) {
    for (let prefix of prefixes) {
        if (input.startsWith(prefix)) {
            return prefix; // Return the matching prefix
        }
    }
    return null; // Return null if no prefix matches
}

function getUsernameByUUID(client, usernames, uuid) {
    for (let username of usernames) {
        if (client.uuid(username) === uuid) {
            return username;
        }
    }
    return 'Unknown'; // If no match is found
}

async function updateClientPlayers(client) {
    try {
        const response = await client.tabComplete('scoreboard players add ');
        const usernames = response.matches
            .filter(item => !item.tooltip) // Filter out non-usernames
            .map(item => item.match);
        client.players = usernames; // Update the player list in the bot instance

        // Cleanup listener on command completion
        client.once('commandComplete', () => {
            client.removeListener('playerListUpdated');
        });

        return client.players;
    } catch (error) {
        const tellraw = new Tellraw("@a", [new Text(`ERROR`).setColor("gray").setHover(error.stack)]);
        console.log(error);
        core.run(tellraw.get());
        return undefined; // Return undefined in case of an error
    }
}

async function selfCare(client, core) {
    client.chat(`/gamemode creative`);
    core.refillCore();
    await sleep(200);
    client.chat(`/prefix ${config.bot.prefix}`);
    await sleep(200);
    //config options
    if (config.selfCare.godMode == true) {
        client.chat(`/god enable`);
        await sleep(200);
    }
    if (config.selfCare.tpToggle == true) {
        client.chat(`/tptoggle disable`);
        await sleep(200);
    }
    if (config.selfCare.vanish == true) {
        client.chat(`/v on`);
        await sleep(200);
    }
    if (config.selfCare.commandSpy == true) {
        client.chat(`/cspy on`);
        await sleep(200);
    }
}

async function botInstance() {
    const botName = config.bot.randName ? ut.invisSalt(3) + config.bot.staticName + ut.invisSalt(3) : config.bot.staticName;
    const client = ut.createClient(currentServer.ip, currentServer.port, botName);

    client.on('login', (packet) => {
        inject(client);
        playeruuid(client);

        client.on('position', (packet) => {
            const botX = Math.floor(packet.x);
            const botZ = Math.floor(packet.z);

            if (!core) {
                // Initialize core with the initial position
                core = new CommandCore({ x: botX, y: 0, z: botZ }, client);
            } else {
                // Update core position directly
                core.xyz = { x: botX, y: core.xyz.y, z: botZ };
                core.toxyz = {
                    x: botX + config.core.width - 1,
                    y: core.xyz.y + config.core.height - 1,
                    z: botZ + config.core.length - 1
                };
            }

            cmdHandler = new CommandHandler(client, core);


            if (!context.hash) {
                context.hash = ut.genHash(config.main.hashKey);
                context.ownerHash = ut.genHash(config.main.ownerHashKey);
                console.log(`Owner hash for ${currentServer.name} - ${context.ownerHash}`);
            }
        });

        client.once('position', async () => {
            // Initial self-care and message
            selfCare(client, core);
            const tellrawMessage = new Tellraw('@a', [
                new Text('My prefix(s) are ').setColor(config.colors.primary),
                new Text(config.main.prefixes.join(', ')).setColor('#B3B3B3').setHover('Click to copy prefixes').setCopy(config.main.prefixes.join(', ')),
            ]).get();
            core.run(tellrawMessage);
            // Self-care and advertise
            setInterval(async () => {
                selfCare(client, core);
            }, config.selfCare.interval * 1000);

            setInterval(() => {
                const advertiseMessage = new Tellraw('@a', [
                    new Text('My prefix(s) are ').setColor(config.colors.primary),
                    new Text(config.main.prefixes.join(', ')).setColor('#B3B3B3').setHover('Click to copy prefixes').setCopy(config.main.prefixes.join(', ')),
                ]).get();
                core.run(advertiseMessage);
            }, config.main.advertiseInterval * 1000);
        });

        client.on('system_chat', async packet => {
            const message = JSON.stringify(packet)

            // Check if the message contains specific strings and log accordingly
            if (message.includes('God') && message.includes('disabled')) {
                if (config.selfCare.godMode == true) {
                    client.chat(`/god enable`)
                    await sleep(200);
                }
            }
            if (message.includes('Teleportation') && message.includes('enabled')) {
                if (config.selfCare.tpToggleDisable == true) {
                    client.chat(`/tptoggle disable`)
                    await sleep(200);
                }
            }
            if (message.includes('Successfully disabled CommandSpy')) {
                if (config.selfCare.commandSpy == true) {
                    client.chat(`/cspy enable`)
                    await sleep(200);
                }
            }
            if (message.includes(`Vanish for ${botName}: disabled`)) {
                if (config.selfCare.vanish == true) {
                    client.chat(`/v on`)
                    await sleep(200);
                }
            }
        });

        client.on('player_chat', async (packet) => {
            const message = packet.plainMessage;
            context.senderUUID = packet.senderUuid;

            await updateClientPlayers(client);

            let playerKey = getUsernameByUUID(client, client.players, context.senderUUID);

            context.username = playerKey;

            let matchingPrefix = checkPrefix(message, config.main.prefixes);

            if (matchingPrefix) {
                context.cleanMessage = message.slice(matchingPrefix.length); // Use the length of the matching prefix
                context.words = context.cleanMessage.trim().split(/\s+/); // Corrected variable name
                let cn = context.words.shift();
                const commandName = cn.toLowerCase();
                context.args = context.words; // The remaining words after removing the first one
                context.core = core;
                context.client = client;
                context.currentServer = currentServer;
                context.config = config;
                cmdHandler.loadCommands(path.join(process.cwd(), 'commands'));
                cmdHandler.executeCommand(commandName, context);
            }
        });
    });

    client.on("game_state_change", (packet) => {
        if(packet.reason === 3) {
          if(packet.gameMode !== 1) {
            client.chat("/gamemode creative");
          }
        }
    })

    client.on('error', (error) => {
        console.log(error)
    });

    client.on('end', async () => {
        await sleep(config.main.reconnectDelay * 1000);
        botInstance();
    });
}

botInstance();