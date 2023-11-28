const express = require("express");
const { addToCartCtrl, getCartDataCtrl, deleteCartItemCtrl, quantityEditCtrl, saveForLater, getSavedProducts, deleteSavedItemCtrl } = require("../../controller/Cart/CartController");
const router = express.Router();

router.post('/add-to-cart',addToCartCtrl);
router.post('/quantity-edit',quantityEditCtrl)
router.post('/save-for-later',saveForLater)
router.post('/get-saved',getSavedProducts)
router.post('/get-cart-data',getCartDataCtrl);
router.post('/delete-cart-data',deleteCartItemCtrl)
router.post('/delete-saved-data',deleteSavedItemCtrl)

module.exports = router; 