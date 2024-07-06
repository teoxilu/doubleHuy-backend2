
const { sendPaymentConfirmationEmail } = require('./mailer');

const sendConfirmationEmail = (req, res) => {
    const { email, orderInfo } = req.body;
    sendPaymentConfirmationEmail(email, orderInfo);
    res.status(200).send('Email sent successfully');
};

module.exports = {
    sendConfirmationEmail,
};
