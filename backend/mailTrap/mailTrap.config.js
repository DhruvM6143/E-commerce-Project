// import { MailtrapClient } from 'mailtrap'


// const TOKEN = "7ed637055da9ea3e76167a8d38a32aad"

// export const mailTrapClient = new MailtrapClient({
//     token: TOKEN,

// });
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
        user: "nukeyt6143@gmail.com",
        pass: "nnyq znog skmz verh",
    },
});

export const sender = {
    email: "nukeyt6143@gmail.com",

};






// async..await is not allowed in global scope, must use a wrapper
// async function sender() {
//     // send mail with defined transport object
//     const info = await transporter.sendMail({
//         from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
//         to: "bar@example.com, baz@example.com", // list of receivers
//         subject: "Hello ✔", // Subject line
//         text: "Hello world?", // plain text body
//         html: "<b>Hello world?</b>", // html body
//     });
// }

