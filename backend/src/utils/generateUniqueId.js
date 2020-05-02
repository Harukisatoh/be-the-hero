const dbConnection = require('../database/connection');
const crypto = require('crypto');

// Exports a function that forces the backend to create an unique id that doesn't exists in the database,
// this is a hexadecimal id that has 4 bytes
module.exports = async function generateUniqueId() {
  const id = crypto.randomBytes(4).toString('HEX');
  const sameIdNGOs = await dbConnection('ngos').select('id').where('id', id);

  if (sameIdNGOs.length == 0) {
    return id;
  } else {
    return await generateUniqueId();
  }
}