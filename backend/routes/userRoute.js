const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/authMiddleware.js');
const { getAll, loginController } = require('../controllers/UsersController.js');

router.get('/', middleware, getAll );

router.post('/login', loginController );


module.exports = router;