const express = require('express');
const router = express.Router();
const keycloak = require('../config/keycloak-config.js').getKeycloak();

router.post("/create", keycloak.protect('admin'), async (req, res) => {
    const stripe = req.app.get('stripe');
    const { username, email } = req.body;
    const customer = await stripe.customers.create({
        description: `${username} - FleetOpti`,
        email: email.toString(),
        name: username.toString(),
      });

    res.send(customer)
})

router.post("/retrieve",  keycloak.protect(['user','admin']),  async (req, res) => {
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