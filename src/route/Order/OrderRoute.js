const express = require("express");
const { createOrderCtrl, getAllOrderCtrl, getUserOrdersCtrl, createPersonalizedOrderCtrl } = require("../../controller/Order/OrderController");
const router = express.Router();
require('dotenv').config();
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


router.post('/create-personalized-order', upload.array('images'), (req, res) => {
    const files = req?.files
    const cartdata = JSON.parse(req?.body?.cartdata);
    const uid = req?.body?.uid;

    if (files) {
        // Create an array to store the promises for each image upload
        const uploadPromises = files.map(file => {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${shortid.generate()}_${file.originalname}`,
                Body: file.buffer,
                ACL: 'public-read' // Optional: Set the desired access control level
            };

            return s3.upload(params).promise();
        });

        // Execute all upload promises
        Promise.all(uploadPromises)
            .then(uploadedImages => {
                // Create an array of the uploaded image URLs
                const imageUrls = uploadedImages.map(uploadedImage => uploadedImage.Location);

                // Call the createProduct function with the imageUrls
                createPersonalizedOrderCtrl(req, res, imageUrls,cartdata,uid);
            })
            .catch(error => {
                console.error('Error uploading images:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }else{
        createPersonalizedOrderCtrl(req,res,null,cartdata,uid);
    }
});


router.post('/create-order', createOrderCtrl);
router.get('/get-all-orders', getAllOrderCtrl);
router.post('/get-user-orders', getUserOrdersCtrl)

module.exports = router; 