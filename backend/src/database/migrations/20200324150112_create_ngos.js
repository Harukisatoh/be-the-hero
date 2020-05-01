
// Creates NGO's table
exports.up = function (knex) {
  return knex.schema.createTable('ngos', function (table) {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('whatsapp').notNullable();
    table.string('city').notNullable();
    table.string('state', 2).notNullable();
  });
};

// Drops NGO's table
exports.down = function (knex) {
  return knex.schema.dropTable('ngos');
};
