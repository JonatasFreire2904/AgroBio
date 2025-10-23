// src/controllers/negotiationController.js
const db = require('../db');

// Iniciar uma negociação
async function create(req, res) {
  try {
    // Temporariamente usando buyer_id do body
    const buyerId = req.body.buyer_id || 1;

    const { residue_id, message } = req.body;
    
    if (!residue_id) {
      return res.status(400).json({ error: 'residue_id é obrigatório' });
    }

    // Buscar o resíduo e o vendedor
    const residue = await db('residues as r')
      .select('r.*', 'u.id as seller_id')
      .leftJoin('users as u', 'r.user_id', 'u.id')
      .where('r.id', residue_id)
      .first();

    if (!residue) {
      return res.status(404).json({ error: 'Resíduo não encontrado' });
    }

    if (residue.seller_id === buyerId) {
      return res.status(400).json({ error: 'Você não pode negociar com você mesmo' });
    }

    // Verificar se já existe negociação ativa
    const existingNegotiation = await db('negotiations')
      .where({ residue_id, buyer_id: buyerId, status: 'pending' })
      .first();

    if (existingNegotiation) {
      return res.status(400).json({ error: 'Já existe uma negociação ativa para este resíduo' });
    }

    const [id] = await db('negotiations').insert({
      residue_id,
      buyer_id: buyerId,
      seller_id: residue.seller_id,
      message: message || null,
      status: 'pending'
    });

    const negotiation = await db('negotiations as n')
      .select('n.*', 'r.title as residue_title', 'u.name as seller_name')
      .leftJoin('residues as r', 'n.residue_id', 'r.id')
      .leftJoin('users as u', 'n.seller_id', 'u.id')
      .where('n.id', id)
      .first();

    res.status(201).json(negotiation);
  } catch (err) {
    console.error('Erro criar negociação:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}

// Listar negociações do usuário
async function list(req, res) {
  try {
    // Temporariamente usando user_id da query
    const userId = req.query.user_id || 1;

    const { type } = req.query; // 'buying' ou 'selling'

    let query = db('negotiations as n')
      .select(
        'n.*',
        'r.title as residue_title',
        'r.description as residue_description',
        'r.quantity as residue_quantity',
        'r.unit as residue_unit',
        'buyer.name as buyer_name',
        'buyer.email as buyer_email',
        'seller.name as seller_name',
        'seller.email as seller_email'
      )
      .leftJoin('residues as r', 'n.residue_id', 'r.id')
      .leftJoin('users as buyer', 'n.buyer_id', 'buyer.id')
      .leftJoin('users as seller', 'n.seller_id', 'seller.id');

    if (type === 'buying') {
      query = query.where('n.buyer_id', userId);
    } else if (type === 'selling') {
      query = query.where('n.seller_id', userId);
    } else {
      query = query.where(function() {
        this.where('n.buyer_id', userId).orWhere('n.seller_id', userId);
      });
    }

    const negotiations = await query.orderBy('n.created_at', 'desc');
    res.json(negotiations);
  } catch (err) {
    console.error('Erro listar negociações:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}

// Atualizar status da negociação
async function updateStatus(req, res) {
  try {
    // Temporariamente usando user_id do body
    const userId = req.body.user_id || 1;

    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    // Verificar se o usuário pode atualizar esta negociação
    const negotiation = await db('negotiations')
      .where({ id })
      .where(function() {
        this.where('buyer_id', userId).orWhere('seller_id', userId);
      })
      .first();

    if (!negotiation) {
      return res.status(404).json({ error: 'Negociação não encontrada ou sem permissão' });
    }

    await db('negotiations').where({ id }).update({ status });
    
    const updated = await db('negotiations as n')
      .select('n.*', 'r.title as residue_title')
      .leftJoin('residues as r', 'n.residue_id', 'r.id')
      .where('n.id', id)
      .first();

    res.json(updated);
  } catch (err) {
    console.error('Erro atualizar negociação:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}

module.exports = { create, list, updateStatus };
