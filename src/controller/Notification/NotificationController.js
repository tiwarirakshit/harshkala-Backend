const Attribute = require("../../models/Attribute/AttributeModel");
const Notifications = require("../../models/Notifications/Notifications");


exports.addNotificationCtrl = async (req, res) => {
    try {
        const { uid,message,orderdata} = req.body;
        Notifications.create({
            uid,
            message,
            orderdata,
        }).then((attributeCreated) => {
            return res.status(200).json({
                message: "Notification Created Successfully",
            })
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}


exports.getNotificationCtrl = async (req, res) => {
    try {
        const {uid} = req.body;
        const notifications = await Notifications.find({uid:uid});
        return res.status(200).json({
            notifications:notifications,
            totalnotifications:notifications.length,
            
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

exports.deleteNotificationCtrl = async (req, res) => {
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