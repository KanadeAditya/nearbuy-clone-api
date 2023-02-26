const mongoose =  require("mongoose");

const businessschema = mongoose.Schema({
    name : {type:String,required:true},
    price: {type:Number,required:true},
    type: {type:String,required:true},
    location:{type:String,required:true}
})

const BusinessModel = mongoose.model("business",businessschema);

module.exports = {BusinessModel} ; 
