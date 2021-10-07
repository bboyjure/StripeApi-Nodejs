//ENVS
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.
const express = require('express');
const bodyParser = require('body-parser')
const stripe = require('stripe')(process.env.STRIPE_SK_KEY)
const port = process.env.PORT
const cors = require('cors');
const checkoutSessionController = require('./app/controllers/checkout-session.controller')
const customerPortalController = require('./app/controllers/customer-portal.controller')
const customerController = require('./app/controllers/customer.controller')
const subscriptionsController = require('./app/controllers/subscription.controller')
const invoiceController = require('./app/controllers/invoice.controller')
const webhookController = require('./app/controllers/webhook.controller')
const productController = require('./app/controllers/products.controller')

//init App
const app = express();
//Keycloak
const keycloak = require('./app/config/keycloak-config.js').initKeycloak();
app.use(keycloak.middleware());

app.use(cors({
    origin: '*'
}));


//Stripe
app.set("stripe", stripe)

// create application/json parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Endpoints
app.use('/checkout-session', checkoutSessionController);
app.use('/customer-portal', customerPortalController);
app.use('/customer', customerController);
app.use('/subscription', subscriptionsController);
app.use('/invoice', invoiceController);
app.use('/webhook', webhookController);
app.use('/', productController);

// Bootstraper
app.listen(port, () => {
    console.log(`App listening at ${process.env.PROTOCOL}://${process.env.HOST_IP}:${port}`)
})