const express = require('express');
const router = express.Router();
const limit = 10;


router.get("/products", async (req, res) => {
    const stripe = req.app.get('stripe');

    const products = await stripe.products.list({
        limit: limit,
    });
    res.send(products);
})


router.get("/prices", async (req, res) => {
    const stripe = req.app.get('stripe');

    const prices = await stripe.prices.list({
        limit: limit,
    });

    res.send(prices);
})


router.post("/product",  async (req, res) => {
    const stripe = req.app.get('stripe');

    const product = await stripe.products.retrieve(req.body.productId);
    res.send(product);
})


router.post("/price",  async (req, res) => {
    const stripe = req.app.get('stripe');
    const {priceId} = req.body
    const price = await stripe.prices.retrieve(priceId);
    res.send(price);
})

module.exports = router;