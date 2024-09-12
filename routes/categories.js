const express = require('express');
const router = express.Router();
const Joi = require('joi');
const cors = require('cors'); 
const asyncHandler = require('express-async-handler');
const {Category} = require('../models/Category')

/**
 * @desc get  all categories
 * @method get
 * @route /api/categories
 * @access public
 */
router.get('/GetALLCategories',async (req,res)=>{
 const  CategoryList = await Category.find();
 if(!CategoryList){
    res.status(500).json({succes : false});
 }
 res.status(200).send(CategoryList);
})

/**
 * @desc get   category byID
 * @method get
 * @route /api/categories
 * @access public
 */
router.get('/Get/:id',async (req,res)=>{
    Category.findById(req.params.id).then( category =>{
        if(!category)
            res.status(404).json({succes : false, message : 'category not found'});
        
        res.status(200).send(category)
    })
})

/**
 * @desc create category
 * @method post
 * @route /api/categories
 * @access public
 */
router.post('/CreateCategory' ,async (req,res)=>{
    let category = new  Category ({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
    })
            category = await category.save();
            
            if(!category)
                return res.status(404).send(' the category cannot be created')

            res.send(category)
    })
/**
 * @desc update category
 * @method PUT
 * @route /api/categories
 * @access public
 */
router.put('/Update/:id',async (req,res)=>{
    let category = await Category.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
    },{new : true})

    category = await category.save();
            
    if(!category)
        return res.status(404).send(' the category cannot be created')

    res.send(category)

})
/**
 * @desc DELETE category
 * @method DELETE
 * @route /api/categories
 * @access public
 */
router.delete('/delete/:id', async(req,res)=>{
    Category.findByIdAndDelete(req.params.id).then(category =>{
        if(category){
            res.status(200).json({ succes : true ,message : 'the category is deleted'})
        }else{
            return res.status(404).json({succes : false , message : 'category not found '})
        }
    }).catch(err=>{
        return res.status(400).json({succes: false , message: err})
    })
})    


module.exports = router;