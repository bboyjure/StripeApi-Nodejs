//ENVS
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
// Constants
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SK_KEY)
const PORT = process.env.PORT
const cors = require('cors');
const app = express();
app.use(cors({ origin: '*'}));


//Keycloak
const keycloak = require('./app/config/keycloak-config.js').initKeycloak();
app.use(keycloak.middleware());

// Push notification handlers
const webPush = require('./app/services/webpush.service.js');
const payLoad = webPush.initPayload( 'FleetOpti', 'New message', 'Alo buraz')
webPush.sendPushNotification("jure.beton@gmail.com", payLoad);

//Stripe
app.set("stripe", stripe)
// create application/json parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//init App
const checkoutSessionController = require('./app/controllers/checkout-session.controller')
const customerPortalController = require('./app/controllers/customer-portal.controller')
const customerController = require('./app/controllers/customer.controller')
const subscriptionsController = require('./app/controllers/subscription.controller')
const invoiceController = require('./app/controllers/invoice.controller')
const webhookController = require('./app/controllers/webhook.controller')
const productController = require('./app/controllers/products.controller')

// Endpoints
app.use('/checkout-session', keycloak.protect(), checkoutSessionController);
app.use('/customer-portal', keycloak.protect(), customerPortalController);
app.use('/customer', keycloak.protect(), customerController);
app.use('/subscription', keycloak.protect(), subscriptionsController);
app.use('/invoice',  keycloak.protect(), invoiceController);
app.use('/webhook', webhookController);
app.use('/',  keycloak.protect(), productController);

// Bootstraper
app.listen(PORT, () => {
    console.log(`App listening at port :${PORT}`)
})