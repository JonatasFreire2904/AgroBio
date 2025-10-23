const express = require('express');
const router = express.Router();
const residues = require('../controllers/residueController');
// const auth = require('../middlewares/auth'); // Temporariamente removido

router.get('/', residues.list); // público - para visualizar ofertas
router.post('/', residues.create); // temporariamente público - para criar ofertas 

module.exports = router;
