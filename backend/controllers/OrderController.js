
import orderModel from "../models/Order.model.js";
import userModel from "../models/User.model.js";
import Stripe from 'stripe'
import razorpay from 'razorpay'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,

})
//global variables 
const currency = 'USD'
const Rcurrency = 'INR'
const deliveryCharge = 10

// Placing order using COD
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        // Create the new order
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        });

        // Save the order
        await newOrder.save();

        // Clear the user's cart after the order is placed
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Send success response
        res.status(200).json({
            success: true,
            message: "Order placed successfully",
        });
    } catch (error) {
        console.error("Error placing COD order:", error);

        // Send failure response
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Placing order using Stripe
const placeOrderStripe = async (req, res) => {
    // Stripe implementation logic
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;
        const orderData = new orderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
        });
        const newOrder = new orderModel(orderData)
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,

                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity

        }))
        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges',

                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({
            success: true,
            session_url: session.url,
            message: "Order placed successfully",
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Server Error"
        })

    }

};

const verifyStripe = async (req, res) => {
    const { userId, orderId, success } = req.body
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true })
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            res.json({
                success: true,
                message: "Order confirmed"
            })
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({
                success: false,
                message: "Order cancelled"
            })
        }
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Server Error"
        })

    }
}

// Placing order using Razorpay
const placeOrderRazorPay = async (req, res) => {
    // Razorpay implementation logic
    try {
        const { userId, items, amount, address } = req.body;
        const orderData = new orderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now(),
        });
        const newOrder = new orderModel(orderData)
        await newOrder.save();

        const options = {
            amount: amount * 100,
            currency: Rcurrency,
            receipt: newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.json({
                    success: false,
                    message: "Server Error"
                })
            }
            res.json({
                success: true,
                order,
                message: "Order placed successfully",
            })
        })



    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Server Error"
        })

    }
};

const verifyRazor = async (req, res) => {
    try {
        const { userId, razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            res.json({
                success: true,
                message: "Order confirmed"
            })
        }
        else {

            res.json({
                success: false,
                message: "Order cancelled"
            })
        }

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Server Error"
        })

    }
}

// Get all orders for admin
const getAllOrders = async (req, res) => {
    // Admin order retrieval logic

    try {
        const orders = await orderModel.find({});
        res.json({
            success: true,
            orders
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })

    }
};

// Get all orders for a specific user
const userOrders = async (req, res) => {
    // User order retrieval logic
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        res.json({
            success: true,
            orders
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })

    }
};

// Update order status by admin
const updateStatus = async (req, res) => {
    // Order status update logic
    try {
        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({
            success: true,
            message: "Order status updated successfully"
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })

    }
};

export {
    placeOrder,
    placeOrderStripe,
    placeOrderRazorPay,
    getAllOrders,
    userOrders,
    updateStatus,
    verifyStripe,
    verifyRazor
};
