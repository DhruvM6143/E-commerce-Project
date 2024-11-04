import userModel from "../models/User.model.js";
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { passwordResetSuccessMail, sendPasswordResetEmail, sendVerificationEmail, sendWelcomeMail } from "../mailTrap/emails.js";
import crypto from 'crypto'

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
                message: "Email length exceeds  the limit"
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
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword, verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        })

        const user = await newUser.save();

        const token = createToken(user._id)
        await sendVerificationEmail(user.email, verificationToken)

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

const verifyEmail = async (req, res) => {
    const { code } = req.body;
    // 1 0 2 5 4
    try {
        const user = await userModel.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.json({ success: false, message: 'Invalid code' })
        }
        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpiresAt = undefined
        await user.save()
        await sendWelcomeMail(user.email, user.name)
        const token = createToken(user._id)
        res.json({
            success: true, message: 'Email Verified Successfully',
            token,
            user: {
                ...user._doc,
                password: undefined
            },
        })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Server Error' })

    }

}
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }
        const resetToken = crypto.randomBytes(20).toString('hex')
        const resetTokenTime = Date.now() + 1 * 60 * 60 * 1000  //1hour

        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = resetTokenTime

        await user.save()
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)
        res.json({ success: true, message: 'Password Reset Link Sent Successfully' })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Server Error' })

    }
}
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body

        const user = await userModel.findOne({ resetPasswordToken: token, resetPasswordExpiresAt: { $gt: Date.now() } })
        if (!user) {
            return res.json({ success: false, message: 'Invalid Token' })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined
        await user.save()

        await passwordResetSuccessMail(user.email)
        res.json({ success: true, message: 'Password Reset Successful' })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Server Error' })

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

const userDetails = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        res.json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Server Error"
        })

    }
}

const updateDetails = async (req, res) => {
    try {
        const { userId, newName, newEmail, newPassword } = req.body;
        const updatedFields = {};

        // Update only provided fields
        if (newName) updatedFields.name = newName;
        if (newEmail) updatedFields.email = newEmail;

        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            updatedFields.password = await bcrypt.hash(newPassword, salt);
        }

        const user = await userModel.findByIdAndUpdate(userId, updatedFields, { new: true });

        res.json({
            success: true,
            message: 'Updated user successfully',
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};




export { loginUser, registerUser, verifyEmail, adminLogin, userDetails, updateDetails }
