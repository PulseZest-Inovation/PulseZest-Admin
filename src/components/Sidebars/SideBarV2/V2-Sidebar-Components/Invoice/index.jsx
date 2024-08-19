import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas'; // Import the library 
import jsPDF from 'jspdf'; 

import Logo from '../../../../../assets/logo.png';

const InvoiceTemplate = () => {
  const [customerName, setCustomerName] = useState('Divyansh Chauhan');
  const [customerEmail, setCustomerEmail] = useState('divyansh20060@gmail.com');
  const [customerNumber, setcustomerNumber] = useState('9719688888');
  const [suid, setSuid] = useState('77773');
  const [invoiceDate, setInvoiceDate] = useState('18-08-24');
  const [invoiceNumber, setInvoiceNumber] = useState('Pz: 001');
  const [products, setProducts] = useState([
    { id: 1, details: 'Duugu Api', amount: 100, qty: 1, tax: 200, total: 300 },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [paymentId, setPaymentId] = useState('N/A');
  const [orderId, setOrderId] = useState('N/A');
  const [discountPercentage, setDiscountPercentage] = useState(0);

  // Calculate totals whenever products or discountPercentage change
  const calculateTotals = () => {
    const netTotal = products.reduce(
      (acc, product) => acc + (parseFloat(product.amount) || 0) * (parseFloat(product.qty) || 0),
      0
    );
    const gst = products.reduce((acc, product) => acc + (parseFloat(product.tax) || 0), 0);
    const Grandtotal = netTotal + gst;
    const discountAmount = (discountPercentage / 100) * Grandtotal;
    const discountedTotal = Grandtotal - discountAmount;
    return { netTotal, gst, Grandtotal, discountAmount, discountedTotal };
  };

  const { netTotal, gst, Grandtotal, discountAmount, discountedTotal } = calculateTotals();

  // Function to handle changes in product fields
  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    newProducts[index].total = (parseFloat(newProducts[index].amount) || 0) * (parseFloat(newProducts[index].qty) || 0) + (parseFloat(newProducts[index].tax) || 0);
    setProducts(newProducts);
  };

  // Function to add a new product row
  const addProduct = () => {
    setProducts([
      ...products,
      { id: products.length + 1, details: '', amount: 0, qty: 1, tax: 0, total: 0 },
    ]);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

 

  const downloadInvoice = async () => {
    const invoice = document.getElementById('invoice');
    const buttons = document.querySelectorAll('.hide-in-pdf'); // Select buttons to hide
  
    try {
      // Hide buttons
      buttons.forEach(button => button.style.display = 'none');
  
      // Generate PDF
      html2canvas(invoice, { 
        scale: 2,
        useCORS: true // Ensures CORS headers are handled
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 0.5); // Use JPEG and set quality to 0.5 (50%)
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Define margins
        const margin = 10; // Margin in mm
        const imgWidth = pdf.internal.pageSize.getWidth() - 2 * margin; // Page width minus margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
        const pageHeight = pdf.internal.pageSize.getHeight() - 2 * margin; // Page height minus margins
        let heightLeft = imgHeight;
        let position = margin;
  
        // Add the invoice image to the PDF
        pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
  
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + margin;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
  
        pdf.save('invoice.pdf');
  
        // Show buttons again after generating the PDF
        buttons.forEach(button => button.style.display = 'block');
      });
    } catch (error) {
      console.error("Error generating PDF", error);
    }
  };
  

  return (
    <div style={styles.scrollContainer}>
     <div id="invoice" style={styles.invoiceContainer}>
        <div style={styles.header}>
          <div style={styles.brand}>
            <img src={Logo} alt="PulseZest Logo" style={styles.logo} />
            <div style={styles.brandName}>PulseZest</div>
          </div>
          <div style={styles.invoiceInfo}>
            <div style={styles.infoItem}>GST NO: 09ILJPK0660Q1ZC</div>
            <div style={styles.infoItem}>
              Date: {isEditing ? (
                <input
                  type="text"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  style={styles.inputField}
                />
              ) : (
                invoiceDate
              )}
            </div>
            <div style={styles.infoItem}>
              Invoice: {isEditing ? (
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  style={styles.inputField}
                />
              ) : (
                invoiceNumber
              )}
            </div>
          </div>
        </div>

        <div style={styles.companyInfo}>
          <div style={styles.infoSection}>
            <div style={styles.sectionTitle}>PulseZest</div>
            <div style={styles.infoItem}>Number: +91 7248457558</div>
            <div style={styles.infoItem}>Email: info@pulsezest.com</div>
            <div style={styles.infoItem}>Address: Pashupati Vihar Colony</div>
            <div style={styles.infoItem}>69/2, Ground Floor</div>
            <div style={styles.infoItem}>Bareilly, Uttar Pradesh</div>
            <div style={styles.infoItem}>Pin-243006</div>
          </div>

          <div style={styles.infoSection}>
            <div style={styles.sectionTitle}>Customer Details</div>
            <div style={styles.infoItem}>
              Name: {isEditing ? (
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={styles.inputField}
                />
              ) : (
                customerName
              )}
            </div>
            <div style={styles.infoItem}>
              Email: {isEditing ? (
                <input
                  type="text"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  style={styles.inputField}
                />
              ) : (
                customerEmail
              )}
            </div>
            <div style={styles.infoItem}>
              Number: {isEditing ? (
                <input
                  type="text"
                  value={customerNumber}
                  onChange={(e) => setcustomerNumber(e.target.value)}
                  style={styles.inputField}
                />
              ) : (
                customerNumber
              )}
            </div>
            <div style={styles.infoItem}>
              UID: {isEditing ? (
                <input
                  type="text"
                  value={suid}
                  onChange={(e) => setSuid(e.target.value)}
                  style={styles.inputField}
                />
              ) : (
                suid
              )}
            </div>
          </div>
        </div>

        <table style={styles.productTable}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>#</th>
              <th style={styles.tableHeader}>Product details</th>
              <th style={styles.tableHeader}>Amount (₹)</th>
              <th style={styles.tableHeader}>Qty.</th>
              <th style={styles.tableHeader}>Tax Amount (₹)</th>
              <th style={styles.tableHeader}>Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td style={styles.tableContent}>{product.id}</td>
                <td style={styles.tableContent}>
                  {isEditing ? (
                    <input
                      type="text"
                      value={product.details}
                      onChange={(e) => handleProductChange(index, 'details', e.target.value)}
                      style={styles.inputField}
                    />
                  ) : (
                    product.details
                  )}
                </td>
                <td style={styles.tableContent}>
                  {isEditing ? (
                    <input
                      type="number"
                      value={product.amount}
                      onChange={(e) => handleProductChange(index, 'amount', e.target.value)}
                      style={styles.inputField}
                    />
                  ) : (
                    product.amount
                  )}
                </td>
                <td style={styles.tableContent}>
                  {isEditing ? (
                    <input
                      type="number"
                      value={product.qty}
                      onChange={(e) => handleProductChange(index, 'qty', e.target.value)}
                      style={styles.inputField}
                    />
                  ) : (
                    product.qty
                  )}
                </td>
                <td style={styles.tableContent}>
                  {isEditing ? (
                    <input
                      type="number"
                      value={product.tax}
                      onChange={(e) => handleProductChange(index, 'tax', e.target.value)}
                      style={styles.inputField}
                    />
                  ) : (
                    product.tax
                  )}
                </td>
                <td style={styles.tableContent}>
                  {product.total} {/* The total is already computed and set */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isEditing && (
          <button onClick={addProduct} style={styles.addButton}>
            Add Product
          </button>
        )}

        <div style={styles.totals}>
          <div style={styles.totalItem}>
            Net total (₹): {isEditing ? (
              <input
                type="number"
                value={netTotal}
                readOnly
                style={styles.inputField}
              />
            ) : (
              netTotal
            )}
          </div>
          <div style={styles.totalItem}>
            GST (₹): {isEditing ? (
              <input
                type="number"
                value={gst}
                readOnly
                style={styles.inputField}
              />
            ) : (
              gst
            )}
          </div>

          <div style={styles.totalItem}>
            Discount (₹): {isEditing ? (
              <input
                type="number"
                value={discountAmount}
                readOnly
                style={styles.inputField}
              />
            ) : (
              discountAmount
            )}
          </div>

          <div style={styles.totalItem}>
  Grand Total (₹): {isEditing ? (
    <>
      {discountPercentage > 0 && (
        <>
          <span style={{
            position: 'relative',
            display: 'inline-block'
          }}>
            <span style={{
              position: 'absolute',
              top: '5px', // Adjust this value to move the line up or down
              left: '0',
              right: '0',
              borderTop: '1px solid black',
              zIndex: 1
            }} />
            <span style={{
              position: 'relative',
              zIndex: 2
            }}>
              {Grandtotal.toFixed(2)}
            </span>
          </span>
          <span> {discountedTotal.toFixed(2)}</span> {/* Discounted Total */}
        </>
      )}
      {discountPercentage === 0 && (
        <span>{Grandtotal.toFixed(2)}</span> // No discount applied
      )}
    </>
  ) : (
    <>
      {discountPercentage > 0 ? (
        <>
          <span style={{
            position: 'relative',
            display: 'inline-block'
          }}>
            <span style={{
              position: 'absolute',
              top: '18px', // Adjust this value to move the line up or down
              left: '0',
              right: '0',
              borderTop: '1px solid black',
              zIndex: 1
            }} />
            <span style={{
              position: 'relative',
              zIndex: 2
            }}>
              {Grandtotal.toFixed(2)}
            </span>
          </span>
          <span> {discountedTotal.toFixed(2)}</span> {/* Discounted Total */}
        </>
      ) : (
        <span>{Grandtotal.toFixed(2)}</span> // No discount applied
      )}
    </>
  )}
</div>

          <div style={styles.discountSection}>
            <span style={styles.discountLabel}>Discount (%): </span>
            {isEditing ? (
              <input
                type="number"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Math.max(0, Math.min(100, e.target.value)))}
                style={styles.discountInput}
                min="0"
                max="100"
              />
            ) : (
              <span>{discountPercentage || 0}</span>
            )}
          </div>
        </div>

        <div style={styles.paymentDetails}>
          <div style={styles.sectionTitle}>PAYMENT DETAILS</div>
          <div style={styles.infoItem}>
            Payment ID: {isEditing ? (
              <input
                type="text"
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
                style={styles.inputField}
              />
            ) : (
              paymentId
            )}
          </div>
          <div style={styles.infoItem}>
            Order ID: {isEditing ? (
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                style={styles.inputField}
              />
            ) : (
              orderId
            )}
          </div>
        </div>

        <h1 style={{ fontSize: '24px', margin: '0 0 0 auto', color: '#555', position: 'relative', left: '230px' }}>
          Love From ❤️ PulseZest
        </h1>

        <div style={styles.footer}>
          <div style={styles.footerItem}>PulseZest</div>
          <div style={styles.footerItem}>info@pulsezest.com</div>
          <div style={styles.footerItem}>+91 7248457558</div>
        </div>

        <button onClick={toggleEditMode} style={{...styles.saveButton, display: 'none'}} className="hide-in-pdf">
        {isEditing ? 'Save' : 'Edit'}
      </button>
      <button onClick={downloadInvoice} style={styles.downloadButton} className="hide-in-pdf">
        Download Invoice
      </button>
      </div>
    </div>
  );
};


