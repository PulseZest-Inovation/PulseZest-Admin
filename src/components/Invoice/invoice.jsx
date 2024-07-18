import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { learningFirestore } from '../../Learning/utils/Firebase/learningFirebaseConfig'; // Adjust the path as per your project structure
import html2pdf from 'html2pdf.js';

const InvoiceTemplate = () => {
  const [users, setUsers] = useState([]);
  const invoiceContainerRef = useRef(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const usersCollectionRef = collection(learningFirestore, 'users');
        const usersSnapshot = await getDocs(usersCollectionRef);
        const usersData = await Promise.all(
          usersSnapshot.docs.map(async userDoc => {
            const userData = userDoc.data();
            const userId = userDoc.id;

            // Fetch user's courses with payment details
            const userCoursesCollectionRef = collection(learningFirestore, `users/${userId}/courses`);
            const userCoursesSnapshot = await getDocs(userCoursesCollectionRef);
            const userCourses = await Promise.all(
              userCoursesSnapshot.docs.map(async courseDoc => {
                const courseData = courseDoc.data();
                const courseId = courseDoc.id;

                // Fetch course name
                const courseDocRef = doc(learningFirestore, 'courses', courseId);
                const courseDetails = await getDoc(courseDocRef);

                return {
                  courseId,
                  name: courseDetails.data().name,
                  ...courseData // Include payment details from the user's course doc
                };
              })
            );

            return {
              userId,
              ...userData,
              courses: userCourses
            };
          })
        );

        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users data:', error);
      }
    };

    fetchAllUsers();
  }, []);

  const generateInvoiceNumber = (lastInvoice) => {
    const [staticPart, yearPart, numberPart] = lastInvoice.split('-');
    const newInvoiceNumber = `PZ-${yearPart}-${String(Number(numberPart) + 1).padStart(2, '0')}`;
    return newInvoiceNumber;
  };

  const generateAndSaveInvoice = async (user) => {
    const lastInvoiceNumber = "PZ-2402"; // This should be fetched from the database ideally.
    const newInvoiceNumber = generateInvoiceNumber(lastInvoiceNumber);

    const element = invoiceContainerRef.current;

    // Generate PDF
    const opt = {
      margin: 1,
      filename: `${newInvoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    const invoicePDF = await html2pdf().from(element).set(opt).output('blob');

    // Save PDF to Firestore
    const invoiceRef = doc(collection(learningFirestore, 'invoice', user.userId));
    await setDoc(invoiceRef, { invoiceNumber: newInvoiceNumber, pdf: invoicePDF });

    console.log('Saved Invoice as PDF');
  };

  const renderInvoices = () => {
    return users.map(user => (
      <div key={user.userId}>
        <div ref={invoiceContainerRef} style={styles.invoiceContainer}>
          <div style={styles.header}>
            <div style={styles.brand}>
              <img src="https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/logo.png?alt=media&token=208465a0-63ae-4999-9c75-cf976af6a616" alt="Logo" style={styles.logo} />
              <div style={styles.brandName}>PulseZest-Learning</div>
            </div>
            <div style={styles.invoiceInfo}>
              <div style={styles.infoItem}>GST NO: 09ILJPK0660Q1ZC</div>
              <div style={styles.infoItem}>Date: {new Date().toDateString()}</div>
              <div style={styles.infoItem}>Invoice #: {generateInvoiceNumber("PZ-2402")}</div>
            </div>
          </div>

          <div style={styles.companyInfo}>
            <div style={styles.infoSection}>
              <div style={styles.sectionTitle}>PulseZest Learning</div>
              <div style={styles.infoItem}>Number: +91 6396219233</div>
              <div style={styles.infoItem}>Email: info@pulsezest.com</div>
              <div style={styles.infoItem}>GST IN: 09ILJPK0660Q1ZC </div>
              <div style={styles.infoItem}>Address: India</div>
            </div>

            <div style={styles.infoSection}>
              <div style={styles.sectionTitle}>Student Details</div>
              <div style={styles.infoItem}>Name: {user.name}</div>
              <div style={styles.infoItem}>Email: {user.email}</div>
              <div style={styles.infoItem}>User ID: {user.uid}</div>
              <div style={styles.infoItem}>SUID: {user.suid}</div>
            </div>
          </div>

          <table style={styles.productTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>#</th>
                <th style={styles.tableHeader}>Product details</th>
                <th style={styles.tableHeader}>Amount</th>
                <th style={styles.tableHeader}>Qty.</th>
                <th style={styles.tableHeader}>Order ID</th>
                <th style={styles.tableHeader}>Payment ID</th>
                <th style={styles.tableHeader}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {user.courses.map((course, index) => (
                <tr key={course.courseId}>
                  <td style={styles.tableContent}>{index + 1}</td>
                  <td style={styles.tableContent}>{course.name}</td>
                  <td style={styles.tableContent}>{course.amount}</td>
                  <td style={styles.tableContent}>1</td>
               
                  <td style={styles.tableContent}>{course.orderId}</td>
                  <td style={styles.tableContent}>{course.paymentId}</td>
                  <td style={styles.tableContent}>{course.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.totals}>
            <div style={styles.totalItem}>Net total: {calculateNetTotal(user.courses)}</div>
          </div>

          <div style={styles.paymentDetails}>
            <div style={styles.sectionTitle}>PAYMENT DETAILS</div>
            <div style={styles.infoItem}>Banks of Banks</div>
            <div style={styles.infoItem}>Bank/Sort Code: 1234567</div>
            <div style={styles.infoItem}>Account Number: 123456678</div>
            <div style={styles.infoItem}>Payment Reference: {generateInvoiceNumber("PZ-2402")}</div>
          </div>

          <div style={styles.footer}>
            <div style={styles.footerItem}>PulseZest-Learning</div>
            <div style={styles.footerItem}>info@pulsezest.com</div>
            <div style={styles.footerItem}>+91 6396219233</div>
          </div>
        </div>
        <button onClick={() => generateAndSaveInvoice(user)}>Generate and Save Invoice</button>
      </div>
    ));
  };

  // Helper functions to calculate totals, adjust as per your requirements
  const calculateNetTotal = (courses) => {
    let netTotal = 0;
    courses.forEach(course => {
      netTotal += course.amount;
    });
    return netTotal.toFixed(2);
  };

  return (
    <div>
      {renderInvoices()}
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