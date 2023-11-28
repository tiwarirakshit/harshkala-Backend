const Attribute = require("../../models/Attribute/AttributeModel");


exports.createAttributeCtrl = async (req, res) => {
    try {
        const { name, type } = req.body;
        Attribute.create({
            name,
            type,
        }).then((attributeCreated) => {
            return res.status(200).json({
                message: "Attribute Deleted Successfully",
            })
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}


exports.getAttributeCtrl = async (req, res) => {
    try {
        const {skip} = req.body;
        const attributeFound = await Attribute.find({}).skip(10 * skip).limit(10);
        const attributes = await Attribute.find({});
        return res.status(200).json({
            attribute:attributeFound,
            totalcoupons:attributes.length,
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.deleteAttributeCtrl = async (req, res) => {
    try {
        const { aid } = req.params;
        await Attribute.findByIdAndDelete(aid)
        return res.status(200).json({
            message: "Attribute Deleted Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}