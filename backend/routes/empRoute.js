const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/authMiddleware.js');
const { GetAllC, CreateC } = require('../controllers/EmpController.js');


router.get('/all', middleware, GetAllC );

router.put('/CreateEmp', middleware, CreateC);

module.exports = router;