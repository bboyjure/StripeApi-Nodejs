const express = require('express');
const router = express.Router();

router.post("/list", async (req, res) => {
    const stripe = req.app.get('stripe');
    try {
        const { customerId } = req.body;
        const invoices = await stripe.invoices.list({ customer: customerId });
        res.send(invoices);
    }
    catch {
        throw new Error("No Invoices Found")
    }

})

router.post("/retrieve",  async (req, res) => {
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

router.post("/pay", async (req, res) => {
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