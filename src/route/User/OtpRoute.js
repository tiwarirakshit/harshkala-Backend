const express = require("express");
const { mobileNoVerificatiion, emailVerification } = require('../../controller/User/UserController');
const router = express.Router();

//USER ROUTES
router.post('/register/mobileverification',mobileNoVerificatiion);
router.post('/login/mobileverification',mobileNoVerificatiion);
router.post('/login/emailverification',emailVerification);

module.exports = router;