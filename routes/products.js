const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Product, validationproduct  , validationupdate} = require('../models/Product');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Set up the folder for file storage


/**
 * @desc get  all products
 * @method get
 * @route /api/products
 * @access public
 */
router.get('/GetALLProducts', async (req, res) => {
    const Productlist = await Product.find().populate('category', 'name -_id');
    if (!Productlist) {
        return res.status(500).json({ success: false });
    }
    res.send(Productlist);
    console.log(Productlist);
});

/**
 * @desc get product by ID
 * @method get
 * @route /api/products/:id
 * @access public
 */
router.get('/Get/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).json({ success: false, message: 'Invalid product ID' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).send(product);
});

/**
 * @desc get product count
 * @method get
 * @route /api/products/countproduct
 * @access public
 */
router.get('/countproduct', async (req, res) => {
    try {
        const productcount = await Product.countDocuments();
        res.status(200).send({ success: true, count: productcount });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @desc get featured products
 * @method get
 * @route /api/products/isfeatured
 * @access public
 */
router.get('/isfeatured', async (req, res) => {
    try {
        const isfeatured = await Product.find({ IsFeatured: true });
        res.status(200).send(isfeatured);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @desc create product
 * @method post
 * @route /api/products
 * @access public
 */
router.post('/CreateProduct', upload.array('images', 10), async (req, res) => {
    // Validate request body against Joi validation schema
    const { error, value } = validationproduct.validate(req.body);
    
    // If validation fails, send a 400 response with error message
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Create array of file names or URLs for the uploaded images
    const imageUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

    // Create new Product instance with validated values and uploaded images
    let product = new Product({
        name: value.name,
        description: value.description,
        richDescription: value.richDescription,
        images: imageUrls, // Store array of image URLs
        brand: value.brand,
        Price: value.Price,
        category: value.category,
        CountINStock: value.CountINStock,
        rating: value.rating,
        IsFeatured: value.IsFeatured,
        productdetail: value.productdetail
    });

    try {
        // Save the product to the database
        product = await product.save();
        // Send the created product back as a response with 201 status code
        res.status(201).send(product);
    } catch (err) {
        // In case of error during saving, send a 500 error response
        res.status(500).send('Server Error: ' + err.message);
    }
});


/** 
 * @desc Update product
 * @method PUT
 * @route /api/products/:id
 * @access public
 */
router.put('/Update/:id', upload.array('images', 10), async (req, res) => {
    // Check if product ID is valid
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).json({ success: false, message: 'Invalid product ID' });
    }
    const { error, value } = validationupdate.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Handle image uploads if there are new files
    let imageUrls;
    if (req.files && req.files.length > 0) {
        imageUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
    }

    // Find product by ID
    let product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).send('Product not found');
    }

    
    product.name = value.name;
    product.description = value.description;
    product.richDescription = value.richDescription;
    product.images = imageUrls || product.images; 
    product.brand = value.brand;
    product.Price = value.Price;
    product.category = value.category;
    product.CountINStock = value.CountINStock;
    product.rating = value.rating;
    product.IsFeatured = value.IsFeatured;

    try {
        // Save the updated product
        product = await product.save();
        res.send(product);
    } catch (err) {
        res.status(500).send('Server Error: ' + err.message);
    }
});


/**
 * @desc delete product
 * @method delete
 * @route /api/products/:id
 * @access public
 */
router.delete('/delete/:id', async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
        return res.status(200).json({ success: true, message: 'The product is deleted' });
    } else {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
});

module.exports = router;
