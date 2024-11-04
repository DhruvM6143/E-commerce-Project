import express from 'express'

import { loginUser, registerUser, adminLogin, userDetails, updateDetails, verifyEmail, forgotPassword, resetPassword } from '../controllers/userController.js'
import authUser from '../middleware/Auth.js'
import { sendVerificationEmail } from '../mailTrap/emails.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.post('/profile', authUser, userDetails)
userRouter.post('/update', authUser, updateDetails)
userRouter.post('/verify-email', verifyEmail)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password/:token', resetPassword)


export default userRouter;