const express = require('express');
const router = express.Router();
const keycloakService = require('../services/keycloak.service')

router.post("/create", async (req, res) => {
    const stripe = req.app.get('stripe');
    try {
        let time = new Date().getTime();
        // time += 1209600000;
        time += 345600000;
        const { priceId, customerId, keycloakId } = await req.body;
        const subscription = await stripe.subscriptions.create({
            customer: customerId.toString(),
            items: [
                {
                    price: process.env.FIRST_SUB_PLAN,
                },
            ],
            trial_end: Math.round(time / 1000),
        });
        const response = keycloakService.setKeycloakAttributes(keycloakId.toString(), customerId.toString(), subscription.id.toString())
        res.status(201).send(response);
    }
    catch (e) {
        console.error(e)
        res.send(e).status(400)
    }
})


router.post("/retrieve", async (req, res) => {
    const stripe = req.app.get('stripe');
    try {
        const { subscriptionId } = req.body;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId.toString());
        res.send(subscription)
    }
    catch (e) {
        console.error(e)
        res.send(e).status(400)
    }
})


router.delete("/cancel",  async (req, res) => {
    const stripe = req.app.get('stripe');
    try {
        const { subscriptionId } = req.body;
        const deleted = await stripe.subscriptions.del(subscriptionId.toString());
        res.send(deleted)
    }
    catch (e) {
        console.error(e)
        res.send(e).status(400)
    }
})


module.exports = router;