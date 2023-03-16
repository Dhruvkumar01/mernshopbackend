const express = require('express');
const User= require('../model/UserModel');
const cryptoJS= require('crypto-js')
const jwt= require('jsonwebtoken');
const multer= require('multer');
const uuidv4= require('uuid');

const authRouter= express.Router();

const DIR = './public/image/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// CREATE USER
authRouter.post('/signup', upload.single('img'), async (req, res)=>{
    const url = req.protocol + '://' + req.get('host');
    const newUser= new User({
        ...req.body,
        img: url + '/image/' + req.file.filename,
        password: cryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
    });
    try {
        const savedUser= await newUser.save();
        res.status(200).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }

});

// Login user
authRouter.post('/login', async (req, res)=>{
    try{
        console.log(req.body);
        const foundUser= await User.findOne({userName: req.body.userName});
        if(!foundUser){
            res.status(401).json("enter valid user Name");
        }
        else{
            const hashedPassword= cryptoJS.AES.decrypt(foundUser.password, process.env.SECRET_KEY);
            const orignalPassword = hashedPassword.toString(cryptoJS.enc.Utf8);
            if(orignalPassword === req.body.password){
                const accessToken= jwt.sign({
                    id:foundUser._id,
                    isAdmin: foundUser.isAdmin
                },
                process.env.JWT_KEY,
                {expiresIn:"1d"}
                );
                // removing password from user 
                const {password, ...others}= foundUser._doc;
                res.status(200).json({...others, accessToken});
            }
            else{
                res.status(401).json("User id and password not matched");
            }
        }
    }
    catch(err){
        res.status(501).json(err);
    }
})

module.exports= authRouter;