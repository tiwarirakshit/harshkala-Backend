const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const option = {
      socketTimeoutMS: 30000,
      keepAlive: true,
    };
    await mongoose.connect(process.env.MONGO_URL, option);
    console.log("Db is Connected Successfully");
  } catch (error) {
    console.dir(error, { depth: 4 });
  }
};

module.exports = dbConnect;
