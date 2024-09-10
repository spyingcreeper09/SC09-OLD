const { Tellraw, Text } = require('./../utils/tellraw.js');
const config = require('./../config.json')

module.exports = {
    name: "credits",
    aliases: ['credit'],
    description: "Acknowledgments and Credits for SC09 Bot Project",
    usages: ['credits'],
    permissionLevel: "0",
    working: true,
    execute(context) {
        const colors = context.config.colors;
        const core = context.core;

            const tellraw = new Tellraw("@a", [
                new Text("To the entire kaboom comunity, I hope this finds you well. As I continue the SC09 Bot project, I wanted to take a moment to express my gratitude and acknowledge the invaluable contributions of those who have played a significant role in its development. First and foremost, I extend my heartfelt appreciation to __ChipMC__. Chip's guidance, expertise, and unwavering support have been instrumental throughout this journey. Their insights and advice have not only helped shape the direction of the project but have also served as a source of motivation during challenging times. Not only have they helped my since the beginnig when I first joined the kaboom comunity, but all the way until now. Chip is alwase there when I need him. I would also like to extend my gratitude to Morgan4's team, the creators of RecycleBot, for providing a few of the core components that form the foundation of SC09 Bot. Their commitment to sustainability and innovation has been truly inspiring, and I am honored to incorporate their technology into this project. Furthermore, I must recognize the influence of Parker2991. Parker's creative mind and inteligents have served as a constant source of inspiration. Their work has motivated me to persevere and continue striving for excellence in every aspect of this endeavor. Last but not least, I acknowledge and credit myself as the builder of SC09 Bot. While this project has presented its fair share of challenges, it has also been an immensely rewarding experience. I am proud of the progress we have made and the innovative solutions we have developed along the way. In conclusion, I want to express my sincere gratitude to each of you for your contributions, support, and encouragement throughout this project. SC09 Bot would not have been possible without the collaborative effort of everyone involved. Thank you once again for your dedication and commitment. Best regards, spyingcreeper09").setColor(colors.primary)
            ]);

            const tellrawCommand = tellraw.get();

            core.run(tellrawCommand);
    }
};
