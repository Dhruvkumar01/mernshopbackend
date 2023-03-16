const express = require('express')
const mongoose  = require('mongoose')
const dotenv= require('dotenv');
dotenv.config();
const userRouter = require('./router/userRouter');
const authRouter = require('./router/authRouter');
const productRouter = require('./router/productRouter');
const cartRouter = require('./router/cartRouter');
const orderRouter = require('./router/orderRouter');
const cors= require('cors');
const bodyParser = require('body-parser');
const paymentRouter = require('./router/stripe');

const app = express()
app.use(express.json())
app.use(cors());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true })); 

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URL)
    .then(()=> console.log("DB sucessFull"))
    .catch((err)=>{
        console.log(err);
    })

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/checkout', paymentRouter);

app.listen(process.env.PORT || 5000, ()=> {
    console.log("Server is running at port 5000");
});