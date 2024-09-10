const snbt = require('mojangson');
const nbt = require('prismarine-nbt');
const toNBTUUID = require('./uuid-to-nbt-uuid.js');

function uuidToMinecraftTarget(uuid) {
  let target = uuid;

  // Check if the input matches UUID format
  if (/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(uuid)) {
    // Convert UUID to NBT format
    target = `@p[nbt=${snbt.stringify(nbt.comp({ UUID: toNBTUUID(uuid) }))}]`;
  }

  return target;
}

module.exports = uuidToMinecraftTarget;
