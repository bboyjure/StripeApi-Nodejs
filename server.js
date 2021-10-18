//ENVS
// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config();
// }
require('dotenv').config();

// Constants
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SK_KEY)
const PORT = process.env.PORT
const cors = require('cors');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const app = express();
app.use(cors({ origin: '*' }));

//init App
const checkoutSessionController = require('./app/controllers/checkout-session.controller')
const customerPortalController = require('./app/controllers/customer-portal.controller')
const customerController = require('./app/controllers/customer.controller')
const subscriptionsController = require('./app/controllers/subscription.controller')
const invoiceController = require('./app/controllers/invoice.controller')
const webhookController = require('./app/controllers/webhook.controller')
const productController = require('./app/controllers/products.controller')

//Keycloak
const keycloakConfig = {
    clientId: process.env.KC_CLIENTID,
    bearerOnly: true,
    serverUrl: process.env.KC_URL,
    realm: process.env.KC_REALM,
    // realmPublicKey: process.env.KC_PUBLIC_KEY,
    credentials: {
        secret: process.env.KC_SECRET,
        // realmPublicKey: process.env.KC_PUBLIC_KEY
    }
};
const memoryStore = new session.MemoryStore();
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));
const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
app.use(keycloak.middleware({
    logout: '/logout',
    admin: '/'
}));


//Stripe
app.set("stripe", stripe)
// create application/json parser
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// app.use(keycloak.protect())
// Endpoints
app.use('/checkout-session',  checkoutSessionController);
app.use('/customer-portal', customerPortalController);
app.use('/customer', customerController);
app.use('/subscription', subscriptionsController);
app.use('/invoice', invoiceController);
app.use('/webhook', webhookController);
app.use('/', productController);

// Bootstraper
app.listen(PORT, () => {
    console.log(`App listening at port :${PORT}`)
})