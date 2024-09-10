const { Tellraw, Text } = require('./../utils/tellraw.js');
const config = require('./../config.json');
const { setTimeout: sleep } = require('timers/promises');
const axios = require('axios');

module.exports = {
    name: "uwuify",
    aliases: ['uwu'],
    description: "Makes your text uwu",
    usages: [
        'uwuify <text>'
    ],
    permissionLevel: "0",
    working: true,
    async execute(context) {
        const colors = context.config.colors;
        try {
            const args = context.args;
            const core = context.core;
            let text = args.join(' ')

            text = text.replace(/(?:r|l)/g, 'w');
            text = text.replace(/(?:R|L)/g, 'W');
            text = text.replace(/\bth/g, 'f');
            text = text.replace(/\bove/g, 'uv');
            
            // Add random "uwu" elements
            text = text.replace(/\!+/g, '!!');
            text = text.replace(/\.\.+ /g, '... *sweats* ');
            text = text.replace(/\byou\b/g, 'yuw');
            text = text.replace(/\banyone\b/g, 'anyonye');
            text = text.replace(/\bactually\b/g, 'actuawwy');
            text = text.replace(/\bbut\b/g, 'but owo');
            text = text.replace(/\bgotta\b/g, 'gotta');
            text = text.replace(/\bthis\b/g, 'this *notices*');
        
            core.run((new Tellraw("@a", [new Text(`uwuified - ` + text).setColor(colors.primary)])).get());

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
- args
- senderUUID
- username
- hash
- ownerHash
- serverDetails
- config
*/