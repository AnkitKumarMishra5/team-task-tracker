exports.up = function(knex) {
  return knex.schema.createTable('todos_assignment', function(table) {
      table.increments('id').primary();
      table.integer('todo_id').notNull().references('id').inTable('todos').onDelete('CASCADE');
      table.integer('user_id').notNull().references('id').inTable('users').onDelete('CASCADE');;
      table.timestamps(true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('todos-assignment');
};