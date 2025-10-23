// src/controllers/residueController.js
const db = require('../db');

async function list(req, res) {
  try {
    const { city, state, title } = req.query;
    let query = db('residues as r').select('r.*', 'u.name as owner_name', 'u.city as owner_city', 'u.state as owner_state')
      .leftJoin('users as u', 'r.user_id', 'u.id');

    if (city) query.where('r.location_city', city);
    if (state) query.where('r.location_state', state);
    if (title) query.where('r.title', 'like', `%${title}%`);

    const rows = await query;
    res.json(rows);
  } catch (err) {
    console.error('Erro listar residues:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}

async function create(req, res) {
  try {
    // Temporariamente usando user_id fixo para demonstração
    const userId = req.body.user_id || 1; // Usar user_id do body ou padrão 1

    const { title, description, quantity, unit, location_city, location_state } = req.body;

    if (!title) return res.status(400).json({ error: 'title é obrigatório' });

    const [id] = await db('residues').insert({
      user_id: userId,
      title,
      description: description || null,
      quantity: quantity || null,
      unit: unit || null,
      location_city: location_city || null,
      location_state: location_state || null
    });

    const created = await db('residues').where({ id }).first();
    res.status(201).json(created);
  } catch (err) {
    console.error('Erro criar residue:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}


module.exports = { list, create };
