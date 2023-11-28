const express = require('express');
const {initialDataCtrl, initialCartDataCtrl} = require('../../controller/InitialData/InitialDataController');
const router = express.Router();

router.get('/initialdata',initialDataCtrl);
router.post('/initial-cart-data',initialCartDataCtrl);

module.exports = router;