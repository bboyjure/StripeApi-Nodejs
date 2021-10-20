const express = require('express');
const router = express.Router();
// const keycloak = require('../config/keycloak-config.js').getKeycloak();

router.post('/', async (req, res) => {
    const stripe = req.app.get('stripe');
    const { priceId } = req.body;
    console.log(priceId)
    // See https://stripe.com/docs/api/checkout/sessions/create
    // for additional parameters to pass.
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    // For metered billing, do not pass quantity
                    quantity: 1,
                },
            ],
            // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
            // the actual Session ID is returned in the query parameter when your customer
            // is redirected to the success page.
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/cancel',
        });

        res.status(201).send({
            sessionId: session.id,
        });
    } catch (e) {
        res.status(400);
        return res.send({
            error: {
                message: e.message,
            }
        });
    }
});

module.exports = router;