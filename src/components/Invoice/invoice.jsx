import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, collection, getDocs, setDoc, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { learningFirestore } from '../../Learning/utils/Firebase/learningFirebaseConfig';
import html2pdf from 'html2pdf.js';

const InvoiceTemplate = () => {
  const [users, setUsers] = useState([]);
  const invoiceContainerRef = useRef();
  const gst = 18; // Hardcoded GST percentage
  const processing = useRef(false);

  useEffect(() => {
    // Fetch users and their courses
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

                // Fetch course name and date
                const courseDocRef = doc(learningFirestore, 'courses', courseId);
                const courseDetails = await getDoc(courseDocRef);
                const courseDate = courseData.date; // Assumes `date` is in Timestamp format

                return {
                  courseId,
                  name: courseDetails.data().name,
                  dateProcessed: courseDate,
                  amount: courseData.amount, // Include amount and payment details
                  paymentId: courseData.paymentId,
                  orderId: courseData.orderId
                };
              })
            );

            return {
              userId,
              ...userData,
              courses: userCourses,
            };
          })
        );

        setUsers(usersData.filter(user => user.courses.length > 0)); // Only include users with courses
      } catch (error) {
        console.error('Error fetching users data:', error);
      }
    };

    fetchAllUsers();
  }, []);

  const fetchLastInvoiceNumber = async () => {
    try {
      const docRef = doc(learningFirestore, 'invoiceNumbers', 'lastInvoice');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().lastInvoiceNumber;
      } else {
        await setDoc(docRef, { lastInvoiceNumber: 'PZ-2400' });
        return 'PZ-2400'; // Initial invoice if none exists
      }
    } catch (error) {
      console.error('Error fetching last invoice number:', error);
      return null;
    }
  };

  const generateInvoiceNumber = async () => {
    const lastInvoiceNumber = await fetchLastInvoiceNumber();
    const prefix = lastInvoiceNumber.split('-')[0];
    const numberPart = lastInvoiceNumber.split('-')[1];
    // Increment number
    const newNumber = String(Number(numberPart) + 1);
    return `${prefix}-${newNumber}`;
  };

  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const generateAndSaveInvoice = async (user, course) => {
    try {
      // Check if the invoice already exists
      const historyRef = collection(learningFirestore, `invoices/${user.userId}/history`);
      const invoiceQuery = query(historyRef, where('courseId', '==', course.courseId));
      const invoiceSnapshot = await getDocs(invoiceQuery);
      if (!invoiceSnapshot.empty) {
        console.log('Invoice already exists for course:', course.courseId);
        return; // Invoice already exists, skip generating
      }

      const newInvoiceNumber = await generateInvoiceNumber();
      const element = invoiceContainerRef.current;

      // Set invoice number and date
      document.getElementById(`invoiceNumber-${user.userId}-${course.courseId}`).innerText = `Invoice #: ${newInvoiceNumber}`;
      document.getElementById(`invoiceDate-${user.userId}-${course.courseId}`).innerText = `Date: ${formatDate(course.dateProcessed)}`;

      // Generate PDF
      const opt = {
        margin: 0.5,
        filename: `${newInvoiceNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      const invoicePDF = await html2pdf().from(element).set(opt).output('blob');

      // Upload PDF to Firebase Storage
      const learningstorage = getStorage();
      const storageRef = ref(learningstorage, `invoices/${user.userId}/${newInvoiceNumber}.pdf`);
      await uploadBytes(storageRef, invoicePDF);

      const pdfURL = await getDownloadURL(storageRef);

      // Save PDF URL to Firestore
      const docRef = doc(historyRef);
      await setDoc(docRef, {
        invoiceNumber: newInvoiceNumber,
        pdfUrl: pdfURL,
        courseId: course.courseId // Save the courseId to check for duplicates
      });

      // Update last invoice number
      const lastInvoiceRef = doc(learningFirestore, 'invoiceNumbers', 'lastInvoice');
      await setDoc(lastInvoiceRef, { lastInvoiceNumber: newInvoiceNumber });

      console.log('Saved Invoice as PDF');
    } catch (error) {
      console.error('Error generating or saving invoice:', error);
    }
  };

  // Sequentially generate and save invoices to avoid conflicts
  const processInvoicesSequentially = async () => {
    if (processing.current || users.length === 0) return;

    processing.current = true;

    for (const user of users) {
      for (const course of user.courses) {
        await generateAndSaveInvoice(user, course);
      }
    }

    processing.current = false;
  };

  useEffect(() => {
    processInvoicesSequentially();
  }, [users]);

  const renderInvoices = () => {
    return users.flatMap(user => {
      return user.courses.map(course => {
        const courseAmount = course.amount / 100; // Convert paisa to rupees
        const courseGstAmount = (courseAmount * gst) / 100;
        const courseSubtotal = courseAmount - courseGstAmount;

        return (
          <div className="invoice-wrapper" key={user.userId + course.courseId}>
            <div ref={invoiceContainerRef} style={styles.invoiceContainer}>
              <div style={styles.header}>
                <div style={styles.brand}>
                  <div style={styles.brandName}>PulseZest-Learning</div>
                </div>
                <div style={styles.invoiceInfo}>
                  <div style={styles.infoItem}>GST NO: 09ILJPK0660Q1ZC</div>
                  <div style={styles.infoItem} id={`invoiceDate-${user.userId}-${course.courseId}`}>Date: </div>
                  <div style={styles.infoItem} id={`invoiceNumber-${user.userId}-${course.courseId}`}>Invoice #: </div>
                </div>
              </div>

              <div style={styles.companyInfo}>
                <div style={styles.infoSection}>
                  <div style={styles.sectionTitle}>PulseZest Learning</div>
                  <div style={styles.infoItem}>Number: +91 6396219233</div>
                  <div style={styles.infoItem}>Email: info@pulsezest.com</div>
                  <div style={styles.infoItem}>GST IN: 09ILJPK0660Q1ZC</div>
                  <div style={styles.infoItem}>Address: India</div>
                </div>

                <div style={styles.infoSection}>
                  <div style={styles.sectionTitle}>Student Details</div>
                  <div style={styles.infoItem}>Name: {user.name}</div>
                  <div style={styles.infoItem}>Email: {user.email}</div>
                  <div style={styles.infoItem}>User ID: {user.userId}</div>
                  <div style={styles.infoItem}>SUID: {user.suid}</div>
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
                  <tr>
                    <td style={styles.tableContent}>1</td>
                    <td style={styles.tableContent}>{course.name}</td>
                    <td style={styles.tableContent}>{courseSubtotal.toFixed(2)}</td>
                    <td style={styles.tableContent}>1</td>
                    <td style={styles.tableContent}>{courseGstAmount.toFixed(2)}</td>
                    <td style={styles.tableContent}>{courseAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <div style={styles.totals}>
                <div style={styles.totalItem}>Net total (₹): {courseSubtotal.toFixed(2)}</div>
                <div style={styles.totalItem}>GST (₹): {courseGstAmount.toFixed(2)}</div>
                <div style={styles.totalItem}>Total (₹): {courseAmount.toFixed(2)}</div>
              </div>
              <div key={course.courseId} style={styles.paymentDetails}>
                <div style={styles.sectionTitle}>PAYMENT DETAILS</div>
                <div style={styles.infoItem}>Payment Id: {course.paymentId}</div>
                <div style={styles.infoItem}>Order Id: {course.orderId}</div>
              </div>
              <h1 style={{ fontSize: '24px', margin: '0 0 0 auto', color: '#555', position: 'relative', left: '230px' }}>Love From ❤️ PulseZest</h1>

              <div style={styles.footer}>
                <div style={styles.footerItem}>PulseZest-Learning</div>
                <div style={styles.footerItem}>info@pulsezest.com</div>
                <div style={styles.footerItem}>+91 6396219233</div>
              </div>
            </div>
            {/* Ensure each invoice renders separately */}
            <div style={{ display: 'none' }}>
              {/* This hidden div is used to force each invoice to render separately */}
              <div ref={invoiceContainerRef}></div>
            </div>
          </div>
        );
      });
    });
  };

  // Helper functions to calculate totals, adjust as per your requirements
  const calculateGrossTotal = (courses) => {
    let grossTotal = 0;
    courses.forEach(course => {
      grossTotal += course.amount / 100; // Convert paisa to rupees
    });
    return grossTotal;
  };

  const calculateGst = (courses) => {
    let gstAmount = 0;
    courses.forEach(course => {
      gstAmount += (course.amount / 100) * gst / 100; // GST amount in rupees
    });
    return gstAmount;
  };

  const calculateNetTotal = (courses) => {
    let netTotal = 0;
    courses.forEach(course => {
      netTotal += (course.amount / 100) * (1 - gst / 100); // Amount after GST deduction
    });
    return netTotal;
  };

  return (
    <div style={{ display: 'none' }}>
      {renderInvoices()}
    </div>
  );
};

const styles = {
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
    boxSizing: 'border-box'
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
    marginTop: '30px',
    borderTop: '2px solid #CCCCCC',
    paddingTop: '10px',
    backgroundColor: '#F7F7F7',
    borderRadius: '18px',
  },
  footerItem: {
    fontSize: '12px',
    color: '#666666',
  },
};

export default InvoiceTemplate;