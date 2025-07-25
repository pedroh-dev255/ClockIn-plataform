const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/authMiddleware.js');
const { GetAllC, CreateC, GetByEmpresaIdC, GetByIdC, UpdateC, getConfigsC } = require('../controllers/EmpController.js');


router.get('/all', middleware, GetAllC );

router.put('/CreateEmp', middleware, CreateC);

router.post('/updateEmp', middleware, UpdateC);

router.get('/getByEmpresaId', middleware, GetByIdC);

router.post('/GetFuncionarios', middleware, GetByEmpresaIdC);

router.get('/getConfigs', middleware, getConfigsC)

module.exports = router;