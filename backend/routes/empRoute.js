const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/authMiddleware.js');
const { GetAllC, CreateC, GetByEmpresaIdC } = require('../controllers/EmpController.js');


router.get('/all', middleware, GetAllC );

router.put('/CreateEmp', middleware, CreateC);

router.post('/GetFuncionarios', middleware, GetByEmpresaIdC);

module.exports = router;