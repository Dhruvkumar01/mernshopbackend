const express= require('express');
const Order = require('../model/OrderModel');
const { verifyTokenAndAuthorize, verifyTokenAndAdmin } = require('./verifyToken');
const orderRouter=  express.Router();

// complete this router this is just copy and paste

// CREATE ORDER
orderRouter.post('/', async (req, res)=>{
    const newOrder= Order({...req.body});
    try {
        const savedOrder= await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
})

// UPDATE ORDER
orderRouter.put('/:id', verifyTokenAndAdmin, async (req, res)=>{
    try {
        const updatedOrder= await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true});
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE ORDER
orderRouter.delete('/:id', verifyTokenAndAuthorize, async (req, res)=>{
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been Deleted Sucessfully");
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// GET ORDER
orderRouter.get('/find/:userId', verifyTokenAndAuthorize, async (req, res)=>{
    try {
        const foundOrder= await Order.find({userId: req.params.userId});
        if(foundOrder){
            res.status(200).json(foundOrder);
        }
        else{
            res.status(401).json("Not user found with this id");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// Get All ORDER
orderRouter.get('/', verifyTokenAndAdmin, async (req, res)=>{ 
    try {
        const foundOrders= await Order.find().sort({createdAt: -1});
        if(foundOrders){
            res.status(200).json(foundOrders);
        }
        else{
            res.status(401).json("Not order found");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});


module.exports = orderRouter;