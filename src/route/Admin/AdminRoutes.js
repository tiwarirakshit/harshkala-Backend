const express = require("express");
const { adminCreateProductCtrl, adminCreateCategoryCtrl,adminAllCategoryParentCtrl, adminUpdateProductCtrl, adminRecentOrderCtrl, adminAllCustomersCtrl, adminAllOrdersCtrl, adminAllProductsCtrl, adminAllCategoryCtrl, adminDeleteRecentOrderCtrl, adminDashboardCtrl, adminDeleteCustomerCtrl, adminDeleteProductCtrl, adminDeleteCategoryCtrl, adminUpdateCategoryCtrl, adminCreateHomeCategoryCtrl, adminDeleteHomeCategoryCtrl, adminGetHomeCategoryCtrl, contactUsMailCtrl, changeStatusCtrl, updateAdminCtrl, updateAdminAvatarCtrl, getAdminNotifications, AdminDeleteNotificationCtrl } = require("../../controller/Admin/AdminController");
const router = express.Router();
const { adminMobileNoVerificatiion, adminEmailVerification } = require("../../controller/User/UserController");
const multer = require('multer');
const shortid = require('shortid');
const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-south-1'
});

const s3 = new AWS.S3();

const upload = multer({
    storage: multer.memoryStorage() // Limit the file size if needed
});


router.post('/admin-create-product', upload.array('images'), (req, res) => {
    const files = req?.files;

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

        AWS.config.logger = console; // Move it outside of the map function

        // Execute all upload promises
        Promise.all(uploadPromises)
            .then(uploadedImages => {
                // Create an array of the uploaded image URLs
                const imageUrls = uploadedImages.map(uploadedImage => uploadedImage.Location);

                // Call the createProduct function with the imageUrls
                adminCreateProductCtrl(req, res, imageUrls);
            })
            .catch(error => {
                console.error('Error uploading images:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    } else {
        adminCreateProductCtrl(req, res, null);
    }
});



// UPDATE PRODUCT ROUTE 
// router.post('/admin-create-product', upload.array('images'), (req, res) => {
//     const files = req?.files;

//     if (files) {
//         // Processing each file using Promise.all
//         const uploadPromises = files.map(file => {
//             const params = {
//                 Bucket: process.env.AWS_BUCKET_NAME,
//                 Key: `${shortid.generate()}_${file.originalname}`,
//                 Body: file.buffer,
//                 ACL: 'public-read' // Optional: Set the desired access control level
//             };
//             return s3.upload(params).promise();
//         });

//         // Execute all upload promises
//         Promise.all(uploadPromises)
//             .then(uploadedImages => {
//                 // Create an array of the uploaded image URLs
//                 const imageUrls = uploadedImages.map(uploadedImage => uploadedImage.Location);

//                 // Call the createProduct function with the imageUrls
//                 adminCreateProductCtrl(req, res, imageUrls);
//             })
//             .catch(error => {
//                 console.error('Error uploading images:', error);
//                 res.status(500).json({ error: 'Internal Server Error' });
//             });
//     } else {
//         // If no files are provided, call the function with null
//         adminCreateProductCtrl(req, res, null);
//     }
// });

router.post('/admin-update-product', upload.array('images'), (req, res) => {
    const files = req?.files;

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
                adminUpdateProductCtrl(req, res, imageUrls);
            })
            .catch(error => {
                console.error('Error uploading images:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }else{
        adminUpdateProductCtrl(req,res,null);
    }
});


router.post('/admin-create-category', upload.array('images'), (req, res) => {
    const files = req?.files;

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
            const imageUrls = uploadedImages.map(uploadedImage => uploadedImage.Location);
            adminCreateCategoryCtrl(req, res, imageUrls);
        })
        .catch(error => {
            console.error('Error uploading images:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


router.post('/admin-update-category', upload.array('images'), (req, res) => {
    const files = req?.files;

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
                adminUpdateCategoryCtrl(req, res, imageUrls);
            })
            .catch(error => {
                console.error('Error uploading images:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }else{
        adminUpdateCategoryCtrl(req,res,null);
    }
});




// router.post('/admin-create-category')
// router.post('/admin-update-category')
router.get('/admin-dashboard',adminDashboardCtrl)

router.post('/delete-recent-order',adminDeleteRecentOrderCtrl);
router.post('/delete-customer',adminDeleteCustomerCtrl);
router.post('/delete-product',adminDeleteProductCtrl);
router.post('/delete-category',adminDeleteCategoryCtrl);
router.post('/admin-all-category',adminAllCategoryCtrl);
router.get('/admin-all-category-parent',adminAllCategoryParentCtrl)
router.get('/admin-all-products/:skip/:name/:cid',adminAllProductsCtrl)
router.get('/admin-all-orders/:skip/:name/:status',adminAllOrdersCtrl)
router.post('/admin-all-customers',adminAllCustomersCtrl)
router.get('/admin-recent-orders',adminRecentOrderCtrl)

router.post('/admin-mobileverification',adminMobileNoVerificatiion);
router.post('/admin-emailverification',adminEmailVerification);

router.post('/admin-create-home-categories',adminCreateHomeCategoryCtrl);
router.post('/admin-delete-home-categories',adminDeleteHomeCategoryCtrl);
router.get('/admin-get-home-categories',adminGetHomeCategoryCtrl);

router.post('/contact-us-mail',contactUsMailCtrl);
router.post('/change-status',changeStatusCtrl);

router.post('/update-admin',updateAdminCtrl);
router.post('/update-admin-avatar', upload.array('images'), (req, res) => {
    const files = req?.files;
    console.log(files,'files');
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
                updateAdminAvatarCtrl(req, res, imageUrls);
            })
            .catch(error => {
                console.error('Error uploading images:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }else{
        updateAdminAvatarCtrl(req,res,null);
    }
});

router.get('/admin-notifications',getAdminNotifications);
router.post('/admin-delete-notifications',AdminDeleteNotificationCtrl);


module.exports = router; 