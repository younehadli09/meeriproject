const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Product, validationproduct } = require('../models/Products');

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
router.post('/CreateProduct', async (req, res) => {
    const { error, value } = validationproduct.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let product = new Product({
        name: value.name,
        description: value.description,
        richDescription: value.richDescription,
        image: value.image,
        brand: value.brand,
        Price: value.Price,
        category: value.category,
        CountINStock: value.CountINStock,
        rating: value.rating,
        IsFeatured: value.IsFeatured,
    });

    try {
        product = await product.save();
        res.send(product);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @desc update product
 * @method put
 * @route /api/products/:id
 * @access public
 */
router.put('/Update/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).json({ success: false, message: 'Invalid product ID' });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            Price: req.body.Price,
            category: req.body.category,
            CountINStock: req.body.CountINStock,
            rating: req.body.rating,
            IsFeatured: req.body.IsFeatured,
        },
        { new: true }
    );

    if (!updatedProduct) {
        return res.status(404).send('The product cannot be updated');
    }
    res.send(updatedProduct);
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
