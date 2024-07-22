import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  IconButton,
  TextField,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { learningDb } from '../../../utils/Firebase/learningFirebaseConfig';

const EditCourses = () => {
  const [courses, setCourses] = useState([]);
  const [newChapterName, setNewChapterName] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [newVideoLink, setNewVideoLink] = useState('');
  const [newVideoDescription, setNewVideoDescription] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(learningDb, 'courses'));
      const courseList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(courseList);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocalUpdate = (courseId, updatedFields) => {
    setCourses(courses.map(course =>
      course.id === courseId ? { ...course, ...updatedFields } : course
    ));
  };
  const handleSaveToDatabase = async (courseId, fieldsToUpdate) => {
    try {
      const docRef = doc(learningDb, 'courses', courseId);
      await updateDoc(docRef, fieldsToUpdate);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const docRef = doc(learningDb, 'courses', courseId);
      await deleteDoc(docRef);
      setCourses(courses.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCourseToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (courseToDelete) {
      await handleDeleteCourse(courseToDelete.id);
      handleDialogClose();
    }
  };

 const handleAddChapter = async (courseId) => {
  const course = courses.find(course => course.id === courseId);
  const updatedChapters = [...course.chapters || [], { chapterName: newChapterName, topics: [] }];
  handleLocalUpdate(courseId, { chapters: updatedChapters });
  setNewChapterName('');
  await handleSaveToDatabase(courseId, { chapters: updatedChapters });
};

  const handleDeleteChapter = async (courseId, chapterIndex) => {
    const updatedChapters = [...courses.find(course => course.id === courseId).chapters];
    updatedChapters.splice(chapterIndex, 1);
    handleLocalUpdate(courseId, { chapters: updatedChapters });
    await handleSaveToDatabase(courseId, { chapters: updatedChapters });
  };

  const handleAddTopic = async (courseId, chapterIndex) => {
    const updatedChapters = [...courses.find(course => course.id === courseId).chapters];
    updatedChapters[chapterIndex].topics.push({
      topicName: newTopicName,
      topicDescription: newTopicDescription,
      videoLinks: []
    });
    handleLocalUpdate(courseId, { chapters: updatedChapters });
    setNewTopicName('');
    setNewTopicDescription('');
    await handleSaveToDatabase(courseId, { chapters: updatedChapters });
  };

  const handleDeleteTopic = async (courseId, chapterIndex, topicIndex) => {
    const updatedChapters = [...courses.find(course => course.id === courseId).chapters];
    updatedChapters[chapterIndex].topics.splice(topicIndex, 1);
    handleLocalUpdate(courseId, { chapters: updatedChapters });
    await handleSaveToDatabase(courseId, { chapters: updatedChapters });
  };

  const handleAddVideoLink = async (courseId, chapterIndex, topicIndex) => {
    const updatedChapters = [...courses.find(course => course.id === courseId).chapters];
    updatedChapters[chapterIndex].topics[topicIndex].videoLinks.push({ link: newVideoLink, description: newVideoDescription });
    handleLocalUpdate(courseId, { chapters: updatedChapters });
    setNewVideoLink('');
    setNewVideoDescription('');
    await handleSaveToDatabase(courseId, { chapters: updatedChapters });
  };

  const handleDeleteVideoLink = async (courseId, chapterIndex, topicIndex, videoLinkIndex) => {
    const updatedChapters = [...courses.find(course => course.id === courseId).chapters];
    updatedChapters[chapterIndex].topics[topicIndex].videoLinks.splice(videoLinkIndex, 1);
    handleLocalUpdate(courseId, { chapters: updatedChapters });
    await handleSaveToDatabase(courseId, { chapters: updatedChapters });
  };

  const handleChange = (courseId, chapterIndex, topicIndex, videoLinkIndex, field, value) => {
    const updatedChapters = [...courses.find(course => course.id === courseId).chapters];

    if (chapterIndex !== null && topicIndex === null) {
      updatedChapters[chapterIndex][field] = value;
    } else if (chapterIndex !== null && topicIndex !== null && videoLinkIndex === null) {
      updatedChapters[chapterIndex].topics[topicIndex][field] = value;
    } else if (chapterIndex !== null && topicIndex !== null && videoLinkIndex !== null) {
      // Ensure video link is an object
      if (typeof updatedChapters[chapterIndex].topics[topicIndex].videoLinks[videoLinkIndex] === 'string') {
        updatedChapters[chapterIndex].topics[topicIndex].videoLinks[videoLinkIndex] = { link: '', description: '' };
      }
      updatedChapters[chapterIndex].topics[topicIndex].videoLinks[videoLinkIndex][field] = value;
    }

    handleLocalUpdate(courseId, { chapters: updatedChapters });
  };

  const handleSaveChange = async (courseId, chapterIndex, topicIndex = null, videoLinkIndex = null) => {
    const updatedChapters = [...courses.find(course => course.id === courseId).chapters];
    await handleSaveToDatabase(courseId, { chapters: updatedChapters });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Manage Courses
      </Typography>
      {loading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : (
        courses.map(course => (
          <Accordion key={course.id} style={{ marginBottom: '20px' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">{course.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom>Chapters:</Typography>
                  {course.chapters && course.chapters.map((chapter, chapterIndex) => (
                    <Accordion key={chapterIndex} style={{ marginBottom: '10px' }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <TextField
                          label="Chapter Name"
                          value={chapter.chapterName}
                          onChange={(e) => handleChange(course.id, chapterIndex, null, null, 'chapterName', e.target.value)}
                          onBlur={() => handleSaveChange(course.id, chapterIndex)}
                          margin="normal"
                          variant="outlined"
                          fullWidth
                        />
                      </AccordionSummary>
                      <AccordionDetails>
                        {chapter.topics && chapter.topics.map((topic, topicIndex) => (
                          <Accordion key={topicIndex} style={{ marginBottom: '10px' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <TextField
                                label="Topic Name"
                                value={topic.topicName}
                                onChange={(e) => handleChange(course.id, chapterIndex, topicIndex, null, 'topicName', e.target.value)}
                                onBlur={() => handleSaveChange(course.id, chapterIndex, topicIndex)}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                              />
                            </AccordionSummary>
                            <AccordionDetails>
                              <TextField
                                label="Topic Description"
                                value={topic.topicDescription}
                                onChange={(e) => handleChange(course.id, chapterIndex, topicIndex, null, 'topicDescription', e.target.value)}
                                onBlur={() => handleSaveChange(course.id, chapterIndex, topicIndex)}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={2}
                                style={{ marginBottom: '10px' }}
                              />
                              {topic.videoLinks && topic.videoLinks.map((videoLink, videoLinkIndex) => (
                                <div key={videoLinkIndex} style={{ marginBottom: '10px' }}>
                                  <TextField
                                    label={`Video Link ${videoLinkIndex + 1}`}
                                    value={videoLink.link}
                                    onChange={(e) => handleChange(course.id, chapterIndex, topicIndex, videoLinkIndex, 'link', e.target.value)}
                                    onBlur={() => handleSaveChange(course.id, chapterIndex, topicIndex, videoLinkIndex)}
                                    margin="normal"
                                    variant="outlined"
                                    fullWidth
                                    style={{ marginBottom: '10px' }}
                                  />
                                  <TextField
                                    label="Video Description"
                                    value={videoLink.description}
                                    onChange={(e) => handleChange(course.id, chapterIndex, topicIndex, videoLinkIndex, 'description', e.target.value)}
                                    onBlur={() => handleSaveChange(course.id, chapterIndex, topicIndex, videoLinkIndex)}
                                    margin="normal"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    style={{ marginBottom: '10px' }}
                                  />
                                  <Typography variant="body1">Preview:</Typography>
                                  <div
                                    style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}
                                    dangerouslySetInnerHTML={{ __html: videoLink.description }}
                                  />
                                  <IconButton
                                    onClick={() => handleDeleteVideoLink(course.id, chapterIndex, topicIndex, videoLinkIndex)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </div>
                              ))}
                              <TextField
                                label="New Video Link"
                                value={newVideoLink}
                                onChange={(e) => setNewVideoLink(e.target.value)}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                style={{ marginBottom: '10px' }}
                              />
                              <TextField
                                label="New Video Description"
                                value={newVideoDescription}
                                onChange={(e) => setNewVideoDescription(e.target.value)}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                style={{ marginBottom: '10px' }}
                              />
                              <Button
                                variant="contained"
                                onClick={() => handleAddVideoLink(course.id, chapterIndex, topicIndex)}
                                style={{ marginBottom: '10px' }}
                              >
                                Add Video Link
                              </Button>
                              <Divider style={{ margin: '10px 0' }} />
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleDeleteTopic(course.id, chapterIndex, topicIndex)}
                              >
                                Delete Topic
                              </Button>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                        <TextField
                          label="New Topic Name"
                          value={newTopicName}
                          onChange={(e) => setNewTopicName(e.target.value)}
                          margin="normal"
                          variant="outlined"
                          fullWidth
                        />
                        <TextField
                          label="New Topic Description"
                          value={newTopicDescription}
                          onChange={(e) => setNewTopicDescription(e.target.value)}
                          margin="normal"
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={2}
                          style={{ marginTop: '10px' }}
                        />
                        <Button
                          variant="contained"
                          onClick={() => handleAddTopic(course.id, chapterIndex)}
                          style={{ marginTop: '10px' }}
                        >
                          Add Topic
                        </Button>
                        <Divider style={{ margin: '10px 0' }} />
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDeleteChapter(course.id, chapterIndex)}
                        >
                          Delete Chapter
                        </Button>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                  <TextField
                    label="New Chapter Name"
                    value={newChapterName}
                    onChange={(e) => setNewChapterName(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleAddChapter(course.id)}
                    style={{ marginTop: '10px' }}
                  >
                    Add Chapter
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom>Other Content:</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Course Name"
                        value={course.name || ''}
                        onChange={(e) => handleLocalUpdate(course.id, { name: e.target.value })}
                        onBlur={() => handleSaveToDatabase(course.id, { name: course.name })}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Thumbnail URL"
                        value={course.thumbnail || ''}
                        onChange={(e) => handleLocalUpdate(course.id, { thumbnail: e.target.value })}
                        onBlur={() => handleSaveToDatabase(course.id, { thumbnail: course.thumbnail })}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Publish Date"
                        value={course.publishDate || ''}
                        onChange={(e) => handleLocalUpdate(course.id, { publishDate: e.target.value })}
                        onBlur={() => handleSaveToDatabase(course.id, { publishDate: course.publishDate })}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Regular Price"
                        value={course.regularPrice || ''}
                        onChange={(e) => handleLocalUpdate(course.id, { regularPrice: e.target.value })}
                        onBlur={() => handleSaveToDatabase(course.id, { regularPrice: course.regularPrice })}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Sale Price"
                        value={course.salePrice || ''}
                        onChange={(e) => handleLocalUpdate(course.id, { salePrice: e.target.value })}
                        onBlur={() => handleSaveToDatabase(course.id, { salePrice: course.salePrice })}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Course Level"
                        value={course.courseLevel || ''}
                        onChange={(e) => handleLocalUpdate(course.id, { courseLevel: e.target.value })}
                        onBlur={() => handleSaveToDatabase(course.id, { courseLevel: course.courseLevel })}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="What You'll Learn"
                        value={course.whatYouLearn || ''}
                        onChange={(e) => handleLocalUpdate(course.id, { whatYouLearn: e.target.value })}
                        onBlur={() => handleSaveToDatabase(course.id, { whatYouLearn: course.whatYouLearn })}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Course Requirements"
                        value={course.courseRequirements || ''}
                        onChange={(e) => handleLocalUpdate(course.id, { courseRequirements: e.target.value })}
                        onBlur={() => handleSaveToDatabase(course.id, { courseRequirements: course.courseRequirements })}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Course Description"
                        value={course.description || ''}
                        onChange={(e) => handleLocalUpdate(course.id, { description: e.target.value })}
                        onBlur={() => handleSaveToDatabase(course.id, { description: course.description })}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Intro Video"
                        value={course.introVideo || ''}
                        onChange={(e) => handleLocalUpdate(course.id, { introVideo: e.target.value })}
                        onBlur={() => handleSaveToDatabase(course.id, { introVideo: course.introVideo })}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Divider style={{ margin: '20px 0' }} />
              <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  setSaving(true);
                  await handleSaveToDatabase(course.id, course);
                  setSaving(false);
                }}
              >
                {saving ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>

              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDeleteClick(course)}
                style={{ marginLeft: '10px' }}
              >
                Delete Course
              </Button>
            </AccordionDetails>
          </Accordion>
        ))
      )}

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {courseToDelete ? `Are you sure you want to delete the course "${courseToDelete.name}"?` : ''}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditCourses;