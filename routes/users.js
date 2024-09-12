const express = require('express');
const router = express.Router();
const Joi = require('joi');
const cors = require('cors'); 
const asyncHandler = require('express-async-handler');
const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); 



/**
 * @desc get  all categories
 * @method get
 * @route /
 * @access public
 */
router.get('/GetALLusers',async (req,res)=>{
    const  Userlist = await User.find().select('-passwordhash');
    if(!Userlist){
       res.status(500).json({succes : false});
    }
    res.status(200).send(Userlist);
   })


/**
 * @desc Register new user
 * @method Post
 * @route /api/users
 * @access public
 */

router.post("/register", asyncHandler(async(req, res) => {
   
    let newUser = await User.findOne({ email: req.body.email });
    if (newUser) {
        return res.status(400).json({ message: "This user already exists" });
    }
    
    const salt = await bcrypt.genSalt(10)
    req.body.passwordhash= await bcrypt.hash(req.body.passwordhash,salt)
    
  
    newUser = new User({
        email: req.body.email,
        username: req.body.username,
        passwordhash: req.body.passwordhash,
        isAdmin: req.body.isAdmin,
        phonenumber : req.body.phonenumber,
        wilaya : req.body.wilaya,
        commune : req.body.commune,
        code_postal : req.body.code_postal,
        adresse : req.body.adresse,
    });
  
    const result = await newUser.save();
    res.status(201).json(result);
  }));

  router.post('/login', asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.passwordhash);
    if (!validPassword) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
        {
            user_id: user._id,
            isAdmin: user.isAdmin
        },
        process.env.JWT_SECRET,
        {expiresIn : "1w"}
    );

    res.status(200).json({ user: user.email, token: token });
}));

router.get('/countusers', async (req, res) => {
    try {
        const userstcount = await User.countDocuments();
        res.status(200).send({ success: true, count: userstcount });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


router.put('/Update/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).json({ success: false, message: 'Invalid user ID' });
    }
    const updateduser = await User.findByIdAndUpdate(
        req.params.id,
        {
            email: req.body.email,
            username: req.body.username,
            passwordhash: req.body.passwordhash,
            isAdmin: req.body.isAdmin,
            phonenumber : req.body.phonenumber,
            wilaya : req.body.wilaya,
            commune : req.body.commune,
            code_postal : req.body.code_postal,
            adresse : req.body.adresse,
        },
        { new: true }
    );

    if (!updateduser) {
        return res.status(404).send('The user cannot be updated');
    }
    res.send(updateduser);
});

/**
 * @desc delete user
 * @method delete
 * @route /api/users/:id
 * @access public
 */
router.delete('/delete/:id', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
        return res.status(200).json({ success: true, message: 'The user is deleted' });
    } else {
        return res.status(404).json({ success: false, message: 'user not found' });
    }
});
  module.exports = router;