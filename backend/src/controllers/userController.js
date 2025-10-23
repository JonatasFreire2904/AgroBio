// src/controllers/userController.js
const db = require('../db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

async function me(req, res) {
  try {
    // Temporariamente retornando usuário padrão para demonstração
    const userId = req.query.user_id || 1; // Usar user_id da query ou padrão 1
    const user = await db('users').where({ id: userId }).select('id','name','email','role','city','state','created_at').first();
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Erro me:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}

// Lista simples de usuários (projeto acadêmico — cuidado em produção)
async function list(req, res) {
  try {
    const rows = await db('users').select('id','name','email','role','city','state','created_at');
    res.json(rows);
  } catch (err) {
    console.error('Erro list users:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}

async function create(req, res) {
  try {
    const { name, email, password, role, city, state } = req.body;
    
    // Validação dos campos obrigatórios
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: name, email, password, role' 
      });
    }

    // Validação do role
    if (!['rural', 'biocombustivel'].includes(role)) {
      return res.status(400).json({ 
        error: 'Role deve ser "rural" ou "biocombustivel"' 
      });
    }

    // Verificar se email já existe
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Inserir usuário no banco
    const [userId] = await db('users').insert({
      name,
      email,
      password_hash,
      role,
      city: city || null,
      state: state || null
    });

    // Buscar o usuário criado (sem password_hash)
    const newUser = await db('users')
      .where({ id: userId })
      .select('id', 'name', 'email', 'role', 'city', 'state', 'created_at')
      .first();

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: newUser
    });

  } catch (err) {
    console.error('Erro create user:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function update(req, res) {
  try {
    // Temporariamente usando user_id do body
    const userId = req.body.user_id || 1;

    const { name, city, state } = req.body;
    
    // Verificar se o usuário existe
    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Atualizar apenas os campos fornecidos
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }

    await db('users').where({ id: userId }).update(updateData);

    // Buscar o usuário atualizado
    const updatedUser = await db('users')
      .where({ id: userId })
      .select('id', 'name', 'email', 'role', 'city', 'state', 'created_at')
      .first();

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: updatedUser
    });

  } catch (err) {
    console.error('Erro atualizar perfil:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = { me, list, create, update };
