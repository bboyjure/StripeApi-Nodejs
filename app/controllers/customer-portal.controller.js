const express = require('express');
const router = express.Router();

//Billing portal
router.post('/', async (req, res) => {
    const stripe = req.app.get('stripe');
    const { customerId } = req.body
    // console.log(req.originalUrl)
    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: process.env.PORTAL_RETURN_URL,
    })
    res.json({ url: session.url })
})

router.post("/cards", async (req, res) => {
    const stripe = req.app.get('stripe');
    try{
        const { customerId } = req.body
        const paymentMethod = await stripe.paymentMethods.list({ customer: customerId, type: 'card'});
        res.send(paymentMethod)
    }
    catch{
        throw new Error("No Cards data")
    }
    
})

module.exports = router;