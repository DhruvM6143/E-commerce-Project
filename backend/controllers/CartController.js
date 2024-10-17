


// add product to userCart

import userModel from "../models/User.model.js"

const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({
            success: true,
            message: "Product added to cart successfully"
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Server Error"
        })

    }

}

// update userCart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        cartData[itemId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({
            success: true,
            message: "Cart updated successfully"
        })


    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Server Error"
        })

    }
}

// get userCart

const getUserCart = async (req, res) => {

    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId)
        let cartData = await user.cartData;
        res.json({
            success: true,
            cartData
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Server Error"
        })

    }

}


export { addToCart, updateCart, getUserCart }