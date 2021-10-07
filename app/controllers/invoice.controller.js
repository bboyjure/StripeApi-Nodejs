const express = require('express');
const router = express.Router();
const keycloak = require('../config/keycloak-config.js').getKeycloak();

router.get("/list", keycloak.protect(['user','admin']), async (req, res) => {
    const stripe = req.app.get('stripe');
    try {
        const invoices = await stripe.invoices.list()
        res.send(invoices);
    }
    catch {
        throw new Error("No Invoices")
    }

})

router.post("/retrieve", keycloak.protect(['user','admin']), async (req, res) => {
    const stripe = req.app.get('stripe');
    try {
        const { invoiceId } = req.body;
        const invoice = await stripe.invoices.retrieve(invoiceId.toString());
        res.send(invoice);
    }
    catch {
        throw new Error("No Invoice found")
    }
})

router.post("/pay",  keycloak.protect('admin'), async (req, res) => {
    const stripe = req.app.get('stripe');
    try {
        const { invoiceId } = req.body;
        const invoice = await stripe.invoices.pay(invoiceId.toString());
        res.send(invoice);
    }
    catch {
        throw new Error("Error in payment")
    }
})

module.exports = router;