const styles = {
  scrollContainer: {
    overflowY: 'auto',
    height: '100%',
  },
  discountSection: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '-50px',
    marginBottom: '5px',
    marginLeft: '20px',
    fontWeight: 'bold',
  },
  invoiceContainer: {
    fontFamily: 'Arial, sans-serif',
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #CCCCCC',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#FFFFFF',
    color: '#333333',
    boxSizing: 'border-box',
    position: 'relative',
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
    width: '100px',  // Adjust the size as needed
    height: '100px', // Adjust the size as needed
    marginTop:'-6px',
  },
  brandName: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop:'-24px',
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
    justifyContent: 'space-evenly',
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
    color: '#0437F2',
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
    color: '#0437F2',
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
    fontWeight: 'bold',
    color: '#0437F2',
    borderRadius: '8px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px',
    borderTop: '2px solid #1C2833',
    paddingTop: '10px',
    backgroundColor: '#F7F7F7',
    borderRadius: '18px',
  },
  footerItem: {
    fontSize: '12px',
    color: '#0437F2',
  },
  inputField: {
    marginLeft: '10px',
    padding: '5px',
    border: '1px solid #CCCCCC',
    borderRadius: '4px',
    outline: 'none',
  },
  addButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#0437F2',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  saveButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '10px 20px',
    backgroundColor: '#28A745',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  downloadButton: {
    position: 'absolute',
    top: '10px',
    right: '80px',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default InvoiceTemplate;


