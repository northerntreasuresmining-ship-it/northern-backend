const Stripe = require('stripe');
const GatewaySetting = require('../models/GatewaySetting');
const ApiError = require('../utils/ApiError');

const PAYPAL_API = {
    sandbox: 'https://api-m.sandbox.paypal.com',
    live: 'https://api-m.paypal.com'
};

/**
 * @desc    Get active Stripe instance
 */
const getStripeInstance = async () => {
    const setting = await GatewaySetting.findOne({ gateway: 'stripe', isActive: true });
    if (!setting) {
        throw new ApiError(400, 'Stripe payment gateway is not configured or active');
    }

    const secretKey = setting.mode === 'live' ? setting.liveSecretKey : setting.testSecretKey;
    if (!secretKey) {
        throw new ApiError(400, `Stripe ${setting.mode} secret key is missing`);
    }

    return new Stripe(secretKey);
};

/**
 * @desc    Create payment intent (Stripe)
 */
exports.createPaymentIntent = async (amount, currency = 'usd') => {
    try {
        const stripe = await getStripeInstance();
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency,
            payment_method_types: ['card']
        });

        return paymentIntent;
    } catch (error) {
        console.error('Stripe Payment Intent Error:', error.message);
        throw new ApiError(error.statusCode || 500, error.message || 'Failed to create payment intent');
    }
};

/**
 * @desc    Confirm payment (Stripe)
 */
exports.confirmPayment = async (paymentIntentId) => {
    try {
        const stripe = await getStripeInstance();
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        return paymentIntent;
    } catch (error) {
        console.error('Stripe Payment Retrieve Error:', error.message);
        throw new ApiError(error.statusCode || 500, error.message || 'Failed to confirm payment');
    }
};

/**
 * @desc    Create refund (Stripe)
 */
exports.createRefund = async (paymentIntentId, amount) => {
    try {
        const stripe = await getStripeInstance();
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount ? Math.round(amount * 100) : undefined
        });

        return refund;
    } catch (error) {
        console.error('Stripe Refund Error:', error.message);
        throw new ApiError(error.statusCode || 500, error.message || 'Failed to create refund');
    }
};

/**
 * @desc    Handle Stripe webhooks
 */
exports.handleWebhook = async (body, signature) => {
    try {
        const setting = await GatewaySetting.findOne({ gateway: 'stripe', isActive: true });
        if (!setting) {
            throw new ApiError(400, 'Stripe gateway not active');
        }

        const stripe = new Stripe(setting.mode === 'live' ? setting.liveSecretKey : setting.testSecretKey);
        const webhookSecret = setting.mode === 'live' ? setting.liveWebhookSecret : setting.testWebhookSecret;

        if (!webhookSecret) {
            console.warn(`Protocol Warning: No webhook secret found for ${setting.mode} mode. Falling back to ENV.`);
        }

        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            webhookSecret || process.env.STRIPE_WEBHOOK_SECRET
        );

        return event;
    } catch (error) {
        throw new ApiError(400, `Webhook signature verification failed: ${error.message}`);
    }
};

/**
 * PayPal Functions
 */

const getPaypalAccessToken = async () => {
    const setting = await GatewaySetting.findOne({ gateway: 'paypal', isActive: true });
    if (!setting) {
        throw new ApiError(400, 'PayPal payment gateway is not configured or active');
    }

    const clientId = setting.mode === 'live' ? setting.livePublishableKey : setting.testPublishableKey;
    const clientSecret = setting.mode === 'live' ? setting.liveSecretKey : setting.testSecretKey;

    if (!clientId || !clientSecret) {
        throw new ApiError(400, 'PayPal credentials are missing');
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const url = `${setting.mode === 'live' ? PAYPAL_API.live : PAYPAL_API.sandbox}/v1/oauth2/token`;

    const response = await fetch(url, {
        method: 'POST',
        body: 'grant_type=client_credentials',
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new ApiError(response.status, error.error_description || 'PayPal Auth Failed');
    }

    const data = await response.json();
    return data.access_token;
};

exports.createPaypalOrder = async (amount, currency = 'USD') => {
    try {
        const accessToken = await getPaypalAccessToken();
        const setting = await GatewaySetting.findOne({ gateway: 'paypal', isActive: true });
        const url = `${setting.mode === 'live' ? PAYPAL_API.live : PAYPAL_API.sandbox}/v2/checkout/orders`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: currency,
                            value: amount.toFixed(2)
                        }
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new ApiError(response.status, error.message || 'PayPal Order Creation Failed');
        }

        return await response.json();
    } catch (error) {
        console.error('PayPal Order Error:', error.message);
        throw new ApiError(error.statusCode || 500, error.message || 'Failed to create PayPal order');
    }
};

exports.capturePaypalOrder = async (orderId) => {
    try {
        const accessToken = await getPaypalAccessToken();
        const setting = await GatewaySetting.findOne({ gateway: 'paypal', isActive: true });
        const url = `${setting.mode === 'live' ? PAYPAL_API.live : PAYPAL_API.sandbox}/v2/checkout/orders/${orderId}/capture`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new ApiError(response.status, error.message || 'PayPal Order Capture Failed');
        }

        return await response.json();
    } catch (error) {
        console.error('PayPal Capture Error:', error.message);
        throw new ApiError(error.statusCode || 500, error.message || 'Failed to capture PayPal order');
    }
};

exports.refundPaypalOrder = async (captureId, amount, currency = 'USD') => {
    try {
        const accessToken = await getPaypalAccessToken();
        const setting = await GatewaySetting.findOne({ gateway: 'paypal', isActive: true });
        const url = `${setting.mode === 'live' ? PAYPAL_API.live : PAYPAL_API.sandbox}/v2/payments/captures/${captureId}/refund`;

        const body = amount ? { amount: { value: amount.toFixed(2), currency_code: currency } } : {};

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new ApiError(response.status, error.message || 'PayPal Refund Failed');
        }

        return await response.json();
    } catch (error) {
        console.error('PayPal Refund Error:', error.message);
        throw new ApiError(error.statusCode || 500, error.message || 'Failed to refund PayPal payment');
    }
};
