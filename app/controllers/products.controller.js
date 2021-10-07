const express = require('express');
const router = express.Router();
const limit = 10;
const keycloak = require('../config/keycloak-config.js').getKeycloak();


router.get("/products", keycloak.protect(['user','admin']), async (req, res) => {
    const stripe = req.app.get('stripe');

    const products = await stripe.products.list({
        limit: limit,
    });
    res.send(products);
})


router.get("/prices",keycloak.protect(['user','admin']), async (req, res) => {
    const stripe = req.app.get('stripe');

    const prices = await stripe.prices.list({
        limit: limit,
    });

    res.send(prices);
})


router.post("/product", keycloak.protect(['user','admin']), async (req, res) => {
    const stripe = req.app.get('stripe');

    const product = await stripe.products.retrieve(req.body.productId);
    res.send(product);
})


router.post("/price", keycloak.protect(['user','admin']),  async (req, res) => {
    const stripe = req.app.get('stripe');
    const price = await stripe.prices.retrieve(req.body.priceId);
    res.send(price);
})

module.exports = router;