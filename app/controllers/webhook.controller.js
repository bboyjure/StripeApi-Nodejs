const express = require('express');
const router = express.Router();
const webPush = require('../services/webpush.service.js');

router.post("/", express.raw({ type: 'application/json' }),
    (request, response) => {
        const event = request.body;
        // console.log('WEBHOOK', event);
        // Replace this endpoint secret with your endpoint's unique secret
        // If you are testing with the CLI, find the secret by running 'stripe listen'
        // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
        // at https://dashboard.stripe.com/webhooks
        const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;
        // console.log('endpointSecret', endpointSecret);
        // Only verify the event if you have an endpoint secret defined.
        // Otherwise use the basic event deserialized with JSON.parse
        if (endpointSecret) {
            // Get the signature sent by Stripe
            const signature = request.headers['stripe-signature'];
            try {
                event = stripe.webhooks.constructEvent(
                    request.body,
                    signature,
                    endpointSecret
                );
            } catch (err) {
                console.log(`⚠️  Webhook signature verification failed.`, err.message);
                return response.sendStatus(400);
            }
        }
        let subscription;
        let status;
        let payLoad;
        // Handle the event
        console.log(event)
        switch (event.type) {
            case 'customer.subscription.trial_will_end':
                subscription = event.data.object;
                status = subscription.status;
                console.log(`Subscription status is ${status}.`, subscription);
                payLoad = webPush.initPayload('FleetOpti', 'Trial will end in 3 days!', status)
                webPush.sendPushNotification("jure.beton@gmail.com", payLoad);
                // Then define and call a method to handle the subscription trial ending.
                // handleSubscriptionTrialEnding(subscription);
                break;
            case 'customer.subscription.deleted':
                subscription = event.data.object;
                status = subscription.status;
                // console.log(`Subscription status is ${status}.`);
                // Then define and call a method to handle the subscription deleted.
                // handleSubscriptionDeleted(subscriptionDeleted);
                break;
            case 'customer.subscription.created':
                subscription = event.data.object;
                status = subscription.status;
                // console.log(`Subscription status is ${status}.`);
                // Then define and call a method to handle the subscription created.
                // handleSubscriptionCreated(subscription);
                break;
            case 'invoice.payment_succeeded':
                subscription = event.data.object;
                status = subscription.status;
                payLoad = webPush.initPayload('FleetOpti', 'Payment Succeeded!', status)
                webPush.sendPushNotification("jure.beton@gmail.com", payLoad);
                // console.log(`Subscription status is ${status}.`);
                // Then define and call a method to handle the subscription created.
                // handleSubscriptionCreated(subscription);
                break;
            case 'charge.failed':
                subscription = event.data.object;
                status = subscription.status;
                payLoad = webPush.initPayload('FleetOpti', 'Payment Failed!', status)
                webPush.sendPushNotification("jure.beton@gmail.com", payLoad);
                // console.log(`Subscription status is ${status}.`);
                // Then define and call a method to handle the subscription update.
                // handleSubscriptionUpdated(subscription);
                break;
            case 'customer.subscription.updated':
                subscription = event.data.object;
                status = subscription.status;
                payLoad = webPush.initPayload('FleetOpti', 'New message!', status)
                webPush.sendPushNotification("jure.beton@gmail.com", payLoad);
                // console.log(`Subscription status is ${status}.`);
                // Then define and call a method to handle the subscription update.
                // handleSubscriptionUpdated(subscription);
                break;
            default:
                // Unexpected event type
                console.log(`Unhandled event type ${event.type}.`);
        }
        // Return a 200 response to acknowledge receipt of the event
        response.send();
    });

module.exports = router;