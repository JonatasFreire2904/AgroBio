// migrations/<timestamp>_create_agreements_table.js
exports.up = function(knex) {
  return knex.schema.createTable('agreements', function(table) {
    table.increments('id').primary();
    table.integer('user_from_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('user_to_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('message').notNullable();
    table.date('date').notNullable(); // apenas data (YYYY-MM-DD)
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('agreements');
};
