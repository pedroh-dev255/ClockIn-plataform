const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/authMiddleware.js');
const { getAll, loginController, Register } = require('../controllers/UsersController.js');
const { esqueciSenhaController } = require('../controllers/esqueciSenhaController.js');

router.get('/', middleware, getAll );

router.post('/login', loginController );

router.post('/esqueci-senha', esqueciSenhaController);

router.post('/register', middleware, Register);

module.exports = router;