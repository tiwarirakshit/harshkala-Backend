const { addNotificationCtrl, deleteNotificationCtrl, getNotificationCtrl } = require("../../controller/Notification/NotificationController");

const router = require("express").Router();

router.post('/add-notification',addNotificationCtrl);
router.post('/remove-notifcation',deleteNotificationCtrl);
router.post('/get-notification',getNotificationCtrl);

module.exports = router;
