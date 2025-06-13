const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/authMiddleware.js');
const { getAll } = require('../controllers/UsersController.js');

router.get('/users', getAll );



module.exports = router;