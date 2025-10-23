// src/routes/users.js
const express = require('express');
const router = express.Router();
const { me, list, create, update } = require('../controllers/userController');
// const auth = require('../middlewares/auth'); // Temporariamente removido

router.get('/me', me); // temporariamente público
router.get('/', list); // temporariamente público
router.post('/', create); // criar usuário (público)
router.put('/me', update); // temporariamente público

module.exports = router;
