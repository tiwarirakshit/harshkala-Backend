const Cart = require("../../models/Cart/CartModel");
const Notifications = require("../../models/Notifications/Notifications");
const Order = require("../../models/Order/OrderModel");
const User = require("../../models/User/UserModel");
const sendEmail = require('../../utils/SendMail');

const getEmailContent = (orderName) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }

        img {
            max-width: 50%;
            height: 70px;
        }

        h2 {
            color: green;
        }

        p {
            color: #666;
        }

        a {
            color: green;
            text-decoration: none;
        }
    </style>
</head>

<body>
    <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; font-family: 'Arial', sans-serif;">
        <img src="https://i.postimg.cc/YCqfjSfs/logo.png" alt="Hasthkala Logo" style="max-width: 50%; height: 70px;">
        <h2 style="color: green;">Thank You for Your Order!</h2>
        <p>We are excited to confirm that your order ${orderName} with HarshHasthkala has been successfully placed.</p>
        <p>Your selected items will be carefully prepared and dispatched shortly. We will notify you once your order is on its way.</p>
        <p>If you have any questions or need further assistance, feel free to reach out to us:</p>
        <ul>
            <li>Email: <a href="mailto:harshhasthkala@gmail.com" style="color: green; text-decoration: none;">harshhasthkala@gmail.com</a></li>
            <li>Phone: <a href="tel:+917987600654" style="color: green; text-decoration: none;">+91 79876 00654</a></li>
        </ul>
        <p>Thank you for choosing HarshHasthkala for your shopping needs!</p>
        <p>Best regards,<br> The HarshHasthkala Team</p>
    </div>
</body>

