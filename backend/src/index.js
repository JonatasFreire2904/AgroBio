// src/index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const residueRoutes = require('./routes/residues');
const agreementRoutes = require('./routes/agreements');
const userRoutes = require('./routes/users');
const negotiationRoutes = require('./routes/negotiations');

const app = express();

// Configurar CORS para aceitar credenciais (desenvolvimento)
app.use(cors({
  origin: true, // Permite todas as origens em desenvolvimento
  credentials: true
}));

app.use(bodyParser.json());

// Configurar sessões
app.use(session({
  secret: 'agrobio_secret_key_2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // para desenvolvimento
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// rota de teste
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// rotas principais
app.use('/api/auth', authRoutes);
app.use('/api/residues', residueRoutes);
app.use('/api/agreements', agreementRoutes);
app.use('/api/users', userRoutes);
app.use('/api/negotiations', negotiationRoutes);

// rota catch-all (404)
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
