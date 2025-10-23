// backend/scripts/insert_users.js
const db = require('../src/db');

async function run() {
  await db('users').insert([
    { name: 'João', email: 'joao@example.com', password_hash: 'dummy', role: 'rural', city: 'RP', state: 'SP' },
    { name: 'Lucas', email: 'lucas@example.com', password_hash: 'dummy', role: 'biocombustivel', city: 'RP', state: 'SP' },
    { name: 'Rafaela', email: 'rafaela@example.com', password_hash: 'dummy', role: 'biocombustivel', city: 'RP', state: 'SP' }
  ]);
  console.log('Usuários inseridos');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
