const express= require('express');
const cryptoJS= require('crypto-js');
const User = require('../model/UserModel');
const { verifyTokenAndAuthorize, verifyTokenAndAdmin } = require('./verifyToken');
const userRouter=  express.Router();

// UPDATE USER 

userRouter.put('/:id', verifyTokenAndAuthorize, async (req, res)=>{
    if(req.body.password){
        req.body.password = cryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
    }
    try {
        const updatedUser= await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true});
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE USER 
userRouter.delete('/:id', verifyTokenAndAuthorize, async (req, res)=>{
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been Deleted Sucessfully");
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// GET USER 
userRouter.get('/find/:id', verifyTokenAndAdmin, async (req, res)=>{
    try {
        const foundUser= await User.findById(req.params.id);
        if(foundUser){
            const {password, ...others}= foundUser._doc;
            res.status(200).json(foundUser);
        }
        else{
            res.status(401).json("Not user find with this id");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// Get All user 
userRouter.get('/', verifyTokenAndAdmin, async (req, res)=>{
    const qNew= req.query.new;
    try {
        let users;
        if(qNew){
            users= await User.find().sort({createdAt: -1}).limit(5);
        } else{
            users= await User.find();
        }
        if(users){
            res.status(200).json(users);
        }
        else{
            res.status(401).json("No user founds");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});


module.exports = userRouter;