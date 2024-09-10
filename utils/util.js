const mc = require('minecraft-protocol');
const crypto = require('crypto');
const config = require('./../config.json')
const path = require('path');
const fs = require('fs');

function getRandomProxy() {
  const proxies = fs.readFileSync('./data/proxies.txt', 'utf8').split('\n');
  const randomIndex = Math.floor(Math.random() * proxies.length);
  const [host, port] = proxies[randomIndex].split(':');
  return { host, port: parseInt(port) };
}

//random string
function genString() {
    const length = Math.floor(Math.random() * (16 - 3 + 1)) + 3;
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
  
    let username = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      username += characters.charAt(randomIndex);
    }
  
    return username;
}

function invisSalt(size) {
  // Read characters from unicode.txt file
  const characters = fs.readFileSync('./data/unicode.txt', 'utf8');

  let suffix = '';
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    suffix += '§' + characters.charAt(randomIndex);
  }

  return suffix;
}

//creates main client
function createClient(ip, port, botName) {
  return mc.createClient({
    host: ip, 
    port: port,
    version: false,
    username: botName,
    checkTimeoutInterval: 690 * 1000,
  });
}


function logInformation(logName, information) {
  const logsFolderPath = path.join(__dirname, 'logs');
  const logFilePath = path.join(logsFolderPath, `${logName}-${config.server.ip}.log`);

  // Create folder if it doesn't exist
  if (!fs.existsSync(logsFolderPath)) {
    fs.mkdirSync(logsFolderPath);
  }

  // Create file if it doesn't exist
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '');
  }

  // Write information to the file
  fs.appendFileSync(logFilePath, `${information}\n`, 'utf8');
}

//get current date
function getDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${month}-${day}-${year}`;
}

function getExactTime(){
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const miliseconds = String(now.getMilliseconds()).padStart(2, '0');

  return `${hours}-${minutes}-${seconds}-${miliseconds}`
}

//get time
function getTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function salt(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset.charAt(randomIndex);
  }
  return result;
}

function genHash(keySeed) {
  const key = crypto.createHash('sha256');
  key.update(keySeed + getExactTime());

  // Return the first 16 characters of the hex digest
  return key.digest('hex').substring(0, 16);
}

module.exports = {
    genString,
    createClient,
    getDate,
    getTime,
    salt,
    invisSalt,
    genHash,
    getExactTime,
    logInformation,
    getRandomProxy
}
