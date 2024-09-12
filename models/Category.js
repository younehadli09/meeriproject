const Joi = require('joi');
const { string } = require('joi');
const mongoose = require('mongoose'); 
const { ENUM } = require('sequelize');
const { INTEGER } = require('sequelize');
const { STRING } = require('sequelize');

const Categoryschema = new mongoose.Schema({
name :{
    type :String,
    required : true 
    

},
icon :{
    type :String,
    
    
},
color :{
    type :String,
    

}

},
{
    timestamps :true
}
);


const Category = mongoose.model("Category",Categoryschema);
module.exports = {
       Category
}