
import { PASSWORD_RESET_REQUEST_TEMPLATE, welcomeEmail } from "./emailTemplates.js"
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { sender, transporter } from "./mailTrap.config.js"
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    // const recipient = [{ email }]

    try {
        const response = await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })
    } catch (error) {
        console.log(error);

    }


}

export const sendWelcomeMail = async (email, name) => {
    // const recipient = [{ email }]
    try {
        const response = await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Welcome to Naruto.com",
            html: welcomeEmail,
            category: "Welcome"
        })


    } catch (error) {
        console.log(error);


    }
}

export const sendPasswordResetEmail = async (email, resetUrl) => {
    // const recipient = [{ email }]
    try {
        const response = await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Password Reset",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
            category: "Password Reset"
        })
    } catch (error) {
        console.log(error);

    }
}

export const passwordResetSuccessMail = async (email) => {
    // const recipient = [{ email }]
    try {
        const response = await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"
        })
    } catch (error) {
        console.log(error);

    }
}