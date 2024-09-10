const crypto = require("crypto")
function playeruuid(bot) {
  bot.uuid = (username) => {
      const hash = crypto.createHash('md5').update('OfflinePlayer:' + username).digest();
      hash[6] = hash[6] & 0x0f | 0x30;
      hash[8] = hash[8] & 0x3f | 0x80;
      const hashModified = Buffer.from(hash);
      const result = hashModified.toString('hex');
      const offlineUUID = `${result.slice(0, 8)}-${result.slice(8, 12)}-${result.slice(12, 16)}-${result.slice(16, 20)}-${result.slice(20)}`;
      return offlineUUID;
  };
}
module.exports = playeruuid;