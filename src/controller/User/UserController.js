const User = require('../../models/User/UserModel');
const twilio = require('twilio');
const saltRounds = 11;
const bcrypt = require("bcryptjs");
const { ExternalCampaignListInstance } = require('twilio/lib/rest/messaging/v1/externalCampaign');
const sendEmail = require('../../utils/SendMail');
const sendOtp = require('../../utils/SendOtp');

exports.googleSignUp = async (req, res) => {
    try {
        const {
            email,
            fullname,
            avatar,
            googleid,
        } = req.body;

        const userFound = await User.findOne({ email });
        if (userFound) {
            return res.status(200).json({
                success: true,
                logintype: 'google',
                user: {
                    _id: userFound?._id,
                    email: userFound?.email,
                    fullname: userFound?.fullname,
                    phone: userFound?.phone,
                    city: userFound?.city,
                    state: userFound?.state,
                    country: userFound?.country,
                    zipcode: userFound?.zipcode,
                    address: userFound?.address,
                    usertype: userFound?.usertype,
                    avatar: userFound?.avatar,
                }
            })
        } else {
            User.create({
                email,
                googleid,
                fullname,
                avatar,
                usertype: "incomplete"
            }).then((savedUser) => {
                return res.status(200).json({
                    user: {
                        _id: savedUser?._id,
                        fullname: savedUser?.fullname,
                        email: savedUser?.email,
                        avatar: savedUser?.avatar,
                        usertype: savedUser?.usertype,
                    },
                    success: true,
                    logintype: 'google',
                })
            }).catch((err) => {
                return res.status(403).json({
                    success: false,
                    message: err,
                })
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
}

exports.userSignUp = async (req, res) => {
    try {
        const {
            email,
            phone,
            fullname,
        } = req.body;

        const userFound = await User.findOne({ email });
        if (!userFound) {

            let password = req.body.password;
            User.create({
                fullname,
                email,
                phone,
                password: password,
                isAdmin: req?.body?.isAdmin
            }).then(savedUser => {
                return res.status(200).json({
                    success: true,
                    user: {
                        _id: savedUser?._id,
                        fullname: savedUser?.fullname,
                        email: savedUser?.email,
                        phone: savedUser?.phone,
                        isAdmin: savedUser?.isAdmin
                    },
                });
            })
                .catch(err => {
                    return res.status(500).json({
                        success: false,
                        message: "Internal server error"
                    });
                });
        } else {
            return res.status(400).json({
                success: false,
                message: "User Already Registered"
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


exports.userLogin = async (req, res) => {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (!userFound) {
        return res.status(401).json({
            message: "User Not Registered",
        })
    }

    if (userFound && (userFound?.password == password)) {
        return res.status(200).json({
            user: {
                _id: userFound?._id,
                fullname: userFound?.fullname,
                email: userFound?.email,
                city: userFound?.city,
                state: userFound?.state,
                address: userFound?.address,
                phone: userFound?.phone,
                isAdmin: userFound?.isAdmin,
                avatar: userFound?.avatar,
            }
        })
    } else {
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }

}

exports.updateUser = async (req, res) => {
    const { email, password, usertype } = req.body;

    if (usertype == "incomplete") {
        await User.updateMany({ _id: req?.body?.uid }, {
            $set: {
                fullname: req?.body?.fullname,
                email: req?.body?.email,
                password: req?.body?.password,
                usertype: 'semi_incomplete'
            }
        }).then((userupdated) => {
            return res.status(200).json({
                user: {
                    _id: req?.body?.uid,
                    fullname: req?.body?.fullname,
                    email: req?.body?.email,
                    password: req?.body?.password,
                    usertype: 'complete'
                }
            })
        })
    } else {
        const userFound = await User.findOne({ email });

        if (userFound && (userFound?.password == password)) {
            await User.updateMany({ email: email }, {
                $set: {
                    fullname: req.body?.fullname,
                    city: req.body?.city,
                    state: req.body?.state,
                    address: req.body?.address,
                    phone: req.body?.phone,
                    isAdmin: req?.body?.isAdmin
                }
            }).then((updatedUser) => {
                return res.status(200).json({
                    user: {
                        _id: userFound?._id,
                        fullname: req.body.fullname,
                        email: req.body.email,
                        city: req.body.city,
                        phone: req.body.phone,
                        state: req.body.state,
                        address: req.body.address,
                        isAdmin: req?.body?.isAdmin
                    }
                })
            }).catch((error) => {
                return res.status(400).json({
                    message: "Error = " + error
                })
            })
        } else {
            return res.status(400).json({
                message: "Password is Incorrect"
            })
        }
    }
}


exports.getUserById = async (req, res) => {
    const { uid } = req.body;
    try {
        const userFound = await User.findOne({ _id: uid })
        if (userFound) {
            return res.status(200).json({
                _id: userFound?._id,
                email: userFound?.email,
                fullname: userFound?.fullname,
                phone: userFound?.phone,
                city: userFound?.city,
                state: userFound?.state,
                country: userFound?.country,
                zipcode: userFound?.zipcode,
                address: userFound?.address,
                usertype: userFound?.usertype,
            })
        } else {
            return res.status(400).json({
                message: "Cannot get user",
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while getting user",
        });
    }
}


exports.userLoginWithOtp = async (req, res) => {
    const { phone } = req.body;
    const userFound = await User.findOne({ phone: phone });
    if (userFound) {
        return res.status(200).json({
            user: {
                _id: userFound?._id,
                fullname: userFound?.fullname,
                email: userFound?.email,
                city: userFound?.city,
                phone: userFound?.phone,
                avatar: userFound?.avatar,
                state: userFound?.state,
                address: userFound?.address,
                isAdmin: userFound?.isAdmin,
            }

        });
    } else {
        res.status(401).json({
            message: "Invalid OTP"
        })
    }

}

exports.adminEmailVerification = async (req, res) => {
    const { email, subject } = req.body;
    try {
        const userFound = await User.findOne({ email: email });
        if (!userFound) {
            return res.status(402).json({
                message: "User Does Not Exist"
            })
        }
        if (!userFound.isAdmin) {
            return res.status(400).json({
                message: "Not an admin user",
            })
        }
        let otp = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
        otp.toString();
        console.log(otp);
        await sendEmail(email, `Your verification code is ${otp}`, `Email Confirmation from Harsh Hasthkala\n\n`).then((emailSent) => {
            return res.status(200).json({
                message: "Email sent",
                emailSent: true,
                otp: otp,
            })
        }).catch((error) => {
            return res.status(400).json({
                otpSent: false,
                message: error
            })
        })
    } catch (error) {
        return res.status(400).json({
            message: error,
            emailSent: false
        })
    }
}


exports.emailVerification = async (req, res) => {
    const { email, subject } = req.body;
    try {
        const userFound = await User.findOne({ email: email });
        if (!userFound) {
            return res.status(402).json({
                message: "User Does Not Exist"
            })
        }
        let otp = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
        otp.toString();
        await sendEmail(email, `Your verification code is ${otp}`, `Email Confirmation from Harsh Hasthkala\n\n`).then((emailSent) => {
            return res.status(200).json({
                message: "Email sent",
                emailSent: true,
                otp: otp,
            })
        }).catch((error) => {
            return res.status(400).json({
                otpSent: false,
                message: error
            })
        })
    } catch (error) {
        return res.status(400).json({
            message: error,
            emailSent: false
        })
    }
}

exports.adminMobileNoVerificatiion = async (req, res) => {
    const { phone } = req.body;
    var newPhone = phone.split("+91")[1];
    const userFound = await User.findOne({ phone: newPhone });
    if (!userFound?.isAdmin) {
        return res.status(200).json({
            message: "Not an admin user",
        })
    }
    if (!userFound) {
        return res.status(402).json({
            message: "User Does Not Exist!"
        })
    }


    // const accountSid = process.env.ACCOUNT_SID;
    // const authToken = process.env.AUTH_TOKEN;
    // const client = twilio(accountSid, authToken, process.env.VIRTUAL_NUMBER);

    let otp = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
    otp.toString();

    sendOtp(otp, phone).then((otpSent) => {
        console.log(otp);
        return res.status(200).json({
            message: "OTP sent successfully!",
            otp: otp,
        })
    }).catch((err) => {
        console.log(err);
        return res.status(400).json({
            message: "OTP Failed!",
        })
    })


    // if (process.env.PRODUCTION) {
    //     client.messages
    //         .create({
    //             body: message,
    //             from: process.env.VIRTUAL_NUMBER,
    //             to: phone
    //         })
    //         .then((message) => {
    //             res.status(200).json({
    //                 otp: otp,
    //                 message: "OTP send successfully"
    //             })
    //         }
    //         )
    //         .catch((error) => {
    //             res.status(401).json({
    //                 message: `Error sending OTP + ${error}`
    //             })
    //         });
    // }
    // else {
    //     console.log(otp);
    //     return res.status(200).json({
    //         otp: otp,
    //         message: "OTP send successfully"
    //     })

    // }

};

exports.mobileNoVerificatiion = async (req, res) => {
    const { phone } = req.body;
    var newPhone = phone.split("+91")[1];
    const userFound = await User.findOne({ phone: newPhone });
    if (!userFound) {
        return res.status(402).json({
            message: "User Does Not Exist!"
        })
    }


    // const accountSid = process.env.ACCOUNT_SID;
    // const authToken = process.env.AUTH_TOKEN;
    // const client = twilio(accountSid, authToken, process.env.VIRTUAL_NUMBER);

    let otp = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
    otp.toString();

    sendOtp(otp, phone).then((otpSent) => {
        return res.status(200).json({
            message: "OTP sent successfully!",
            otp: otp,
        })
    }).catch((err) => {
        console.log(err);
        return res.status(400).json({
            message: "OTP Failed!",
        })
    })


    // if (process.env.PRODUCTION) {
    //     client.messages
    //         .create({
    //             body: message,
    //             from: process.env.VIRTUAL_NUMBER,
    //             to: phone
    //         })
    //         .then((message) => {
    //             res.status(200).json({
    //                 otp: otp,
    //                 message: "OTP send successfully"
    //             })
    //         }
    //         )
    //         .catch((error) => {
    //             res.status(401).json({
    //                 message: `Error sending OTP + ${error}`
    //             })
    //         });
    // }
    // else {
    //     console.log(otp);
    //     return res.status(200).json({
    //         otp: otp,
    //         message: "OTP send successfully"
    //     })

    // }

};


