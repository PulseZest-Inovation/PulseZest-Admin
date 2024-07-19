import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, Avatar, Grid, Card, CardContent, Button, IconButton } from '@mui/material';
import { learningDb } from '../../../utils/Firebase/learningFirebaseConfig';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import GetAppIcon from '@mui/icons-material/GetApp'; // Import the Download icon

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
                date: coursePurchaseData.date ? coursePurchaseData.date.toDate() : null,
                orderId: coursePurchaseData.orderId,
                paymentId: coursePurchaseData.paymentId,
                signature: coursePurchaseData.signature,
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

  const handleDownloadInvoice = (courseId) => {
    // Placeholder function for downloading invoice
    console.log(`Downloading invoice for course ID: ${courseId}`);
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
                      Currency: {course.currency}
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
                      Payment ID: {course.paymentId}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Signature: {course.signature}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDownloadInvoice(course.courseId)}
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
