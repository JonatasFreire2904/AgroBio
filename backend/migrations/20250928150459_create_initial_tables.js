// migrations/<timestamp>_create_initial_tables.js
exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password_hash').notNullable();
      table.string('role').notNullable(); // 'rural' ou 'biocombustivel'
      table.string('city');
      table.string('state');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('residues', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('title').notNullable();
      table.text('description');
      table.float('quantity');
      table.string('unit');
      table.string('location_city');
      table.string('location_state');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('negotiations', function(table) {
      table.increments('id').primary();
      table.integer('residue_id').unsigned().notNullable().references('id').inTable('residues').onDelete('CASCADE');
      table.integer('buyer_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.integer('seller_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.text('message');
      table.string('status').defaultTo('pending');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('messages', function(table) {
      table.increments('id').primary();
      table.integer('negotiation_id').unsigned().notNullable().references('id').inTable('negotiations').onDelete('CASCADE');
      table.integer('sender_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.text('text').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('messages')
    .dropTableIfExists('negotiations')
    .dropTableIfExists('residues')
    .dropTableIfExists('users');
};
