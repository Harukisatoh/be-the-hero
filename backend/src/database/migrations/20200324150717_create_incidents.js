
// Creates incidents table
exports.up = function(knex) {
  return knex.schema.createTable('incidents', function(table) {
    // Auto incremented id
    table.increments();
    
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.decimal('value').notNullable();

    // Foreign key
    table.string('ngo_id').notNullable();
    table.foreign('ngo_id').references('id').inTable('ngos');
  });
};

// Drops incidents table
exports.down = function(knex) {
  return knex.schema.dropTable('incidents');
};
