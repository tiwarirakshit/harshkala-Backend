const express = require("express");
const router = express.Router();
const multer = require('multer');
const shortid = require('shortid');
const AWS = require('aws-sdk');
const { adminCreateGiftBoxCtrl, adminUpdateGiftBoxCtrl, adminGetGiftBoxCtrl, deleteGiftBoxCtrl, getAllGiftBoxCtrl } = require("../../controller/GiftBox/GiftBoxController");
require('dotenv').config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION
});

const upload = multer({
    storage: multer.memoryStorage() // Limit the file size if needed
});


router.post('/admin-create-giftbox', upload.array('images'), (req, res) => {
const files = req?.files

    if (files) {
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
                adminCreateGiftBoxCtrl(req, res, imageUrls);
            })
            .catch(error => {
                console.error('Error uploading images:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }else{
        adminCreateGiftBoxCtrl(req,res,null);
    }
});



// UPDATE PRODUCT ROUTE 

router.post('/admin-update-giftbox', upload.array('images'), (req, res) => {
    const files = req?.files;

    if (files) {
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
                adminUpdateGiftBoxCtrl(req, res, imageUrls);
            })
            .catch(error => {
                console.error('Error uploading images:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }else{
        adminUpdateGiftBoxCtrl(req,res,null);
    }
});

router.post('/admin-get-giftbox',adminGetGiftBoxCtrl);
router.post('/admin-delete-giftbox',deleteGiftBoxCtrl);
router.get('/get-all-giftbox',getAllGiftBoxCtrl);

module.exports = router; 