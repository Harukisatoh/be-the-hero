const knex = require('knex');
const configuration = require('../../knexfile');

// Ternary operator to checks in which enviroment we are
const config = process.env.NODE_ENV === 'test' ? configuration.test : configuration.development;

const connection = knex(config);

module.exports = connection;