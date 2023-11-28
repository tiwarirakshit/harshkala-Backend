const express = require("express");
const { createAttributeCtrl, getAttributeCtrl, deleteAttributeCtrl } = require("../../controller/Attribute/AttributeController");
const router = express.Router();

router.post('/create-attribute',createAttributeCtrl);
router.post('/get-attribute',getAttributeCtrl);
router.post('/delete-attribute',deleteAttributeCtrl);

module.exports = router; 