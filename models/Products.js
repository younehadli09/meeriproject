const mongoose = require('mongoose');
const Joi = require('joi');

const Productschema = new mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    image: {
        type: String,
        default: ''
    },
    brand: {
        type: String,
        default: ''
    },
    Price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    CountINStock: {
        type: Number,
        default: 0,
        min: 0,
        max: 255
    },
    rating: {
        type: Number,
        default: 0
    },
    IsFeatured: {
        type: Boolean,
        default: false
    },
    DateCreated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
const validationproduct = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    richDescription: Joi.string().trim().min(3).max(200).required(),
    image: Joi.string().allow(''),
    brand: Joi.string().allow(''),
    Price: Joi.number().required(),
    category: Joi.string().required(),
    CountINStock: Joi.number().min(0).max(255).required(),
    rating: Joi.number().default(0),
    IsFeatured: Joi.boolean().default(false)
});
const Product = mongoose.model("Products", Productschema);
module.exports = { Product ,validationproduct};
