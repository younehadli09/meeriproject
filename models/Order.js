const Joi = require('joi');
const { string } = require('joi');
const mongoose = require('mongoose'); 
const { ENUM } = require('sequelize');
const { INTEGER } = require('sequelize');
const { STRING } = require('sequelize');

const Orderschema = new mongoose.Schema({

orderitems  :[{
    type :mongoose.Types.ObjectId,
    ref : 'OrderItem',
    required : true ,
    

}],
adress :{
    type :String,
    required : true ,
},
city :{
    type :String,
    required : true ,
},
postalcode :{
    type :String,
    required : true ,


},
phonenumber:{
    type :String,
    required : true ,
},
status:{
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
    required: true
},
totlaprice: {
    type : Number,
    
},
user :{
    type : mongoose.Types.ObjectId,
    ref : 'User',
    
},
dateordered :{
    type : Date,
    default : Date.now,
}},
{
    timestamps :true
}
);
exports.Order= mongoose.model('Order',Orderschema);