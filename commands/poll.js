const { Tellraw, Text } = require('./../utils/tellraw.js');
const config = require('./../config.json');

// Define an object to store active polls, where keys are poll indexes and values are poll objects
let activePolls = {};

// Define an object to store which players have voted on which polls
let playerVotes = {};

module.exports = {
    name: "poll",
    aliases: [],
    description: "Create, vote on, list, or end polls",
    usages: [
        `poll create <question> <time in seconds>`,
        `poll end <index>`,
        `poll vote <index> [1/0/yes/no]`,
    ],
    permissionLevel: "0",
    working: true,
    execute(context) {
        const colors = context.config.colors;
        const core = context.core;
        const args = context.args;
        const username = context.username;
        let tellraw; // Define tellraw variable here

        if (args[0] === 'create') {
            return this.createPoll(core, username, args, colors);
        } else if (args[0] === 'list') {
            return this.listPolls(core, username, colors);
        } else if (args[0] === 'end') {
            return this.endPollCommand(core, username, args, colors);
        } else if (args[0] === 'vote') {
            return this.votePoll(core, username, args, colors);
        } else {
            tellraw = new Tellraw(username, [new Text(`Invalid command. Usage: ${config.main.prefix}poll <create/end/vote/list>`).setColor(colors.primary)]);
            return core.run(tellraw.get());
        }
    },

    createPoll(core, username, args, colors) {
        let tellraw;
        if (args.length < 3 || isNaN(parseInt(args[args.length - 1]))) {
            tellraw = new Tellraw(username, [new Text(`Usage: ${config.main.prefix}poll create <question> <time_limit_in_seconds>`).setColor(colors.primary)]);
            return core.run(tellraw.get());
        }

        const question = args.slice(1, -1).join(' ');
        const timeLimit = parseInt(args[args.length - 1]);
        const index = Object.keys(activePolls).length + 1;
        const startTime = Date.now();

        // Create a new poll with the given question, time limit, and index
        const newPoll = { index, question, timeLimit, startTime, votes: [0, 0] };
        activePolls[index] = newPoll;

        // Announce the created poll with the question, index, and time remaining
        tellraw = new Tellraw("@a", [
            new Text(`Poll ${index}:`).setColor(colors.primary),
            new Text(` ${question}`).setColor("white"),
            new Text(` (${timeLimit} seconds remaining)`).setColor(colors.primary)
        ]);
        core.run(tellraw.get());

        // Schedule the 50% warning and countdown
        const warningTime = Math.ceil(timeLimit / 2);

        setTimeout(() => {
            const warningText = new Tellraw("@a", [new Text(`Poll ${index}: ${warningTime} seconds left`).setColor("yellow")]);
            core.run(warningText.get());
        }, (warningTime - 10) * 1000); // 10 seconds before 50% warning

        setTimeout(() => {
            const countdownText = new Tellraw("@a", [new Text(`Poll ${index} will end in 10 seconds.`).setColor("red")]);
            core.run(countdownText.get());

            // Schedule the poll to end after 10 seconds
            setTimeout(() => {
                this.endPoll(core, index, colors);
            }, 10 * 1000); // 10 seconds
        }, (timeLimit - 10) * 1000); // 10 seconds before end
    },

    listPolls(core, username, colors) {
        let tellraw;
        if (Object.keys(activePolls).length === 0) {
            tellraw = new Tellraw(username, [new Text("There are no active polls.").setColor(colors.primary)]);
            return core.run(tellraw.get());
        }

        Object.values(activePolls).forEach(poll => {
            const timeRemaining = Math.max(0, Math.ceil((poll.startTime + poll.timeLimit * 1000 - Date.now()) / 1000));
            tellraw = new Tellraw(username, [
                new Text(`Poll ${poll.index}:`).setColor(colors.primary),
                new Text(` ${poll.question}`).setColor("white"),
                new Text(` (${timeRemaining} seconds remaining)`).setColor(colors.primary)
            ]);
            core.run(tellraw.get());
        });
    },

    endPollCommand(core, username, args, colors) {
        let tellraw;
        if (args.length !== 2 || isNaN(parseInt(args[1]))) {
            tellraw = new Tellraw(username, [new Text(`Usage: ${config.main.prefix}poll end <index>`).setColor(colors.primary)]);
            return core.run(tellraw.get());
        }

        const index = parseInt(args[1]);
        this.endPoll(core, index, colors);
    },

    votePoll(core, username, args, colors) {
        let tellraw;
        if (args.length !== 3 || isNaN(parseInt(args[1])) || !['0', '1', 'yes', 'no'].includes(args[2].toLowerCase())) {
            tellraw = new Tellraw(username, [new Text(`Usage: ${config.main.prefix}poll vote <index> <vote>`).setColor(colors.primary)]);
            return core.run(tellraw.get());
        }

        const index = parseInt(args[1]);
        let vote = args[2].toLowerCase();

        // Convert "yes" to 1 and "no" to 0
        vote = vote === 'yes' ? 1 : vote === 'no' ? 0 : parseInt(vote);

        if (!playerVotes[username]) {
            playerVotes[username] = [];
        }

        if (playerVotes[username].includes(index)) {
            tellraw = new Tellraw(username, [new Text(`You have already voted on poll ${index}.`).setColor(colors.primary)]);
            return core.run(tellraw.get());
        }

        const poll = activePolls[index];

        if (poll) {
            // Increment the corresponding vote
            poll.votes[vote]++;

            // Record that the player has voted on this poll
            playerVotes[username].push(index);

            // Inform the user that their vote has been recorded
            tellraw = new Tellraw(username, [new Text(`Your vote (${vote}) for poll ${index} has been recorded.`).setColor(colors.primary)]);
            core.run(tellraw.get());
        } else {
            // Inform the user that the specified poll does not exist
            tellraw = new Tellraw(username, [new Text(`Poll ${index} does not exist.`).setColor(colors.primary)]);
            core.run(tellraw.get());
        }
    },

    endPoll(core, index, colors) {
        const poll = activePolls[index];

        if (poll) {
            const totalVotes = poll.votes.reduce((acc, curr) => acc + curr, 0);
            const yesPercentage = totalVotes === 0 ? 0 : (poll.votes[1] / totalVotes) * 100;
            const noPercentage = totalVotes === 0 ? 0 : (poll.votes[0] / totalVotes) * 100;

            const tellrawResults = new Tellraw("@a", [
                new Text(`Poll ${poll.index} Results:`).setColor(colors.primary),
                new Text(`\n${poll.question}`).setColor("white"),
                new Text(`\nYes: ${poll.votes[1]} votes (${yesPercentage.toFixed(2)}%)`).setColor("green"),
                new Text(`\nNo: ${poll.votes[0]} votes (${noPercentage.toFixed(2)}%)`).setColor("red")
            ]);
            core.run(tellrawResults.get());

            // Remove the poll from active polls
            delete activePolls[index];
        }
    }
};
