const express = require('express');
const router = express.Router();
const { apiExterna } = require('../middlewares/pontoMiddleware');
const { register } = require('../controllers/pontoController');

router.post('/ext/registro', apiExterna, register);

module.exports = router;