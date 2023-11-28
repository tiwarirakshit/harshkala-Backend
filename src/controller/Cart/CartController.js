const { default: slugify } = require("slugify");
const Cart = require('../../models/Cart/CartModel');
const User = require('../../models/User/UserModel');
const Product = require("../../models/Product/ProductModel");
const SaveForLater = require('../../models/SaveForLater/SaveForLaterModel');

exports.addToCartCtrl = async (req, res) => {
    try {
        var usercreated = false;
        var userId = null;
        var uType = null;
        const { pid, uid, quantity } = req.body;
        if (uid == undefined || uid == null) {
            await User.create({
                usertype: "incomplete",
            }).then((userCreated) => {
                userId = userCreated?._id,
                    uType = userCreated?.usertype,
                    usercreated = true
            }).catch((error) => {
                console.log(error);
            })
        }
        const cartFound = await Cart.findOne({ userid: uid || userId, productid: pid })
        if (cartFound) {
            return res.status(400).json({
                message: "Already Added",
            })
        }
        Cart.create({
            userid: (uid || userId),
            productid: pid,
            quantity: quantity,
        }).then(async (cart) => {
            if (usercreated) {
                return res.status(200).json({
                    cart,
                    user: {
                        _id: userId,
                        usertype: uType,
                    },
                    usercreated: usercreated
                })
            } else {
                return res.status(200).json({
                    cart,
                })
            }
        }).catch(err => {
            console.log(err)
            return res.status(500).json({
                success: false,
                message: err
            });
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error
        })
    }
}

exports.quantityEditCtrl = async (req, res) => {
    try {

        const { cid, quantity } = req.body;
        const cartFound = await Cart.findOne({ _id: cid })
        Cart.updateMany({ _id: cid }, {
            $set: {
                quantity: req?.body?.quantity
            }
        }).then((updated) => {
            return res.status(200).json({
                message: "Quantity Updated"
            })
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error
        })
    }
}

exports.getSavedProducts = async (req, res) => {
    try {
        const { uid } = req.body;
        const savedProducts = await SaveForLater.find({ uid: uid }).populate("pid");
        return res.status(200).json({
            status: "Success",
            savedProducts
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
}

exports.saveForLater = async (req, res) => {
    var usercreated = false;
    try {
        const { pid, uid } = req.body;
        console.log(uid, 'uid');
        if (uid == null || uid == undefined) {
            User.create({
                usertype: "incomplete",
            }).then((userCreated) => {
                usercreated = true;
                SaveForLater.create({
                    uid: userCreated?._id,
                    pid
                }).then((saved) => {
                    return res.status(200).json({
                        message: "Saved For Later",
                        usercreated: true,
                        user: {
                            _id: userCreated?._id,
                            usertype: userCreated?.usertype,
                        },
                        sid: saved?._id,
                    })
                }).catch((err) => {
                    return res.status(400).json({
                        message: "Error :- " + err
                    })
                })
            }).catch((error) => {
                console.log(error);
            })
        }

        if (uid) {

            const savedProduct = await SaveForLater.findOne(
                {
                    $and: [
                        { uid },
                        { pid }
                    ]
                }
            );
            if (savedProduct) {
                return res.status(400).json({
                    message: "Already Saved",
                    alreadySaved: true,
                    savedProduct,
                })
            }
            SaveForLater.create({
                uid,
                pid
            }).then((saved) => {
                return res.status(200).json({
                    message: "Saved For Later",
                    sid: saved?._id,
                    usercreated: false,
                })
            })

        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error "+error
        })
    }
}

exports.getCartDataCtrl = async (req, res) => {
    try {
        const { uid } = req.body;
        const cartFound = await Cart.find({ userid: uid }).populate("productid")
        return res.status(200).json({
            cart: cartFound
        })

    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.deleteCartItemCtrl = async (req, res) => {
    try {
        const { cid, initialquantity } = req.body;
        const cartFound = await Cart.findOne({ _id: cid });
        const pid = cartFound?.productid;
        const qty = cartFound?.quantity;
        await Cart.findByIdAndDelete(cid).then(async (success) => {
            await Product.updateMany({ _id: pid }, {
                $set: {
                    quantity: initialquantity + qty
                }
            }).then((updatedProduct) => {
                return res.status(200).json({
                    message: "Cart Item Removed Successfully"
                })
            })
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.deleteSavedItemCtrl = async (req, res) => {
    try {
        const { sid } = req.body;
        await SaveForLater.findByIdAndDelete(sid).then((success) => {
            return res.status(200).json({
                message: "Saved Item Removed Successfully"
            })
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}





