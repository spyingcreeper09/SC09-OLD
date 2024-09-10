const fs = require('fs');
const path = require('path');
const { Worker } = require('worker_threads');

if (!fs.existsSync("config.json")) {
    fs.copyFileSync(
        path.join(__dirname, "./data/default.json"),
        path.join(__dirname, "./config.json"),
    );
}

const config = require('./config.json');

console.clear()

for (const serverIndex in config.servers) {
    const currentServer = config.servers[serverIndex];
    const workerData = {
        config: config,
        server: currentServer,
    };
    const worker = new Worker(path.join(__dirname, 'bot.js'), { workerData });

    worker.on('message', (msg) => {
        console.log(`Worker: ${msg}`);
    });

    worker.on('error', (err) => {
        console.error(`Worker encountered an error: ${err.stack}`);
    });

    worker.on('exit', (code) => {
        if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
        }
    });
}