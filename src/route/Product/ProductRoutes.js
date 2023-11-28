const express = require("express");
const { createProductCtrl,editProductCtrl, updateProductCtrl, getProductCtrl, singleProductCtrl, productPhotoCtrl, deleteProductCtrl, getNewProductsCtrl, searchProductCtrl, filterProductCtrl, getTrendingProductsCtrl, relatedProductCtrl} = require("../../controller/Product/ProductController");
const router = express.Router();
const multer = require('multer');
const shortid = require('shortid');
const AWS = require('aws-sdk');
require('dotenv').config();


const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION
});

const upload = multer({
    storage: multer.memoryStorage() // Limit the file size if needed
});




// CREATE PRODUCT ROUTE 



// GET PRODUCTS ROUTE 
router.get('/get-products/:page/:sort', getProductCtrl);

// GET NEWLY ADDED PRODUCTS
router.get('/new-products', getNewProductsCtrl);

// GET SINGLE PRODUCT ROUTE 
router.get('/single-product/:slug', singleProductCtrl);

router.get('/trending-products',getTrendingProductsCtrl );

router.get('/product-photo/:pid', productPhotoCtrl);

router.delete('/delete-product/:pid', deleteProductCtrl);

router.get('/search-product/:keyword/:page', searchProductCtrl);

router.post('/filter-product', filterProductCtrl);

router.get('/related-products/:keyword', relatedProductCtrl);


router.get('/products/:pid', editProductCtrl);

router.put('/products/:pid', editProductCtrl);




module.exports = router; 