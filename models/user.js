const { default: mongoose } = require("mongoose");

const user = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    avatar: {
        type: String,
        default:"https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Free-Download.png",
    },
    role:{
        type: String,
        default: "user",
        enum: ["user","admin"],
   },
   favourites:[
    {
        type: mongoose.Types.ObjectId,
        ref: "books",
    },
   ],
   cart:[
    {
        type: mongoose.Types.ObjectId,
        ref: "books",
    },
   ],
   orders:[
    {
        type: mongoose.Types.ObjectId,
        ref: "orders",
    },
   ],
},
{timestamps: true}
);
module.exports = mongoose.model("user",user);
