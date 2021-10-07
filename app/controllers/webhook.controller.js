const express = require('express');
const router = express.Router();

router.post("/webhook", async (req, res) => {
    const stripe = req.app.get('stripe');

    switch (key) {
        case "customer.subscription.updated":
            // //started trial
            // const user = await UserService.getUserByBillingID(data.customer)

            // if (data.plan.id == productToPriceMap.BASIC) {
            //     user.plan = "basic"
            // }

            // if (data.plan.id == productToPriceMap.PRO) {
            //     user.plan = "pro"
            // }

            // const isOnTrial = data.status === "trialing"

            // if (isOnTrial) {
            //     user.hasTrial = true
            //     user.endDate = new Date(data.current_period_end * 1000)
            // } else if (data.status === "active") {
            //     user.hasTrial = false
            //     user.endDate = new Date(data.current_period_end * 1000)
            // }

            // if (data.canceled_at) {
            //     // cancelled
            //     user.plan = "none"
            //     user.hasTrial = false
            //     user.endDate = null
            // }

            // await user.save()
            break
        default:
    }
});

module.exports = router;