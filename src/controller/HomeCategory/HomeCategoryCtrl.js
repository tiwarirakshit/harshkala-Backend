const HomeCategory = require("../../models/HomeCategories/HomeCategoryModel");

exports.addHomeCategoryCtrl = async (req, res) => {
    try {
        const { categories } = req.body;
        for (let i = 0; i < categories?.length; i++) {
            HomeCategory.create({
                categoryid:categories[i],
            }).then((attributeCreated) => {
            })
        }
        return res.status(200).json({
            message:"Home Categories Created",
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}


exports.getHomeCategoryCtrl = async (req, res) => {
    try {
        const categories = await HomeCategory.find({});
        return res.status(200).json({
            categories,
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.deleteHomeCategoryCtrl = async (req, res) => {
    try {
        const { hid } = req.body;
        await HomeCategory.findByIdAndDelete(hid)
        return res.status(200).json({
            message: "Home Category Deleted Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}