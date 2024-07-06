
const express = require('express');
const router = express.Router();
const { sendConfirmationEmail } = require('../controllers/orderController');
const { authCheck } = require('../middlewares/auth');

router.post('/send-confirmation-email', authCheck, sendConfirmationEmail);

module.exports = router;
