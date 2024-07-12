// services/renderInvoice.js
const React = require('react');
const ReactPDF = require('@react-pdf/renderer');
const Invoice = require('../controllers/clientComponents/Invoice');

const renderInvoice = async (order) => {
    console.log('Order:', order); // Add this line to log the order object
  const invoiceDocument = React.createElement(Invoice, { order });
  const stream = await ReactPDF.renderToStream(invoiceDocument);
  return stream;
};

module.exports = renderInvoice;
