const { default: slugify } = require("slugify");
const GiftCard = require("../../models/GiftCards/GiftCardsModel");

exports.adminCreateGiftCardCtrl = async (req, res, imageUrls) => {
    try {
        const {
            name,
            description,
            price,
            quantity,
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

        // const slugValue = typeof name === 'string' ? slug(name) : '';

        if (productImages) {

            GiftCard.create({
                name,
                // slug: slugValue,
                description,
                price,
                quantity,
                images: productImages,
                color: req?.body?.color,
                dimesnions: req?.body?.dimensions,
                countryoforigin: req?.body?.countryoforigin,
                material: req?.body?.material,
                trending: req?.body?.trending,
                additionalinfo: req?.body?.additionalinfo,
                tags: req?.body?.tags,
            }).then((giftcard) => {
                return res.status(200).json({
                    giftcard
                });
            })
                .catch(err => {
                    return res.status(500).json({
                        success: false,
                        message: err
                    });
                });
        } else {
            GiftCard.create({
                name,
                // slug: slugValue,
                description,
                price,
                quantity,
                color: req?.body?.color,
                dimesnions: req?.body?.dimensions,
                countryoforigin: req?.body?.countryoforigin,
                material: req?.body?.material,
                trending: req?.body?.trending,
                additionalinfo: req?.body?.additionalinfo,
                tags: req?.body?.tags,
            }).then((giftcard) => {
                return res.status(200).json({
                    giftcard
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

exports.adminUpdateGiftCardCtrl = async (req, res, imageUrls) => {
    const {
        gid,
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
        await GiftCard.updateMany({ _id: gid },
            {
                $set:
                {
                    name: req?.body?.name,
                    slug: req?.body?.slug,
                    description: req?.body?.description,
                    price: req?.body?.price,
                    quantity: req?.body?.quantity,
                    countryoforigin: req?.body?.countryoforigin,
                    color: req?.body?.color,
                    additionalinfo: req?.body?.additionalinfo,
                    dimensions: req?.body?.dimensions,
                    trending: req?.body?.trending,
                    images: productImages,
                    material: req?.body?.material,
                    tags: req?.body?.tags,
                }
            }
        ).then((updatedGiftBox) => {
            return res.status(200).json({
                message: "Gift Card Updated"
            })
        })
    } else {
        await GiftCard.updateMany({ _id: gid },
            {
                $set:
                {
                    name: req?.body?.name,
                    slug: req?.body?.slug,
                    description: req?.body?.description,
                    price: req?.body?.price,
                    quantity: req?.body?.quantity,
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
        ).then((updatedGiftCard) => {
            return res.status(200).json({
                message: "GiftCard Updated"
            })
        })
    }
}

exports.adminGetGiftCardCtrl = async (req, res) => {
    try {
        const {skip } = req.body;
        const giftcards = await GiftCard.find({}).limit(10).skip(skip*10);
        return res.status(200).json({
            giftcards,
            totalgiftcards:giftcards.length,
        })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error' + error
        })
    }
}

exports.deleteGiftCardCtrl = async (req, res) => {
    try {
        const { gid } = req.body;
        await GiftCard.findByIdAndDelete(gid)
        return res.status(200).json({
            message: "GiftCard Deleted Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}


exports.getAllGiftCardCtrl = async (req, res) => {
    try {
        const giftcards = await GiftCard.find({});
        return res.status(200).json({
            giftcards,
        })
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}