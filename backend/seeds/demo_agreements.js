// seeds/<timestamp>_demo_agreements.js
exports.seed = async function(knex) {
  // opcional: limpar tabela (comentar se preferir manter)
  await knex('agreements').del();

  await knex('agreements').insert([
    {
      user_from_id: 1,
      user_to_id: 2,
      message: 'Acordo firmado entre João e Lucas',
      date: '2025-11-12',
      created_at: knex.fn.now()
    },
    {
      user_from_id: 1,
      user_to_id: 3,
      message: 'Acordo firmado entre João e Rafaela',
      date: '2025-11-13',
      created_at: knex.fn.now()
    }
  ]);
};
