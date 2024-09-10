const { Client, GatewayIntentBits } = require('discord.js');
const { Tellraw, Text } = require('./tellraw.js');
const config = require('./../config.json');
const path = require('path');
const { DiscordCommandHandler } = require('./commandHandler.js'); // Assuming you have a command handler module

class DiscordBot {
    constructor(currentServer, token) {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessages,
            ],
        });

        this.cmdHandler = new DiscordCommandHandler();

        this.messageQueue = [];
        this.currentServer = currentServer;

        this.client.once('ready', () => {
            this.processMessageQueue();

            this.client.on('messageCreate', async (message) => {
                await this.bridge(message);
            });
        });

        this.client.login(token);
    }

    setCore(core) {
        this.core = core;
    }

    sendMessage(message, channelId) {
        if (!this.client.readyAt) {
            this.messageQueue.push({ message, channelId });
            return;
        }

        const channel = this.client.channels.cache.get(channelId);
        if (channel) {
            const messages = this.chunkMessage(message, 2000);
            messages.forEach(chunk => channel.send(chunk));
        } else {
            console.error(`Unable to find channel with ID "${channelId}".`);
        }
    }

    processMessageQueue() {
        while (this.messageQueue.length > 0) {
            const { message, channelId } = this.messageQueue.shift();
            this.sendMessage(message, channelId);
        }
    }

    async bridge(message) {
        const { bridgeChannelId } = this.currentServer;

        if (message.channel.id === bridgeChannelId && message.author.id !== this.client.user.id) {
            const context = {
                senderUUID: message.author.id,
                username: message.author.username,
                message: message.content,
                core: this.core,
                client: this.client,
                currentServer: this.currentServer,
                discordBot: this,
                config: config
            };

            const matchingPrefix = this.getPrefix(context.message, config.main.prefixes);
            if (matchingPrefix) {
                context.cleanMessage = context.message.slice(matchingPrefix.length).trim();
                context.words = context.cleanMessage.split(/\s+/);
                const commandName = context.words.shift().toLowerCase();
                context.args = context.words;

                this.cmdHandler.loadCommands(path.join(process.cwd(), 'commands'));
                this.cmdHandler.executeCommand(commandName, context);
            } else {
                const tellrawWithPrefix = new Tellraw("@a", [
                    new Text("[").setColor('#1C1C1C').setHover(`Click to join the SC09 discord!`).setURL(config.discord.invite),
                    new Text("SC09 Discord").setColor('#474747').setHover(`Click to join the SC09 discord!`).setURL(config.discord.invite),
                    new Text("]").setColor('#1C1C1C').setHover(`Click to join the SC09 discord!`).setURL(config.discord.invite),
                    new Text(` ${context.username} \u203a ${context.message}`).setColor('white').setHover(`Click to join the SC09 discord!`).setURL(config.discord.invite)
                ], false);

                this.core.run(tellrawWithPrefix.get());
            }
        }
    }

    getPrefix(content, prefixes) {
        for (const prefix of prefixes) {
            if (content.startsWith(prefix)) {
                return prefix;
            }
        }
        return null;
    }

    chunkMessage(message, chunkSize) {
        const chunks = [];
        for (let i = 0; i < message.length; i += chunkSize) {
            chunks.push(message.slice(i, i + chunkSize));
        }
        return chunks;
    }
}

module.exports = DiscordBot;