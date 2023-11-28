const Category = require('../../models/Category/CategoryModel');
const Product = require('../../models/Product/ProductModel');
const User = require('../../models/User/UserModel');
const Cart = require('../../models/Cart/CartModel');

exports.initialDataCtrl = async (req, res) => {
    const categories = await Category.find({});
    const newproducts = await Product.find({}).limit(4).sort({ createdAt: -1 });
    const users = await User.find({});
    const totalUsers = users.length;

    if (categories && newproducts) {
        return res.json({
            newproducts,
            categories,
        })
    }
}

exports.initialCartDataCtrl = async (req, res) => {
    const { uid } = req.body;
    const cart = await Cart.find({ userid: uid });
    const cartItems = cart.length;

    return res.json({
       cartItems,
    })
}


