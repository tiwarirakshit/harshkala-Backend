const nodemailer = require("nodemailer");

module.exports = async(email,subject,htmlcontent)=>{
    try{
        const transporter = nodemailer.createTransport({
            host:process.env.EMAIL_HOST,
            service:process.env.EMAIL_SERVICE,
            port:Number(process.env.EMAIL_PORT),
            secure:Boolean(process.env.EMAIL_SECURE),
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to:email,
            subject:subject,
            html: htmlcontent ,
        })
        console.log("Email sent Successfully");
    }catch(error){
        console.log("Error = "+error);
    }
}