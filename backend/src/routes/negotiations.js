// src/routes/negotiations.js
const express = require('express');
const router = express.Router();
const negotiations = require('../controllers/negotiationController');
// const auth = require('../middlewares/auth'); // Temporariamente removido

router.post('/', negotiations.create); // temporariamente público
router.get('/', negotiations.list); // temporariamente público
router.put('/:id/status', negotiations.updateStatus); // temporariamente público

module.exports = router;
