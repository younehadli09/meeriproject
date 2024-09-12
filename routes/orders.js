const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Order } = require('../models/Order');
const { OrderItem } = require('../models/Order_item'); 
const { Product } = require('../models/Products');


/**
 * @desc get  all orders
 * @method get
 * @route /api/orders
 * @access public
 */
router.get('/GetALLOrders', async (req, res) => {
    const Orderlist = await Order.find().populate('user','username -_id').populate('orderitems','product quantity -_id')
    if (!Orderlist) {
        return res.status(500).json({ success: false });
    }
    res.send(Orderlist);
});


/**
 * @desc crate order
 * @method post
 * @route /api/orders
 * @access public
 */
router.post('/Createorder' ,async (req,res)=>{
    const  orderitemsids =  Promise.all(req.body.orderitems.map(async item => 
    {
        let  newOrderitem = OrderItem({
            quantity :item.quantity,
            product :item.product
        })
        newOrderitem = await newOrderitem.save();
        return newOrderitem._id;
    }
    ));
    const resolveditemsids = await orderitemsids

    let order = new  Order ({
        orderitems:resolveditemsids,
        adress:req.body.adress,
        city:req.body.city,
        postalcode:req.body.postalcode,
        phonenumber:req.body.phonenumber,
        status:req.body.status,
        totlaprice:req.body.totlaprice,
        user:req.body.user
    })
            order = await order.save();
            
            if(!order)
                return res.status(404).send(' the order cannot be created')

            res.send(order)
    })
    module.exports = router;