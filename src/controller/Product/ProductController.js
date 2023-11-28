const { default: slugify } = require("slugify");
const ProductModel = require("../../models/Product/ProductModel");
const mongoose = require('mongoose');


exports.getNewProductsCtrl = async (req, res) => {
    try {
        const products = await ProductModel.find({}).populate('category').limit(4).sort({ createdAt: -1 })
        return res.status(200).json({
            products
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error
        })
    }
}

exports.editProductCtrl = async (req, res) => {
    try {
        const { pid } = req.params;
        const updateData = req.body;

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({
                message: "Invalid product ID format"
            });
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            pid,
            { $set: updateData },
            { new: true }
        ).populate('category');

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            product: updatedProduct,
            message: "Product updated successfully"
        });
    } catch (error) {
        console.error("Error in editProductCtrl:", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};



exports.getTrendingProductsCtrl = async (req, res) => {
    try {
        const products = await ProductModel.find({ trending: true }).populate('category').limit(8)
        return res.status(200).json({
            products
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error
        })
    }
}


exports.getProductCtrl = async (req, res) => {
    try {
        const perPage = 8;
        const page = parseInt(req.params.page);
        const sort = req.params.sort;
        const query = {};

        // Pagination logic
        const skip = perPage * (page - 1);

        // Sorting logic
        let sortOptions = {};
        if (sort === "latest") {
            sortOptions = { createdAt: -1 };
        } else if (sort === "pricehightolow") {
            sortOptions = { discountprice: -1 };
        } else if (sort === "pricelowtohigh") {
            sortOptions = { discountprice: 1 };
        }

        const products = await ProductModel.find(query)
            .populate('category')
            .limit(perPage)
            .skip(skip)
            .sort(sortOptions);

        const totalproducts = await ProductModel.countDocuments(query);

        return res.status(200).json({
            products,
            totalproducts
        });
    } catch (error) {
        console.error("Error in getProductCtrl:", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};



exports.singleProductCtrl = async (req, res) => {

    try {
        const product = await ProductModel.findOne({ slug: req.params.slug }).populate('category');
        return res.status(200).json({
            product
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.productPhotoCtrl = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await ProductModel.findById(pid).select("images");
        if (product.images) {
            // res.set("Content-Type",product?.images[0].img.type)
            return res.status(200).send(
                product.images[0].img
            )
        }
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.deleteProductCtrl = async (req, res) => {
    try {
        const { pid } = req.params;
        await ProductModel.findByIdAndDelete(pid).select('-images');
        return res.status(200).json({
            message: "Product Deleted Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.searchProductCtrl = async (req, res) => {
    try {
        const perPage = 8;
        const { keyword, page } = req.params;
        const result = await ProductModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { color: { $regex: keyword, $options: "i" } },
                { additionalinfo: { $regex: keyword, $options: "i" } },
                { material: { $regex: keyword, $options: "i" } },
                { tags: { $regex: keyword, $options: "i" } },
            ]
        }).limit(perPage * page).populate('category')
        return res.status(200).json({
            products: result
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}


exports.filterProductCtrl = async (req, res) => {
    try {
        const perPage = 8;
        const { checked, value, page, type } = req.body;
        let args = {}
        if (checked.length > 0) {
            if(type == "parent"){
                args.parentcategory = checked
            }else if(type == "child"){
                args.category = checked
            }else if(type == "subchild"){
                args.childcategory = checked
            }
        }
        if (value.length > 0) args.price = { $gte: value[0], $lte: value[1] }
        const products = await ProductModel.find(args).limit(perPage * page).populate('category');
        return res.status(200).json({
            products: products
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.relatedProductCtrl = async (req, res) => {
    try {
        const { keyword} = req.params;
        // const result = await ProductModel.find({
        //     $or: [
        //         { name: { $regex: keyword, $options: "i" } },
        //         { description: { $regex: keyword, $options: "i" } },
        //         { color: { $regex: keyword, $options: "i" } },
        //         { additionalinfo: { $regex: keyword, $options: "i" } },
        //         { material: { $regex: keyword, $options: "i" } },
        //         { tags: { $regex: keyword, $options: "i" } },
        //     ]
        // }).limit(6).populate('category')
        const result = await ProductModel.find({}).limit(5).populate('category');
        return res.status(200).json({
            products: result
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}