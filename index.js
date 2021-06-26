const express=require("express");
const app=express();
//Help to set Layout


//This is the connection used by default for every model created using mongoose.model.
const db=require("./mongoose");
const Movie = require("./movie-data");

app.set("view engine","ejs");
app.set("views", "./views");




app.use(express.static("./assets"));


Movie.find({genres:{$regex:"\W*((?i)Action|Adventure(?-i))\W*"}},function(err,movie){
    console.log(movie);
});

app.get('/',function(req,res){
    res.render("index.ejs");
    return;
});

//Listens on port->8000
app.listen(8080,function(err){
    if(err){
        console.log("Server error");
        return;
    }
    console.log("Server Up");
});
