
const { sendPaymentConfirmationEmail } = require('./mailer');
// const { createGHNOrder, getGHNOrderStatus, getAddress } = require('../services/ghnService');

const sendConfirmationEmail = async (req, res) => {
    const { email, order } = req.body;

    if (!email || !order) {
        return res.status(400).json({ message: 'Email and order information are required' });
    }

    try {
        await sendPaymentConfirmationEmail(email, order);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
};






// const createGhnOrder = async (req, res) => {
//     // Extracting order data from request body
//     const { ToName, ToPhone, ToAddress, Weight, RequiredNote, ...otherData } = req.body;

//     // Check for missing fields
//     if (!ToName || !ToPhone || !ToAddress || !Weight || !RequiredNote) {
//         return res.status(400).json({ error: 'Missing required fields' });
//     }

//     const orderData = {
//         ToName,
//         ToPhone,
//         ToAddress,
//         Weight,
//         RequiredNote,
//         ...otherData // include any other necessary fields
//     };

//     try {
//         const orderResponse = await createGHNOrder(orderData);
//         res.json(orderResponse);
//     } catch (error) {
//         console.error('Error creating order:', error.message);
//         res.status(500).json({ error: 'Error creating order' });
//     }
// };

// const trackOrder = async (req, res) => {
//     const { orderCode } = req.params;

//     try {
//         const orderStatus = await getGHNOrderStatus(orderCode);
//         res.json(orderStatus);
//     } catch (error) {
//         res.status(500).json({ error: 'Error tracking order' });
//     }
// };

// const getGHNAddress = async (req, res) => {
//     const { addressId } = req.params;

//     try {
//         const address = await getAddress(addressId);
//         res.json(address);
//     } catch (error) {
//         res.status(500).json({ error: 'Error getting address' });
//     }
// };

module.exports = {
    sendConfirmationEmail,
};
