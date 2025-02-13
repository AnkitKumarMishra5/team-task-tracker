exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('name').notNull();
      table.string('email').notNull().unique();
      table.timestamps(true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};