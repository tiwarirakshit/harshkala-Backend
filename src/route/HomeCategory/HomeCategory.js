const { addHomeCategoryCtrl, getHomeCategoryCtrl, deleteHomeCategoryCtrl } = require("../../controller/HomeCategory/HomeCategoryCtrl");

const router = require("express").Router();

router.post('/add-home-category',addHomeCategoryCtrl);
router.post('/remove-home-category',deleteHomeCategoryCtrl);
router.post('/get-home-category',getHomeCategoryCtrl);

module.exports = router;
