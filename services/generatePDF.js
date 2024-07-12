const React = require("react");
const ReactDOMServer = require("react-dom/server");
const { pdf } = require("@react-pdf/renderer");
const Invoice = require("../controllers/clientComponents/Invoice");

const generatePdf = async (order) => {
  const document = <Invoice order={order} />;
  const pdfBuffer = await pdf(document).toBuffer();
  return pdfBuffer;
};

module.exports = generatePdf;
