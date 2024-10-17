import express from 'express'
import adminAuth from '../middleware/AdminAuth.js'
import authUser from '../middleware/Auth.js'
import {
    placeOrder,
    placeOrderStripe,
    placeOrderRazorPay,
    getAllOrders,
    userOrders,
    updateStatus,
    verifyStripe,
    verifyRazor
} from '../controllers/OrderController.js'
const orderRouter = express.Router()

//admin features
orderRouter.post('/list', adminAuth, getAllOrders)
orderRouter.post('/status', adminAuth, updateStatus)

//payment features

orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/razor', authUser, placeOrderRazorPay)

//user feature
orderRouter.post('/userorders', authUser, userOrders)

//verify Payment

orderRouter.post('/verify', authUser, verifyStripe)
orderRouter.post('/verifyRazor', authUser, verifyRazor)

export default orderRouter;