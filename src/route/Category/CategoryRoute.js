const express = require("express");
const { createCategoryCtrl, updateCategoryCtrl,allCategoriesCtrl, singleCategoryCtrl, deleteCategoryCtrl } = require("../../controller/Category/CategoryController");
const router = express.Router();
const multer = require('multer');
const shortid = require('shortid');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION
});

const upload = multer({
    storage: multer.memoryStorage() // Limit the file size if needed
});


router.put('/update-category/:id',updateCategoryCtrl);
router.get('/get-category',allCategoriesCtrl);
router.get('/single-category/:slug',singleCategoryCtrl);
router.delete('/delete-category/:id',deleteCategoryCtrl);

module.exports = router; 