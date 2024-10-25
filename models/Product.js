const mongoose = require('mongoose');
const Joi = require('joi');

const sizeSchema = new mongoose.Schema({
    size: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0 
    }
}, {
    _id: false 
});

// Schema for product details
const productDetailSchema = new mongoose.Schema({

    color: {
        type: String,
        required: true,
        trim: true
    },
    sizes: [sizeSchema]
}, {
    timestamps: true
});

const Productschema = new mongoose.Schema({
    id:{
        type :Number,
        unique:true,
        
    },
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
    images:  [{  
        type: String
        
    }],
    brand: {
        type: String,
        default: ''  // Fixed typo
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
    },
    productdetail  :[productDetailSchema]

 
}, {
    timestamps: true
});

// Pre-save hook to auto-increment the 'id'
Productschema.pre('save', async function (next) {
    const doc = this;
    if (!doc.isNew) {
        return next(); // If it's not a new document, do nothing
    }

    try {
        // Find the highest 'id' value and increment it
        const highestId = await mongoose.model('Products').find().sort({ id: -1 }).limit(1);  // Updated to 'Products'
        doc.id = (highestId.length > 0 ? highestId[0].id + 1 : 1); // Assign the new 'id'
        return next();
    } catch (error) {
        return next(error);
    }
});

const validationproduct = Joi.object({
    id: Joi.number(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    richDescription: Joi.string().trim().min(3).max(200).required(),
    images: Joi.array().items(Joi.string().uri()).optional(),  
    brand: Joi.string().allow(''),
    Price: Joi.number().required(),
    category: Joi.string().required(), 
    CountINStock: Joi.number().min(0).max(255).default(0),
    rating: Joi.number().min(0).max(5).default(0),
    IsFeatured: Joi.boolean().default(false),
    productdetail: Joi.array().items(
        Joi.object({
            color: Joi.string().required().trim(),
            sizes: Joi.array().items(
                Joi.object({
                    size: Joi.string().required().trim(),
                    stock: Joi.number().min(0).required()  
                })
            ).required()
        })
    ).optional()  
});
const validationupdate = Joi.object({
    id: Joi.number().optional(),
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    richDescription: Joi.string().trim().min(3).max(200).optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    brand: Joi.string().allow('').optional(),
    Price: Joi.number().optional(),
    category: Joi.string().optional(), 
    CountINStock: Joi.number().min(0).max(255).optional(),
    rating: Joi.number().min(0).max(5).optional(),
    IsFeatured: Joi.boolean().optional(),
    productdetail: Joi.array().items(
        Joi.object({
            color: Joi.string().optional().trim(),
            sizes: Joi.array().items(
                Joi.object({
                    size: Joi.string().optional().trim(),
                    stock: Joi.number().min(0).optional()
                })
            ).optional()
        })
    ).optional()
});


const Product = mongoose.model("Products", Productschema);  // Ensure this matches the model name in the pre-save hook

module.exports = { Product, validationproduct,  validationupdate};
