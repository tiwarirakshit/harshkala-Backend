const http = require('https');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async (otp, mobile) => {
    try {

        const options = {
            "method": "POST",
            "hostname": "control.msg91.com",
            "port": null,
            "path": "/api/v5/flow",
            "headers": {
                "Authkey": process.env.MSG_NINTY_ONE_AUTH_KEY,
                "accept": "application/json",
                "content-type": "application.json"
            }
        };

        const req = http.request(options, function (res) {
            const chunks = [];

            res.on("end", function () {
                const body = Buffer.concat(chunks);
            })
        })

        req.write(JSON.stringify({
            template_id: '651fc146d6fc0552232aa472',
            sender: 'xenden',
            short_url: 0,
            mobiles: mobile,
            OTP: otp,
        }))
        req.end();
    }catch(error){
        console.log(error);
    }
}
