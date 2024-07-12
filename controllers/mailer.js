require("dotenv").config();
const nodemailer = require("nodemailer");
const generatePDF = require("../services/generatePDF");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // or 465 for SSL
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
});

const sendPaymentConfirmationEmail = async (email, order) => {
  try {
    const pdfBuffer = await generatePDF(order);

    let info = await transporter.sendMail({
      from: '"DoubleHuy" <your_email@example.com>',
      to: email,
      subject: "Order Confirmation",
      text: `Your order has been confirmed.`,
      html: `<div><b>Your order has been confirmed.</b></div> <div><b>Your invoice:</b></div>`,
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendPaymentConfirmationEmail };
