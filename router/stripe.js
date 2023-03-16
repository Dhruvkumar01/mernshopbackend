const paymentRouter= require('express').Router()
const KEY = process.env.STRIPE_KEY
const stripe = require("stripe")(KEY);

paymentRouter.post('/payment', async (req, res)=>{
    const {tokens, amount}= req.body;
    // add the customer 
    await stripe.paymentIntents.create({   
        amount: amount,
        currency: "inr",
        automatic_payment_methods: {enabled: true},
    })
    .then(result=> res.status(200).json(result))
    .catch(err=> console.log(err));
})

module.exports = paymentRouter;