var translations = require("./../data/translations.json");

var colorCodes = {
    reset: "§r",
    white: "§f",
    black: "§0",
    red: "§c",
    dark_red: "§4",
    green: "§a",
    dark_green: "§2",
    light_purple: "§d",
    dark_purple: "§5",
    blue: "§9",
    dark_blue: "§1",
    aqua: "§b",
    dark_aqua: "§3",
    gold: "§6",
    yellow: "§e",
    gray: "§7",
    dark_gray: "§8"
};

var ansicolorsCodes = {
    "§0": "\x1b[30m",
    "§1": "\x1b[34m",
    "§2": "\x1b[32m",
    "§3": "\x1b[36m",
    "§4": "\x1b[31m",
    "§5": "\x1b[35m",
    "§6": "\x1b[33m",
    "§7": "\x1b[37m",
    "§8": "\x1b[90m",
    "§9": "\x1b[94m",
    "§a": "\x1b[92m",
    "§b": "\x1b[96m",
    "§c": "\x1b[91m",
    "§d": "\x1b[95m",
    "§e": "\x1b[93m",
    "§f": "\x1b[97m",
    "§l": "\x1b[1m",
    "§o": "\x1b[3m",
    "§n": "\x1b[4m",
    "§m": "\x1b[9m",
    "§k": "\x1b[6m",
    "§r": "\x1b[0m"
};

var positionEnum = {
    0: "chat",
    1: "system",
    2: "game_info"
};

function parse(data) {
    if (typeof data == "string")
        return data;

    let message = "";
    if (Array.isArray(data)) {
        data.forEach(element => {
            message += parse(element);
        });

        return message;
    }

    let color = (colorCodes[data.color] != null) ? colorCodes[data.color] : "";
    let bold = (data.bold) ? "§l" : "";
    let obfuscated = (data.obfuscated) ? "§k" : "";
    let underlined = (data.underlined) ? "§n" : "";
    let italic = (data.italic) ? "§o" : "";
    let strikethrough = (data.strikethrough) ? "§m" : "";

    let prefix = color + bold + obfuscated + underlined + italic + strikethrough;

    if (data.translate != null && data.text == null) {
        let translation = translations[data.translate] ?? data.translate;
        let withData = [];

        if (data.with != null) {
            data.with.forEach(withElement => {
                withData.push(parse(withElement));
            });
        }

        let matches = translation.match(/%s/g) ?? [];
        for (let i = 0; i < Math.min(matches.length, withData.length); i++) {
            translation = translation.replace("%s", withData[i]);
        }

        message = prefix + translation;
    }

    if (data.text != null) {
        let text = data.text;
        message = prefix + text;
    }

    if (data.extra != null) {
        data.extra.forEach((extraElement) => {
            if (extraElement.color == null && data.color != "reset")
                extraElement.color = data.color || "reset";
            message += parse(extraElement);
        });
    }

    return message;
}

function toAnsi(message) {
    Object.keys(ansicolorsCodes).forEach(key => {
        message = message.replace(new RegExp(key, "g"), ansicolorsCodes[key]);
    });

    return message + ansicolorsCodes["§r"];
}

function cleanMessage(message) {
    return message.replace(/§[\da-or]/g, "");
}

module.exports = {
    positionEnum,
    parse,
    toAnsi,
    cleanMessage
};