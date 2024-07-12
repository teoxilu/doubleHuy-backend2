const React = require("react");
const {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} = require("@react-pdf/renderer");
const numeral = require("numeral");


const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 12,
    color: '#333',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  section: {
    marginBottom: 10,
    padding: 10,
    border: '1px solid #E0E0E0',
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textDecoration: 'underline',
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  companyInfo: {
    fontSize: 12,
    lineHeight: 1.5,
  },
  keyInfo: {
    fontWeight: 'bold',
  },
  table: {
    display: 'table',
    width: '100%',
    marginBottom: 10,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '20%',
    padding: 5,
    backgroundColor: '#F0F0F0',
    border: '1px solid #E0E0E0',
    textAlign: 'center',
  },
  tableCellHeader: {
    fontWeight: 'bold',
  },
  tableColContent: {
    width: '20%',
    padding: 5,
    border: '1px solid #E0E0E0',
    textAlign: 'center',
  },
  tableCell: {
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    textAlign: 'center',
    color: '#888',
  },
  notes: {
    marginTop: 5,
    fontSize: 10,
    color: '#666',
  },
  primary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
});






const Invoice = ({ order }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>INVOICE</Text>
        
        {/* Company Info Section */}
        <View style={styles.section}>
          <Text style={styles.title}>Company Info</Text>
          <Text style={styles.companyInfo}>
            <Text style={styles.keyInfo}>Company Name:</Text> 2HS{"\n"}
            <Text style={styles.keyInfo}>Address:</Text> 01 Vo Van Ngan, Linh Chieu, Thu Duc, Ho Chi Minh City{"\n"}
            <Text style={styles.keyInfo}>Hotline:</Text> +84 973 711 868{"\n"}
            <Text style={styles.keyInfo}>Email:</Text> support@2hs.com
          </Text>
        </View>

        {/* Order Details Section */}
        <View style={styles.section}>
          <Text style={styles.title}>Order Details:</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Title</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Price</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Brand</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Size</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Quantity</Text>
              </View>
            </View>
            {order.products.map((product, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableColContent}>
                  <Text style={styles.tableCell}>
                    {product.product.title}
                  </Text>
                </View>
                <View style={styles.tableColContent}>
                  <Text style={styles.tableCell}>
                    {numeral(product.product.price).format("0,0")} VND
                  </Text>
                </View>
                <View style={styles.tableColContent}>
                  <Text style={styles.tableCell}>
                    {product.product.brand}
                  </Text>
                </View>
                <View style={styles.tableColContent}>
                  <Text style={styles.tableCell}>
                    {product.product.size}
                  </Text>
                </View>
                <View style={styles.tableColContent}>
                  <Text style={styles.tableCell}>{product.count}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Total Amount Section */}
        <View style={styles.section}>
          <Text style={styles.title}>Total Amount:</Text>
          <Text style={styles.primary}>
            {numeral(order.paymentIntent.amount).format("0,0")} VND
          </Text>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.title}>Payment Method:</Text>
          <Text style={styles.text}>{order.paymentIntent.status}</Text>
        </View>

        {/* Footer Section */}
        <Text style={styles.footer}>
          ~ Thank you for shopping at 2HS! ~
        </Text>
        <Text style={styles.notes}>
          If you have any questions, please contact us via email or phone number above.
        </Text>
      </Page>
    </Document>
  );
};




module.exports = Invoice;
