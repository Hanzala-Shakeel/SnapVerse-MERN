const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("connected to mongodb");
}).catch((err) => {
    console.log(err);
})

module.exports = mongoose;