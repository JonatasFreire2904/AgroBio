// src/routes/agreements.js
const express = require('express');
const router = express.Router();
const agreements = require('../controllers/agreementController');

router.get('/', agreements.list);
router.post('/', agreements.create);

module.exports = router;
