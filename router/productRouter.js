const express= require('express');
const multer= require('multer');
const uuidv4= require('uuid');
const Product = require('../model/ProductModel');
const { verifyTokenAndAuthorize, verifyTokenAndAdmin } = require('./verifyToken');
const productRouter=  express.Router();

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

// CREATE PRODUCT
productRouter.post('/', verifyTokenAndAdmin, upload.single('img'), async (req, res)=>{
    const url = req.protocol + '://' + req.get('host');
    const newProduct= new Product({
        ...req.body,
        img: url + '/image/' + req.file.filename,
    });
    try {
        const savedProduct= await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
})

// UPDATE PRODUCT
productRouter.put('/:id', verifyTokenAndAdmin, async (req, res)=>{
    try {
        const updatedProduct= await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true});
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE PRODUCT
productRouter.delete('/:id', verifyTokenAndAdmin, async (req, res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been Deleted Sucessfully");
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// GET PRODUCT
productRouter.get('/find/:id', async (req, res)=>{
    try {
        const foundProduct= await Product.findById(req.params.id);
        if(foundProduct){
            res.status(200).json(foundProduct);
        }
        else{
            res.status(401).json("Not user find with this id");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// Get All PRODUCT 
productRouter.get('/', async (req, res)=>{
    // implement query functionlity
    const qNew= req.query.new;
    const qCategory= req.query.category ;
    try {
        let products;
        if(qNew){
            products= await Product.find().sort({createdAt: -1}).limit(1);
        } else if(qCategory){
            products= await Product.find({categories:{
                $in: [qCategory],
            }})
        } else{
            products= await Product.find();

        }

        if(products){
            res.status(200).json(products);
        }
        else{
            res.status(401).json("product not found");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});


module.exports = productRouter;