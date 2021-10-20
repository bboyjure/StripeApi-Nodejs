const express = require('express');
const router = express.Router();


router.post("/create", async (req, res) => {
    try{
        const stripe = req.app.get('stripe');
        const { username, email } = req.body;
        const customer = await stripe.customers.create({
            description: `${username} - FleetOpti`,
            email: email.toString(),
            name: username.toString(),
          });
    
        res.status(201).send(customer)
    }
    catch (e){
        res.send(e).status(400)
    }
})

router.post("/retrieve",  async (req, res) => {
    const stripe = req.app.get('stripe');
    const { customerId } = req.body;
    const customer = await stripe.customers.retrieve(customerId.toString())
    if(customer){
        res.send(customer)
    }
    else{
        throw new Error("No data found")
    }
})


module.exports = router;