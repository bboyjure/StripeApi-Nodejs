const webpush = require('web-push');

const webpushSub = {
    endpoint: process.env.WEBPUSH_ENDPOINT,
    expirationTime: null,
    keys: {
        p256dh: process.env.WEBPUSH_KEYS_P256DH,
        auth: process.env.WEBPUSH_KEYS_AUTH
    }
}

const initPayload = (title, body, msg) => {
    return {
        notification: {     
            body: body,
            title: title,
            icon: 'assets/icons/fleetopti-logo-72x72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                msg: msg
            }
        }
    }
}

const sendPushNotification = (email, payload) => {
    console.log(`Pushing Notification to ${email}`);
    webpush.setVapidDetails(`mailto:${email}`, process.env.WEBPUSH_PUBLIC_KEY, process.env.WEBPUSH_PRIVATE_KEY);
    webpush.sendNotification(webpushSub, JSON.stringify(payload))
}

module.exports = {
    sendPushNotification,
    initPayload
}