</html>
`;

exports.createOrderCtrl = async (req, res) => {
    try {
        var userUpdated = false;
        const {
            uid,
            status,
            paymentmode,
            totalprice,
            usertype,
            cartdata
        } = req.body;

        if (uid == null) {
            User.create({
                fullname: req?.body?.fullname,
                email: req?.body?.email,
                phone: req?.body?.phone,
                country: req?.body?.country,
                city: req?.body?.city,
                state: req?.body?.state,
                address: req?.body?.address,
                zipcode: req?.body?.zipcode,
                usertype: 'complete',
            }).then((userCreated) => {
                Order.create({
                    uid: userCreated?._id,
                    cartdata,
                    status,
                    paymentmode,
                    totalprice
                }).then(async (order) => {
                    Notifications.create({
                        uid: userCreated?._id,
                        orderName: req?.body?.orderName,
                        orderPrice: totalprice,
                        message: "Your Order has been Created!",
                        type:"Order",
                    }).then(async (notificationCreated) => {
                        await sendEmail(req.body.email, "Order Successfully Placed!", getEmailContent(req?.body?.orderName)).then((emailSent) => {
                            console.log("Email sent");
                        });
                        return res.status(200).json({
                            message: "Order Created Successfully",
                            userUpdated: false,
                            userCreated: true,
                            user: {
                                _id: userCreated?._id,
                                fullname: userCreated?.fullname,
                                state: userCreated?.state,
                                city: userCreated?.city,
                                address: userCreated?.address,
                                country: userCreated?.country,
                                email: userCreated?.email,
                                phone: userCreated?.phone,
                                usertype: userCreated?.usertype,
                            }
                        })
                    })
                })
                    .catch(err => {
                        return res.status(500).json({
                            success: false,
                            message: err
                        });
                    });
            })
        }


        if (usertype == "semi_incomplete" || usertype == "incomplete") {
            await User.updateMany({ _id: uid }, {
                $set: {
                    fullname: req?.body?.fullname,
                    email: req?.body?.email,
                    phone: req?.body?.phone,
                    country: req?.body?.country,
                    city: req?.body?.city,
                    state: req?.body?.state,
                    address: req?.body?.address,
                    zipcode: req?.body?.zipcode,
                    usertype: 'complete',
                }
            }).then((updatedUser) => {
            }).catch((error) => {
                console.log(error, 21);
            })
            userUpdated = true;
        }

        if (uid) {
            Order.create({
                uid,
                cartdata,
                status,
                paymentmode,
                totalprice
            }).then(async (order) => {
                Notifications.create({
                    uid,
                    orderName: req?.body?.orderName,
                    orderPrice: totalprice,
                    message: "Your Order has been Created!",
                    type:"Order",
                }).then(async (notificationCreated) => {
                    await sendEmail(req.body.email, "Order Successfully Placed!", getEmailContent(req?.body?.orderName)).then((emailSent) => {
                        console.log("Email sent");
                    });
                    if (userUpdated) {
                        return res.status(200).json({
                            message: "Order Created Successfully",
                            userUpdated: true,
                        })
                    } else {
                        return res.status(200).json({
                            message: "Order Created Successfully",
                        })
                    }
                })
            })
                .catch(err => {
                    return res.status(500).json({
                        success: false,
                        message: err
                    });
                });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error" + error
        });
    }
}


exports.createPersonalizedOrderCtrl = async (req, res, imageUrls, cartdata, uid) => {
    try {
        var userUpdated = false;
        var orderCreated = false;
        const {
            status,
            paymentmode,
            totalprice,
            usertype,
        } = req.body;
        console.log(uid, 'uid1');

        let customImages = [];
        if (imageUrls) {
            if (imageUrls.length > 0) {
                customImages = imageUrls.map(imageUrl => {
                    return { img: imageUrl }
                });
            }
        } else {
            customImages = null
        }

        if (uid == null || uid == undefined) {
            User.create({
                fullname: req?.body?.fullname,
                email: req?.body?.email,
                phone: req?.body?.phone,
                country: req?.body?.country,
                city: req?.body?.city,
                state: req?.body?.state,
                address: req?.body?.address,
                zipcode: req?.body?.zipcode,
                usertype: 'complete',
            }).then((userCreated) => {
                console.log(userCreated?._id, 'uid2')
                Order.create({
                    uid: userCreated?._id,
                    cartdata,
                    status,
                    paymentmode,
                    totalprice,
                    cartdata,
                    personalization: true,
                    customtext: req?.body?.customText,
                    customlink: req?.body?.customLink,
                    customimg: customImages,
                }).then((order) => {
                    Notifications.create({
                        uid: userCreated?._id,
                        orderName: req?.body?.orderName,
                        orderPrice: totalprice,
                        message: "Your Order has been Created!",
                        type:"Order",
                    }).then(async (notificationCreated) => {
                        await sendEmail(req.body.email, "Order Successfully Placed!", getEmailContent(req?.body?.orderName)).then((emailSent) => {
                            console.log("Email sent");
                        });
                        return res.status(200).json({
                            message: "Order Created Successfully1",
                            userCreated: true,
                            user: {
                                _id: userCreated?._id,
                                fullname: userCreated?.fullname,
                                state: userCreated?.state,
                                city: userCreated?.city,
                                address: userCreated?.address,
                                country: userCreated?.country,
                                email: userCreated?.email,
                                phone: userCreated?.phone,
                                usertype: userCreated?.usertype,
                            }
                        })
                    })
                })
                    .catch(err => {
                        return res.status(500).json({
                            success: false,
                            message: err
                        });
                    });
            })
        }


        if (usertype == "incomplete") {
            await User.updateMany({ _id: uid }, {
                $set: {
                    fullname: req?.body?.fullname,
                    email: req?.body?.email,
                    phone: req?.body?.phone,
                    country: req?.body?.country,
                    city: req?.body?.city,
                    state: req?.body?.state,
                    address: req?.body?.address,
                    zipcode: req?.body?.zipcode,
                    usertype: 'complete',
                }
            }).then((updatedUser) => {
            }).catch((error) => {
                console.log(error, 21);
            })
            userUpdated = true;
        }

        if (uid != null) {
            console.log(uid, 'uid3');
            Order.create({
                uid,
                cartdata,
                status,
                paymentmode,
                totalprice,
                personalization: true,
                customtext: req?.body?.customText,
                customlink: req?.body?.customLink,
                customimg: customImages,
            }).then((order) => {
                Notifications.create({
                    uid: uid,
                    orderName: req?.body?.orderName,
                    orderPrice: totalprice,
                    message: "Your Order has been Created!",
                    type:"Order",
                }).then(async (notificationCreated) => {
                    await sendEmail(req.body.email, "Order Successfully Placed!", getEmailContent(req?.body?.orderName)).then((emailSent) => {
                        console.log("Email sent");
                    });
                    if (userUpdated) {
                        return res.status(200).json({
                            message: "Order Created Successfully3",
                            userUpdated: true,
                            userCreated: false,
                        })
                    } else {
                        return res.status(200).json({
                            message: "Order Created Successfully4",
                        })
                    }
                })
            })
                .catch(err => {
                    return res.status(500).json({
                        success: false,
                        message: err
                    });
                });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

exports.getAllOrderCtrl = async (req, res) => {
    try {
        const orders = await Order.find({});
        return res.status(200).json({
            orders
        })
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

exports.getUserOrdersCtrl = async (req, res) => {
    try {
        const { uid } = req.body;
        const orders = await Order.find({ uid: uid });
        return res.status(200).json({
            orders
        })
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

