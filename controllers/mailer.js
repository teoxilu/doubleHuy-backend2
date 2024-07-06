require('dotenv').config();
const nodemailer = require('nodemailer');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // or 465 for SSL
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendConfirmationEmail = async (email, orderInfo) => {
    try {
        let info = await transporter.sendMail({
            from: '"Your Company" <your_email@example.com>',
            to: email,
            subject: 'Order Confirmation',
            text: `Your order ${orderInfo._id} has been confirmed.`,
            html: `<b>Your order ${orderInfo._id} has been confirmed.</b>`
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendConfirmationEmail };
