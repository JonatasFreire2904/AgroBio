// src/controllers/authController.js
const db = require('../db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

async function register(req, res) {
  try {
    const { name, email, password, role, city, state } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Campos obrigatórios: name, email, password, role' });
    }

    const existing = await db('users').where({ email }).first();
    if (existing) return res.status(400).json({ error: 'Email já cadastrado' });

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const [id] = await db('users').insert({ name, email, password_hash, role, city: city||null, state: state||null });
    const user = await db('users').where({ id }).select('id','name','email','role','city','state','created_at').first();

    // Salvar usuário na sessão
    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      city: user.city,
      state: user.state
    };

    res.status(201).json({ 
      message: 'Usuário cadastrado e logado com sucesso',
      user 
    });
  } catch (err) {
    console.error('Erro register:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email e password são obrigatórios' });

    const user = await db('users').where({ email }).first();
    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: 'Senha incorreta' });

    // Salvar usuário na sessão
    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      city: user.city,
      state: user.state
    };

    // Excluir password_hash antes de retornar
    delete user.password_hash;
    res.json({ 
      message: 'Login realizado com sucesso',
      user 
    });
  } catch (err) {
    console.error('Erro login:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}

async function logout(req, res) {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Erro ao fazer logout:', err);
        return res.status(500).json({ error: 'Erro interno' });
      }
      res.json({ message: 'Logout realizado com sucesso' });
    });
  } catch (err) {
    console.error('Erro logout:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}

module.exports = { register, login, logout };
