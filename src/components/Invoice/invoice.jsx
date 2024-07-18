import React from 'react';

const InvoiceTemplate = () => {
  return (
    <div style={styles.invoiceContainer}>
      <div style={styles.header}>
        <div style={styles.brand}>
          <img src="https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/logo.png?alt=media&token=208465a0-63ae-4999-9c75-cf976af6a616" alt="Logo" style={styles.logo} />
          <div style={styles.brandName}>PulseZest-Learning</div>
        </div>
        <div style={styles.invoiceInfo}>
        <div style={styles.infoItem}>GST NO: 09ILJPK0660Q1ZC</div>
          <div style={styles.infoItem}>Date: April 26, 2023</div>
          <div style={styles.infoItem}>Invoice #: BRA-00335</div>
        </div>
      </div>

       {/*Static Data NOt change*/}

      <div style={styles.companyInfo}>
        <div style={styles.infoSection}>
          <div style={styles.sectionTitle}>PulseZest Learning</div>
          <div style={styles.infoItem}>Number: +91 6396219233</div>
          <div style={styles.infoItem}>Email: info@pulsezest.com</div>
          <div style={styles.infoItem}>GST IN: 09ILJPK0660Q1ZC </div>
          <div style={styles.infoItem}>Address: India</div>
        </div>

            {/*Dynamic Data  change By user*/}

        <div style={styles.infoSection}>
          <div style={styles.sectionTitle}>Student Details</div>
          <div style={styles.infoItem}>Name: </div>
          <div style={styles.infoItem}>Email: </div>
          <div style={styles.infoItem}>User ID:</div>
          <div style={styles.infoItem}>SUID: </div>
        </div>
      </div>

      <table style={styles.productTable}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>#</th>
            <th style={styles.tableHeader}>Product details</th>
            <th style={styles.tableHeader}>Price</th>
            <th style={styles.tableHeader}>Qty.</th>
            <th style={styles.tableHeader}>VAT</th>
            <th style={styles.tableHeader}>Subtotal</th>
            <th style={styles.tableHeader}>Subtotal + VAT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.tableContent}>1</td>
            <td style={styles.tableContent}>Montly accountinc services</td>
            <td style={styles.tableContent}>$150.00</td>
            <td style={styles.tableContent}>1</td>
            <td style={styles.tableContent}>20%</td>
            <td style={styles.tableContent}>$150.00</td>
            <td style={styles.tableContent}>$180.00</td>
          </tr>
          <tr>
            <td style={styles.tableContent}>2</td>
            <td style={styles.tableContent}>Taxation consulting (hour)</td>
            <td style={styles.tableContent}>$60.00</td>
            <td style={styles.tableContent}>2</td>
            <td style={styles.tableContent}>20%</td>
            <td style={styles.tableContent}>$120.00</td>
            <td style={styles.tableContent}>$144.00</td>
          </tr>
          <tr>
            <td style={styles.tableContent}>3</td>
            <td style={styles.tableContent}>Bookkeeping services</td>
            <td style={styles.tableContent}>$50.00</td>
            <td style={styles.tableContent}>1</td>
            <td style={styles.tableContent}>20%</td>
            <td style={styles.tableContent}>$50.00</td>
            <td style={styles.tableContent}>$60.00</td>
          </tr>
        </tbody>
      </table>

      <div style={styles.totals}>
        <div style={styles.totalItem}>Net total: $320.00</div>
        <div style={styles.totalItem}>VAT total: $64.00</div>
        <div style={styles.totalItem}>Total: $384.00</div>
      </div>

      <div style={styles.paymentDetails}>
        <div style={styles.sectionTitle}>PAYMENT DETAILS</div>
        <div style={styles.infoItem}>Banks of Banks</div>
        <div style={styles.infoItem}>Bank/Sort Code: 1234567</div>
        <div style={styles.infoItem}>Account Number: 123456678</div>
        <div style={styles.infoItem}>Payment Reference: BRA-00335</div>
      </div>

     

      <div style={styles.footer}>
        <div style={styles.footerItem}>PulseZest-Learning</div>
        <div style={styles.footerItem}>info@pulsezest.com</div>
        <div style={styles.footerItem}>+91 6396219233</div>
      </div>
    </div>
  );
};

const styles = {
  invoiceContainer: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #CCCCCC',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    borderBottom: '1px solid #CCCCCC',
    paddingBottom: '10px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: '50px',
    height: '50px',
    marginRight: '10px',
    borderRadius: '50%',
  },
  brandName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333333',
  },
  invoiceInfo: {
    textAlign: 'right',
    flex: '1',
  },
  infoItem: {
    marginBottom: '5px',
    color: '#666666',
  },
  companyInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    backgroundColor: '#F7F7F7',
    padding: '20px',
    borderRadius: '8px',
  },
  infoSection: {
    flex: '1',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333333',
  },
  productTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  tableHeader: {
    backgroundColor: '#F7F7F7',
    padding: '10px',
    fontWeight: 'bold',
    textAlign: 'left',
    borderBottom: '2px solid #CCCCCC',
  },
  tableContent: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #CCCCCC',
  },
  totals: {
    textAlign: 'right',
    marginTop: '20px',
    borderTop: '2px solid #CCCCCC',
    paddingTop: '10px',
  },
  totalItem: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  paymentDetails: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#F7F7F7',
    borderRadius: '8px',
  },
  notes: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#F7F7F7',
    borderRadius: '8px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    borderTop: '2px solid #CCCCCC',
    paddingTop: '10px',
    backgroundColor: '#F7F7F7',
    borderRadius: '8px',
  },
  footerItem: {
    fontSize: '12px',
    color: '#666666',
  },
};

export default InvoiceTemplate;
