const { default: slugify } = require("slugify");
const Product = require("../../models/Product/ProductModel");
const CategoryModel = require('../../models/Category/CategoryModel');
const Order = require("../../models/Order/OrderModel");
const User = require("../../models/User/UserModel");
const Category = require("../../models/Category/CategoryModel");
const sendEmail = require('../../utils/SendMail');
const Notifications = require("../../models/Notifications/Notifications");

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

exports.adminCreateProductCtrl = async (req, res, imageUrls) => {
    try {
        const {
            name,
            description,
            price,
            quantity,
            category,
            discountprice,
        } = req.body;

        let vars = [];
        let v = req?.body?.variants;
        if (v) {
            v = JSON.parse(req?.body?.variants);
            if (v.length > 0) {
                vars = v?.map(variant => {
                    return {
                        name: variant?.name,
                        attribute: variant?.attribute,
                        price: variant?.price,
                        discountprice: variant?.discountprice,
                        quantity: variant?.quantity,
                    }
                })
            }
        }


        let productImages = [];
        if (imageUrls) {
            if (imageUrls.length > 0) {
                productImages = imageUrls.map(imageUrl => {
                    return { img: imageUrl }
                });
            }
        } else {
            productImages = null
        }

        if (productImages && req.body.childcategory == null) {

            Product.create({
                name,
                slug: slugify(name),
                description,
                price,
                quantity,
                category,
                parentcategory: req?.body?.parentcategory,
                childcategory: req?.body?.childcategory,
                images: productImages,
                color: req?.body?.color,
                dimensions: req?.body?.dimensions,
                countryoforigin: req?.body?.countryoforigin,
                material: req?.body?.material,
                trending: req?.body?.trending,
                additionalinfo: req?.body?.additionalinfo,
                discountprice,
                tags: req?.body?.tags,
                variants: vars,
                haveVariants: req?.body?.haveVariants,
                havePersonalization: req?.body?.havePersonalization,
                personalizationType: req?.body?.personalizationType,
                summary: req?.body?.summary,
            }).then((product) => {
                return res.status(200).json({
                    product
                })
            })
                .catch(err => {
                    return res.status(500).json({
                        success: false,
                        message: err
                    });
                });
        } else {
            Product.create({
                name,
                slug: slugify(name),
                description,
                price,
                quantity,
                category,
                summary: req?.body?.summary,
                parentcategory: req?.body?.parentcategory,
                color: req?.body?.color,
                dimensions: req?.body?.dimensions,
                countryoforigin: req?.body?.countryoforigin,
                material: req?.body?.material,
                trending: req?.body?.trending,
                images: productImages,
                additionalinfo: req?.body?.additionalinfo,
                discountprice,
                tags: req?.body?.tags,
            }).then((product) => {
                return res.status(200).json({
                    product
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

exports.adminUpdateProductCtrl = async (req, res, imageUrls) => {
    const {
        pid,
    } = req.body;

    let productImages = [];
    if (imageUrls) {
        if (imageUrls.length > 0) {
            productImages = imageUrls.map(imageUrl => {
                return { img: imageUrl }
            });
        }
    } else {
        productImages = null
    }


    if (productImages) {
        await ProductModel.updateMany({ _id: pid },
            {
                $set:
                {
                    name: req?.body?.name,
                    slug: req?.body?.slug,
                    description: req?.body?.description,
                    price: req?.body?.price,
                    quantity: req?.body?.quantity,
                    category: req?.body?.category,
                    countryoforigin: req?.body?.countryoforigin,
                    color: req?.body?.color,
                    additionalinfo: req?.body?.additionalinfo,
                    dimensions: req?.body?.dimensions,
                    trending: req?.body?.trending,
                    images: productImages,
                    material: req?.body?.material,
                    discountprice: req?.body?.discountprice,
                    tags: req?.body?.tags,


                }
            }
        ).then((updatedProduct) => {
            return res.status(200).json({
                message: "Product Updated"
            })
        })
    } else {
        await ProductModel.updateMany({ _id: pid },
            {
                $set:
                {
                    name: req?.body?.name,
                    slug: req?.body?.slug,
                    description: req?.body?.description,
                    price: req?.body?.price,
                    quantity: req?.body?.quantity,
                    category: req?.body?.category,
                    countryoforigin: req?.body?.countryoforigin,
                    color: req?.body?.color,
                    additionalinfo: req?.body?.additionalinfo,
                    dimensions: req?.body?.dimensions,
                    trending: req?.body?.trending,
                    material: req?.body?.material,
                    discountprice: req?.body?.discountprice,
                    tags: req?.body?.tags,

                }
            }
        ).then((updatedProduct) => {
            return res.status(200).json({
                message: "Product Updated"
            })
        })
    }
}

exports.adminDashboardCtrl = async (req, res) => {
    try {
        const currentDate = new Date().getDate();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const orderPrices = await Order.find({}).select('totalprice').select('createdAt');

        var totalsale = 0;
        var todaysale = 0;
        var yesterdaysale = 0;
        var thismonthsale = 0;
        for (let i = 0; i < orderPrices.length; i++) {
            totalsale = totalsale + parseFloat(orderPrices[i]?.totalprice);
            var order = orderPrices[i]?.createdAt?.toString();
            const orderDate = order?.split(' ')[2];
            const orderMonth = months.findIndex(checkOrderMonth);
            function checkOrderMonth(m) {
                return m == order?.split(' ')[1]
            }
            const orderYear = order?.split(' ')[3];

            //Check Todays Order
            if ((currentDate == orderDate) && (currentMonth == orderMonth) && (currentYear == orderYear)) {
                todaysale = todaysale + parseFloat(orderPrices[i]?.totalprice);
            }
            else if ((currentDate - 1 == orderDate) && (currentMonth - 1 == orderMonth) && (currentYear - 1 == orderYear)) {
                yesterdaysale = yesterdaysale + parseFloat(orderPrices[i]?.totalprice);
            } else if ((currentMonth == orderMonth) && (currentYear == orderYear)) {
                thismonthsale = thismonthsale + parseFloat(orderPrices[i]?.totalprice);
            }
        }
        return res.status(200).json({
            totalsale,
            todaysale,
            yesterdaysale,
            thismonthsale,
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminRecentOrderCtrl = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('uid').limit(10).sort({ createdAt: -1 })
        const delivered = await Order.find({ status: "Delivered" });
        const pending = await Order.find({ status: "Pending" });
        const proccessing = await Order.find({ status: "Proccessing" });
        return res.status(200).json({
            recentorders: orders,
            delivered: delivered.length,
            pending: pending.length,
            proccessing: proccessing.length,
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.changeStatusCtrl = async (req, res) => {
    try {
        const { sid, status } = req.body;
        await Order.findByIdAndUpdate(sid, {
            status: status,
        }).then((statusUpdated) => {
            return res.status(200).json({
                message: "Status Updated to " + status,
            })
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminDeleteRecentOrderCtrl = async (req, res) => {
    try {
        const { oid } = req.body;
        await Order.findByIdAndDelete(oid).then((deletedOrder) => {
            return res.status(200).json({
                message: "Order Deleted Successfully",
                success: true,
            })
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminDeleteCustomerCtrl = async (req, res) => {
    try {
        const { cid } = req.body;
        await User.findByIdAndDelete(cid).then((deletedCustomer) => {
            return res.status(200).json({
                message: "Customer Deleted Successfully",
                success: true,
            })
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminDeleteProductCtrl = async (req, res) => {
    try {
        const { pid } = req.body;
        await Product.findByIdAndDelete(pid).then((deletedProduct) => {
            return res.status(200).json({
                message: "Product Deleted Successfully",
                success: true,
            })
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminDeleteCategoryCtrl = async (req, res) => {
    try {
        const { cid } = req.body;
        await Category.findByIdAndDelete(cid).then((deletedCategory) => {
            return res.status(200).json({
                message: "Category Deleted Successfully",
                success: true,
            })
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminAllOrdersCtrl = async (req, res) => {
    try {
        const { skip, name, status } = req.params;
        if (status != 'null' && status != "all") {
            const orders = await Order.find({ status: status }).populate('uid').limit(10).sort({ createdAt: -1 })
            return res.status(200).json({
                orders: orders,
                totalorders: orders.length,
            })
        } else {
            const orders = await Order.find({}).populate('uid').limit(10).sort({ createdAt: -1 }).skip(10 * skip)
            const allorders = await Order.find({})
            const totalorders = allorders.length;
            return res.status(200).json({
                orders: orders,
                totalorders: totalorders,
            })
        }

    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminAllProductsCtrl = async (req, res) => {
    try {
        const { skip, cid, name } = req?.params;
        if (name != 'null') {
            const products = await Product.find({
                $or: [
                    { name: { $regex: name, $options: "i" } },
                ]
            }).populate('category')
            return res.status(200).json({
                products: products,
                totalproducts: products.length,
            })
        } else if (cid != "null") {
            const products = await Product.find({ parentcategory: cid }).populate('category')
            return res.status(200).json({
                products: products,
                totalproducts: products.length,
            })
        } else {
            const products = await Product.find({}).populate('category').limit(10).skip(10 * skip).sort({ createdAt: -1 });
            return res.status(200).json({
                products: products,
                totalproducts: products.length,
            })
        }
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminAllCategoryCtrl = async (req, res) => {
    try {
        const { skip, name } = req.body;
        if (name != "null") {
            const category = await Category.find({
                $or: [
                    { name: { $regex: name, $options: "i" } },
                ]
            }).limit(10).sort({ createdAt: -1 }).populate('parentid').skip(10 * skip)
            return res.status(200).json({
                category,
                totalcategory: category.length,
            })
        }
        else {
            const category = await Category.find({}).limit(10).sort({ createdAt: -1 }).populate('parentid').skip(10 * skip)
            const allcategory = await Category.find({})
            const totalcategory = allcategory.length;
            return res.status(200).json({
                category,
                totalcategory,
            })
        }
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminAllCategoryParentCtrl = async (req, res) => {
    try {
        const category = await Category.find({});
        return res.status(200).json({
            category,
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminAllCustomersCtrl = async (req, res) => {
    try {
        const { skip, keyword } = req.body;
        if (keyword != "null") {
            const customers = await User.find({
                $or: [
                    { name: { $regex: keyword, $options: "i" } },
                    { email: { $regex: keyword, $options: "i" } },
                ]
            })
            return res.status(200).json({
                customers,
                totalcustomers: customers.length,
            })
        } else {
            const customers = await User.find({}).limit(10).skip(skip * 10).sort({ createdAt: -1 })
            const allusers = await User.find({});
            const totalcustomers = allusers.length;
            return res.status(200).json({
                customers,
                totalcustomers: customers.length,
            })
        }

    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.adminCreateHomeCategoryCtrl = async (req, res) => {
    try {
        const { cid } = req.body;
        const category = await Category.findOne({ categoryid: cid });
        if (category) {
            return res.status(200).json({
                message: "Category Allready Created",
                error: true,
                success: false,
            })
        } else {
            Category.create({
                categoryid: cid,
            }).then((categoryCreated) => {
                return res.status(200).json({
                    message: "Category Created",
                    categoryCreated,
                })
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

exports.adminGetHomeCategoryCtrl = async (req, res) => {
    try {
        const category = await Category.find({});
        return res.status(200).json({
            message: "Category Find",
            error: false,
            success: true,
            category
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

exports.adminDeleteHomeCategoryCtrl = async (req, res) => {
    try {
        const { cid } = req.body;
        await Category.findByIdAndDelete(cid).then(() => {
            return res.status(200).json({
                message: "Category Deleted",
                success: true,
            })
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

exports.adminCreateCategoryCtrl = async (req, res, imageUrls) => {

    let productImages = [];
    if (imageUrls) {
        if (imageUrls.length > 0) {
            productImages = imageUrls.map(imageUrl => {
                return { img: imageUrl }
            });
        }
    } else {
        productImages = null
    }

    try {
        const { name } = req.body;
        const existingCategory = await CategoryModel.findOne({ name });
        if (productImages) {

            CategoryModel.create({
                name,
                slug: slugify(name),
                images: productImages,
                parentid: req?.body?.parentid,
            }).then((category) => {
                return res.status(200).json({
                    category
                })
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.adminUpdateCategoryCtrl = async (req, res, imageUrls) => {
    const {
        pid,
    } = req.body;

    let productImages = [];
    if (imageUrls) {
        if (imageUrls.length > 0) {
            productImages = imageUrls.map(imageUrl => {
                return { img: imageUrl }
            });
        }
    } else {
        productImages = null
    }

    if (productImages) {
        await Category.updateMany({ _id: pid },
            {
                $set:
                {
                    name: req?.body?.name,
                    slug: req?.body?.slug,
                    images: productImages,
                }
            }
        ).then((updatedCategory) => {
            return res.status(200).json({
                message: "Category Updated"
            })
        })
    } else {
        await Category.updateMany({ _id: pid },
            {
                $set:
                {
                    name: req?.body?.name,
                    slug: req?.body?.slug,
                }
            }
        ).then((updatedCategory) => {
            return res.status(200).json({
                message: "Category Updated"
            })
        })
    }
}

// exports.contactUsMailCtrl = async (req, res) => {
//     try {
//         const { name, email, phone, message } = req.body;
//         if (req.body.uid == 'null') {
//             var msg = `Hasthkala Contact-Us:\nName: ${name}\nEmail: ${email}\nMobile Number: ${phone}\nMessage: ${message}`
//             Notifications.create({
//                 message: msg,
//                 type: 'Contact',
//                 name:req?.body?.name,
//                 email:req?.body?.email,
//                 phone:req?.body?.phone,
//             }).then(async (notificationCreated) => {
//                 await sendEmail('brickgold62@gmail.com', `${name}: Contacted You!`, msg).then((emailSent) => {
//                     return res.status(200).json({
//                         message: "Message sent",
//                         emailSent: true,
//                     })
//                 })
//             }).catch((error) => {
//                 return res.status(400).json({
//                     message: error
//                 })
//             })
//         } else {
//             Notifications.create({
//                 uid: req.body.uid,
//                 message: req.body.message,
//                 type: 'Contact',
//             }).then(async (notificationCreated) => {
//                 var msg = `Hasthkala Contact-Us:\nName: ${name}\nEmail: ${email}\nMobile Number: ${phone}\nMessage: ${message}`
//                 await sendEmail('brickgold62@gmail.com', `${name}: Contacted You!`, msg).then((emailSent) => {
//                     return res.status(200).json({
//                         message: "Message sent",
//                         emailSent: true,
//                     })
//                 })
//             }).catch((error) => {
//                 return res.status(400).json({
//                     message: error
//                 })
//             })
//         }
//     } catch (error) {
//         return res.status(500).json({
//             message: "Internal Server Error" + error
//         })
//     }
// }
const sendContactUsEmail = async (name, email, phone, message) => {
    try {
        const emailContent = `Hasthkala Contact-Us:\nName: ${name}\nEmail: ${email}\nMobile Number: ${phone}\nMessage: ${message}`;
        await sendEmail('harshhasthkala@gmail.com', `${name}: Contacted You!`, emailContent);
        return true;
    } catch (error) {
        console.error('Error sending contact us email:', error);
        throw new Error('Failed to send contact us email');
    }
};

exports.contactUsMailCtrl = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (req.body.uid == 'null') {
            const emailSent = await sendContactUsEmail(name, email, phone, message);

            if (emailSent) {
                await Notifications.create({
                    message: `Hasthkala Contact-Us:\nName: ${name}\nEmail: ${email}\nMobile Number: ${phone}\nMessage: ${message}`,
                    type: 'Contact',
                    name: req?.body?.name,
                    email: req?.body?.email,
                    phone: req?.body?.phone,
                });

                return res.status(200).json({
                    message: 'Message sent',
                    emailSent: true,
                });
            } else {
                return res.status(400).json({
                    message: 'Failed to send contact us email',
                });
            }
        } else {
            await Notifications.create({
                uid: req.body.uid,
                message: req.body.message,
                type: 'Contact',
            });

            const emailSent = await sendContactUsEmail(name, email, phone, message);

            if (emailSent) {
                return res.status(200).json({
                    message: 'Message sent',
                    emailSent: true,
                });
            } else {
                return res.status(400).json({
                    message: 'Failed to send contact us email',
                });
            }
        }
    } catch (error) {
        console.error('Error processing contact form:', error);

        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};


exports.updateAdminCtrl = async (req, res) => {
    try {
        const { uid } = req.body;
        console.log(uid, 'uid'),
            await User.updateMany({ _id: uid }, {
                $set: {
                    email: req?.body?.email,
                    phone: req?.body?.phone,
                    fullname: req?.body?.fullname,
                }
            }).then((adminUpdated) => {
                return res.status(200).json({
                    message: "Admin Updated",
                    adminUpdated,
                    user: {
                        _id: uid,
                        email: req?.body?.email,
                        phone: req?.body?.phone,
                        password: req?.body?.password,
                        fullname: req?.body?.fullname,
                    },
                })
            })
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error " + error,
        })
    }
}

exports.updateAdminAvatarCtrl = async (req, res, imageUrls) => {
    try {
        const uid = req?.body?.uid;
        if (imageUrls) {
            const avatar = imageUrls[0];
            await User.updateMany({ _id: uid }, {
                $set: {
                    avatar,
                }
            }).then((avatarUpdated) => {
                return res.status(200).json({
                    avatar,
                })
            })
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error " + error,
        })
    }
}

exports.getAdminNotifications = async (req, res) => {
    try {
        const notifications = await Notifications.find({});
        return res.status(200).json({
            notifications,
            totalnotifications:notifications.length,
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error " + error,
        })
    }
}

exports.AdminDeleteNotificationCtrl = async (req, res) => {
    try {
        const { nid } = req.body;
        await Notifications.findByIdAndDelete(nid)
        return res.status(200).json({
            message: "Notifications Deleted Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}