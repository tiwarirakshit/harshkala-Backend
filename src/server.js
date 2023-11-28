
const http = require("http");
const app = require("./app");

const passportSetup = require("./passport")
const authRoute = require("./route/User/authRoute")



app.use("/auth",authRoute);

const PORT = process.env.PORT || 5500;

const server = http.createServer(app);
server.listen(PORT, console.log(`Server is listening on port ${PORT}`));
