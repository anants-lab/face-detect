// npm install mongoose

const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost/test");

const db=mongoose.connection;

db.on("error",console.error.bind(console,"Error connecting to MongoDB"));

db.once("open",function(){
    console.log("DB connected");
});

module.exports=db;