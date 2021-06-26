
const mongoose=require("mongoose");

const movieSchema=new mongoose.Schema({
    index:Number,
    m_id:{
        type: Number,
        unique:true
    },
    genres:{
        type:String
        
    },
    original_title:{
        type:String
    },
    overview:{
        type:String
    },
    release_date:
    {
        type:String
    },
    vote_average:{
        type:Number
    },
    vote_count:{
        type:Number
    },
    poster:{
        type:String
    },
});


const Movie=mongoose.model("Product",movieSchema,"products");

module.exports=Movie;