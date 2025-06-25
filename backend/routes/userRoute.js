const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/authMiddleware.js');
const validarResetToken = require('../middlewares/validarResetToken');


const { getAll, loginController, Register, desligamento, resetSenhaController } = require('../controllers/UsersController.js');
const { esqueciSenhaController } = require('../controllers/esqueciSenhaController.js');

router.get('/', middleware, getAll );

router.post('/login', loginController );

router.post('/esqueci-senha', esqueciSenhaController);

router.get('/validadeEsqueciToken/:token', validarResetToken, (req, res) => {
    return res.json({ success: true, message: 'Token válido' });
});

router.post('/resetarSenha/:token', validarResetToken, resetSenhaController);

router.post('/register', middleware, Register);

router.post('/desligamento', middleware, desligamento);

module.exports = router;