import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, Avatar, Grid, Card, CardContent, Button } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp'; // Import the Download icon
import { learningDb } from '../../../utils/Firebase/learningFirebaseConfig';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

const ManageStudent = () => {
  const { uid } = useParams();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesRef = collection(learningDb, `users/${uid}/courses`);
        const snapshot = await getDocs(coursesRef);

        const coursesData = [];

        for (const docSnap of snapshot.docs) {
          const courseId = docSnap.id;
          const courseDocRef = doc(learningDb, 'courses', courseId);
          const courseDocSnap = await getDoc(courseDocRef);

          if (courseDocSnap.exists()) {
            const courseData = courseDocSnap.data();

            const coursePurchaseDetailsRef = doc(learningDb, `users/${uid}/courses/${courseId}`);
            const coursePurchaseDetailsSnap = await getDoc(coursePurchaseDetailsRef);

            if (coursePurchaseDetailsSnap.exists()) {
              const coursePurchaseData = coursePurchaseDetailsSnap.data();

              const courseDetails = {
                courseId: courseId,
                name: courseData.name,
                thumbnail: courseData.thumbnail,
                id: courseData.id,
                salePrice: courseData.salePrice,
                description: courseData.description,
                amount: coursePurchaseData.amount / 100,
                currency: coursePurchaseData.currency,
                date: coursePurchaseData.enrollDate ? new Date(coursePurchaseData.enrollDate) : null,
                orderId: coursePurchaseData.orderNumber, // Fixed field name
                transactionId: coursePurchaseData.transactionId, // Fixed field name
                pdfUrl: coursePurchaseData.pdfUrl, 
                status: coursePurchaseData.status,
                invoiceNumber: coursePurchaseData.invoiceNumber,
              };
              coursesData.push(courseDetails);
            } else {
              console.warn(`Course purchase details not found for course ID ${courseId}`);
            }
          } else {
            console.warn(`Course with ID ${courseId} not found`);
          }
        }

        setCourses(coursesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [uid]);

  const handleDownloadInvoice = async (pdfUrl) => {
    try {
      if (pdfUrl) {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `invoice.pdf`; // Set a generic name for the downloaded file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.warn('PDF URL not found');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Manage Student
      </Typography>
      {courses.map(course => (
        <Card key={course.courseId} elevation={3} style={{ marginBottom: '20px' }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar alt={course.name} src={course.thumbnail} />
              </Grid>
              <Grid item xs={12} sm container direction="column" spacing={2}>
                <Grid item>
                  <Typography gutterBottom variant="h5">
                    {course.name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Description: {course.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Course ID: {course.id}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Course Price: ₹{course.salePrice}
                  </Typography>
                </Grid>
                <Grid item container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Amount: ₹{course.amount}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Currency: INR
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Invoice Number: {course.invoiceNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Date: {course.date ? course.date.toLocaleString() : 'Date not available'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Order ID: {course.orderId}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Transaction ID: {course.transactionId} {/* Fixed field name */}
                    </Typography>
                  </Grid> <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Status : {course.status} {/* Fixed field name */}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDownloadInvoice(course.pdfUrl)}
                  startIcon={<GetAppIcon />}
                  style={{ textTransform: 'none' }}
                >
                  Download Invoice
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ManageStudent;
