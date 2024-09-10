const { Tellraw, Text } = require('./../utils/tellraw.js');
const config = require('./../config.json')

module.exports = {
    name: "stroke",
    aliases: [],
    description: "This is parker in a command",
    usages: [`stroke`],
    permissionLevel: "0",
    working: true,
    async execute(context) {
        const colors = context.config.colors;
        const core = context.core;

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        function generateRandomString(length) {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789;:\\\|,.<?=+-_)*&^%$#@!)>]}[{';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
    
        const startTime = Date.now();
        const duration = getRandomInt(2, 5) * 1000 // Time duration in milliseconds (60 seconds)
        const randomTime = getRandomInt(2, 5); // Random time between 2 and 5 seconds in milliseconds
    
        function randomLogging() {
            const currentTime = Date.now();
            if (currentTime - startTime >= duration) {
                return; // Stop the loop if the specified time is met
            }
    
            const randomLength = getRandomInt(2, 20); // Random length between 2 and 7 characters
            const randomString = generateRandomString(randomLength);
    
            core.run((new Tellraw("@a", [new Text(randomString).setColor(colors.primary)])).get());
    
            setTimeout(randomLogging, randomTime);
        }
    
        // Call the function to start the loop without delay
        randomLogging();
        
    }
};