const express = require('express');
const router = express.Router();
const keycloakService = require('../services/keycloak.service')
const keycloak = require('../config/keycloak-config.js').getKeycloak();

router.post("/create",  keycloak.protect('admin'), async (req, res) => {
    const stripe = req.app.get('stripe');
    try {
        let time = new Date().getTime();
        time += 1209600000;
        const { priceId, customerId, keycloakId } = req.body;
        const subscription = await stripe.subscriptions.create({
            customer: customerId.toString(),
            items: [
                {
                    price: process.env.FIRST_SUB_PLAN,
                },
            ],
            trial_end: Math.round(time / 1000),
        });
        keycloakService.setKeycloakAttributes(keycloakId.toString(), customerId.toString(), subscription.id.toString())
        res.send("Succeed")
    }
    catch (e) {
        console.error(e)
        res.send(e)
    }
})


router.post("/retrieve",  keycloak.protect(['user','admin']), async (req, res) => {
    const stripe = req.app.get('stripe');
    try {
        const { subscriptionId } = req.body;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId.toString());
        res.send(subscription)
    }
    catch (e) {
        console.error(e)
        res.send(e)
    }
})


router.delete("/cancel", keycloak.protect('admin'),  async (req, res) => {
    const stripe = req.app.get('stripe');
    try {
        const { subscriptionId } = req.body;
        const deleted = await stripe.subscriptions.del(subscriptionId.toString());
        res.send(deleted)
    }
    catch (e) {
        console.error(e)
        res.send(e)
    }
})


module.exports = router;