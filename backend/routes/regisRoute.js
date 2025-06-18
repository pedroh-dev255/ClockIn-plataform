const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/authMiddleware.js');
const { getAllController, getAllByUser } = require('../controllers/RegisController.js');


router.get('/',middleware, getAllController);

router.post('/byUser', middleware, getAllByUser)

module.exports = router;