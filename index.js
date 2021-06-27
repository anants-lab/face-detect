const express=require("express");
const app=express();

//This is the connection used by default for every model created using mongoose.model.
const db=require("./mongoose");
const Movie = require("./movie-data");

app.set("view engine","ejs");
app.set("views", "./views");

app.use(express.static("./assets"));


app.get('/',function(req,res){
    res.render("index.ejs");
    return;
});

app.get('/expression/:exp',function(req,res){
    if(req.xhr){
        var regex = ""
        switch(req.params.exp) {
        case "surprised":
            regex = "\W*((?i)Fantasy|Crime|Adventure|Mystery|Thriller(?-i))\W*"
            break;
        case "disgusted":
            regex = "\W*((?i)Comedy|Romance|Science(?-i))\W*"
            break;
        case "happy":
            regex = "\W*((?i)Animation|Family|Music(?-i))\W*"
            break;
        case "sad":
            regex = "\W*((?i)Animation|Comedy|Drama(?-i))\W*"
            break;
        case "neutral":
            regex = "\W*((?i)Action|War|Documentary|History (?-i))\W*"
            break;
        case "angry":
            regex = "\W*((?i)Comedy|Romance|Adventure(?-i))\W*"
            break;
        case "fearful":
            regex = "\W*((?i)Horror(?-i))\W*"
            break;
        }
        Movie.find({genres:{$regex:`${regex}`}},function(err,movie){
            let chosen=movie[Math.floor(Math.random() * movie.length+1)];
            return res.status(200).json({
                message:"Success",
                data:chosen
            });
        });
    }
    
});

//Listens on port->8000
app.listen(8080,function(err){
    if(err){
        console.log("Server error");
        return;
    }
    console.log("Server Up");
});
