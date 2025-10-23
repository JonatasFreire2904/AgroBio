// src/controllers/agreementController.js
const db = require('../db');

async function list(req, res) {
  try {
    const rows = await db('agreements as a')
      .select('a.id','a.message','a.date','a.created_at',
        'uf.id as from_id','uf.name as from_name',
        'ut.id as to_id','ut.name as to_name')
      .leftJoin('users as uf','a.user_from_id','uf.id')
      .leftJoin('users as ut','a.user_to_id','ut.id')
      .orderBy('a.date', 'desc');

    res.json(rows);
  } catch (err) {
    console.error('Erro listar agreements:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}

async function create(req, res) {
  try {
    const { user_from_id, user_to_id, message, date } = req.body;
    if (!user_from_id || !user_to_id || !message || !date) {
      return res.status(400).json({ error: 'Campos obrigatórios: user_from_id, user_to_id, message, date' });
    }

    const [id] = await db('agreements').insert({ user_from_id, user_to_id, message, date });
    const created = await db('agreements').where({ id }).first();
    res.status(201).json(created);
  } catch (err) {
    console.error('Erro criar agreement:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}

module.exports = { list, create };
