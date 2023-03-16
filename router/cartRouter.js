const express= require('express');
const Cart = require('../model/CartModel');
const { verifyTokenAndAuthorize, verifyTokenAndAdmin } = require('./verifyToken');
const cartRouter=  express.Router();

// CREATE CART
cartRouter.post('/', verifyTokenAndAuthorize, async (req, res)=>{
    const newCart= Cart(req.body);
    try {
        const savedCart= await newCart.save();
        res.status(200).json(savedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE CART
cartRouter.put('/:id', verifyTokenAndAuthorize, async (req, res)=>{
    try {
        const updatedCart= await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true});
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE CART
cartRouter.delete('/:id', verifyTokenAndAuthorize, async (req, res)=>{
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been Deleted Sucessfully");
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// GET CART
cartRouter.get('/find/:id', verifyTokenAndAuthorize, async (req, res)=>{
    try {
        console.log(req.params.id);
        const foundCart= await Cart.find({userId: req.params.id});
        if(foundCart){
            res.status(200).json(foundCart);
        }
        else{
            res.status(401).json("Not user find with this id");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// Get All CART 
cartRouter.get('/', verifyTokenAndAdmin, async (req, res)=>{
    // implement query functionlity
    try {
        const foundCarts= await Cart.find();
        if(foundCarts){
            res.status(200).json(foundCarts);
        }
        else{
            res.status(401).json("Not user find");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});


module.exports = cartRouter;