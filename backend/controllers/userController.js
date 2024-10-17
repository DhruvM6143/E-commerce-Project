import userModel from "../models/User.model.js";
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}


//route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.json({
                success: false,
                message: "Wrong password"
            })
        }
        if (isMatched) {
            const token = createToken(user._id);
            res.json({
                success: true,
                message: "Login Successful",
                token
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

//route for user registration

const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        //checking if user is already registered
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.json({
                success: false,
                message: "User already registered"
            })
        }

        //validating email and strong password

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Invalid Email"
            })
        }
        if (email.length > 30 && email.length < 5) {
            res.json({
                success: false,
                message: "Email length exceeds the limit"
            })
        }
        if (password.length < 5) {
            return res.json({
                success: false,
                message: "Password must be at least 5 characters long"
            })
        }

        //created hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save();

        const token = createToken(user._id)

        res.json({
            success: true,
            message: "User registered successfully",
            token
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Server Error"
        })

    }
}


//route for Admin Login

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({
                success: true,
                message: "Admin Login Successful",
                token
            })
        }
        else {
            res.json({
                success: false,
                message: "Invalid Email or Password"
            })
        }

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: "Admin Login Failed"
        })
    }


}

//route for admin registration

export { loginUser, registerUser, adminLogin }
