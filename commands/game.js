const { Tellraw, Text } = require('./../utils/tellraw.js');
const config = require('./../config.json');
const fs = require('fs'); 

// Define available games
const availableGames = [
    "numguess",
    "wordle",
];

let gameData = {};

module.exports = {
    name: "game",
    aliases: [],
    description: "Play a number guessing game",
    usages: [`game list`],
    permissionLevel: "0",
    working: true,
    execute(context) {
        const colors = context.config.colors;
        const core = context.core;
        const args = context.args;
        const username = context.username;

        let tellraw; // Define tellraw variable here

        Object.keys(this).forEach(key => {
            if (typeof this[key] === 'function' && key !== 'execute') {
                addToAvailableGames(key);
            }
        });

        if (args[0] === 'list') {
            const gameList = availableGames.join(', ');
            tellraw = new Tellraw(username, [new Text(`Available games: ${gameList}`).setColor(colors.primary)]);
            return core.run(tellraw.get());
        }

        switch(args[0]) {
            case "numguess":
                switch(args[1]) {
                    case "start":
                        if (args.length !== 2) {
                            tellraw = new Tellraw("@a", [new Text(`Usage: game numguess start`).setColor(colors.primary)]);
                            return core.run(tellraw.get());
                        }

                        // Generate a random number between 1 and 100
                        const secretNumber = Math.floor(Math.random() * 100) + 1;

                        gameData[username] = { secretNumber, attempts: 0 };

                        const tellrawStart = new Tellraw(username, [new Text(`Game started! Guess the number between 1 and 100. Use @game numguess guess <number> to guess`).setColor(colors.primary)]);
                        return core.run(tellrawStart.get());
                        break;

                    case "guess":
                        if (args.length !== 3 || isNaN(parseInt(args[2]))) {
                            tellraw = new Tellraw("@a", [new Text(`Usage: game numguess guess [number]`).setColor(colors.primary)]);
                            return core.run(tellraw.get());
                        }

                        const guess = parseInt(args[2]);
                        if (!gameData[username]) {
                            tellraw = new Tellraw(username, [new Text(`You haven't started a game yet. Use 'game numguess start' to begin.`).setColor(colors.primary)]);
                            return core.run(tellraw.get());
                        }

                        gameData[username].attempts++;

                        if (guess === gameData[username].secretNumber) {
                            const tellrawWin = new Tellraw(username, [new Text(`Congratulations! You guessed the number ${gameData[username].secretNumber} in ${gameData[username].attempts} attempts!`).setColor(colors.primary)]);
                            core.run(tellrawWin.get());
                            delete gameData[username];
                        } else if (guess < gameData[username].secretNumber) {
                            const tellrawLow = new Tellraw(username, [new Text(`Too low! Try again.`).setColor(colors.primary)]);
                            return core.run(tellrawLow.get());
                        } else {
                            const tellrawHigh = new Tellraw(username, [new Text(`Too high! Try again.`).setColor(colors.primary)]);
                            return core.run(tellrawHigh.get());
                        }
                        break;

                    default: 
                        const tellrawDefault = new Tellraw(username, [new Text(`Usage: game numguess [start/guess]`).setColor(colors.primary)]);
                        return core.run(tellrawDefault.get());
                        break;
                }
                break;

            case "wordle": // Moved "wordle" 
                switch(args[1]) {
                    case "start":
                        if (args.length !== 2) {
                            tellraw = new Tellraw("@a", [new Text(`Usage: game wordle start`).setColor(colors.primary)]);
                            return core.run(tellraw.get());
                        }
                    
                        // Read the word list from the file
                        const readFilePromise = new Promise((resolve, reject) => {
                            fs.readFile('./data/blockleWords.txt', 'utf8', (err, data) => {
                                if (err) {
                                    console.error(err);
                                    reject(err);
                                    return;
                                }
                                resolve(data);
                            });
                        });

                        readFilePromise.then((data) => {
                            // Split the file content into an array of words
                            const wordList = data.trim().split('\n');

                            // Select a random word from the list
                            let secretWord = wordList[Math.floor(Math.random() * wordList.length)];
                            secretWord = secretWord.slice(0, -1);

                            // Store the secret word and attempts
                            gameData[username] = { secretWord, attempts: 0 };

                            const tellrawStart = new Tellraw(username, [new Text(`wordle started! Guess the word. Use game wordle guess <word> to guess`).setColor(colors.primary)]);
                            return core.run(tellrawStart.get());
                        }).catch((err) => {
                            console.error(err);
                        });

                        break;

                    case "guess":
                        if (args.length !== 3) {
                            tellraw = new Tellraw("@a", [new Text(`Usage: game wordle guess [word]`).setColor(colors.primary)]);
                            return core.run(tellraw.get());
                        }

                        const guessedWord = args[2].toLowerCase(); // Convert guessed word to lowercase
                        if (!gameData[username]) {
                            tellraw = new Tellraw(username, [new Text(`You haven't started a game yet. Use 'game wordle start' to begin.`).setColor(colors.primary)]);
                            return core.run(tellraw.get());
                        }

                        gameData[username].attempts++;

                        // Check if the guessed word matches the secret word
                        const result = checkWord(guessedWord, gameData[username].secretWord);

                        // Display the result
                        let resultMessage = "";
                        if (result.correct) {
                            resultMessage = `Congratulations! You guessed the word "${gameData[username].secretWord}" in ${gameData[username].attempts} attempts!`;
                            delete gameData[username];
                        } else {
                            resultMessage = `Incorrect guess! ${result.feedback}`;
                        }

                        const tellrawResult = new Tellraw(username, [new Text(resultMessage).setColor(colors.primary)]);
                        return core.run(tellrawResult.get());
                        break;

                    default: 
                        const tellrawDefault = new Tellraw(username, [new Text(`Usage: game wordle [start/guess]`).setColor(colors.primary)]);
                        return core.run(tellrawDefault.get());
                        break;
                }
                break;
                
            default: 
                const tellrawMain = new Tellraw(username, [new Text(`Usage: game <gamename/list>`).setColor(colors.primary)]);
                return core.run(tellrawMain.get());
                break;
        }
    }
};

function addToAvailableGames(commandName) {
    if (!availableGames.includes(commandName)) {
        availableGames.push(commandName);
    }
}

// Function to check the guessed word against the secret word
function checkWord(guessedWord, secretWord) {
    const result = {
        correct: guessedWord === secretWord,
        feedback: ""
    };

    if (result.correct) {
        return result; // If the guessed word matches the secret word, return immediately
    }

    // Initialize an array to store the indices of correctly guessed characters
    const correctIndices = [];

    // Check if each character of the guessed word exists in the secret word
    for (let i = 0; i < guessedWord.length; i++) {
        if (guessedWord[i] === secretWord[i]) {
            correctIndices.push(i); // Store the index of correctly guessed characters
        }
    }

    // Generate the feedback based on correct and incorrect guesses
    for (let i = 0; i < secretWord.length; i++) {
        if (correctIndices.includes(i)) {
            result.feedback += "●"; // Correct character in correct position
        } else if (secretWord.includes(guessedWord[i])) {
            result.feedback += "○"; // Correct character in wrong position
        } else {
            result.feedback += "×"; // Incorrect character
        }
    }

    return result;
}