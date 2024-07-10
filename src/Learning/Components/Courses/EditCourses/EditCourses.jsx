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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(learningDb, 'courses'));
      const courseList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(courseList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const handleEditCourse = async (courseId, updatedCourse) => {
    try {
      const docRef = doc(learningDb, 'courses', courseId);
      await updateDoc(docRef, updatedCourse);
      fetchCourses();
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const docRef = doc(learningDb, 'courses', courseId);
      await deleteDoc(docRef);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleAddChapter = async (courseId) => {
    try {
      const updatedChapters = [
        ...(courses.find(course => course.id === courseId)?.chapters || []),
        { chapterName: newChapterName, topics: [] }
      ];
      const docRef = doc(learningDb, 'courses', courseId);
      await updateDoc(docRef, { chapters: updatedChapters });
      setNewChapterName('');
      fetchCourses();
    } catch (error) {
      console.error('Error adding chapter:', error);
    }
  };

  const handleAddTopic = async (courseId, chapterIndex) => {
    try {
      const updatedChapters = [...courses.find(course => course.id === courseId)?.chapters || []];
      updatedChapters[chapterIndex].topics.push({ topicName: newTopicName, videoLinks: [newVideoLink] });
      const docRef = doc(learningDb, 'courses', courseId);
      await updateDoc(docRef, { chapters: updatedChapters });
      setNewTopicName('');
      setNewVideoLink('');
      fetchCourses();
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  const handleEditChapterName = async (courseId, chapterIndex, newChapterName) => {
    try {
      const updatedChapters = [...courses.find(course => course.id === courseId)?.chapters || []];
      updatedChapters[chapterIndex].chapterName = newChapterName;
      const docRef = doc(learningDb, 'courses', courseId);
      await updateDoc(docRef, { chapters: updatedChapters });
      fetchCourses();
    } catch (error) {
      console.error('Error editing chapter name:', error);
    }
  };

  const handleEditTopicName = async (courseId, chapterIndex, topicIndex, newTopicName) => {
    try {
      const updatedChapters = [...courses.find(course => course.id === courseId)?.chapters || []];
      updatedChapters[chapterIndex].topics[topicIndex].topicName = newTopicName;
      const docRef = doc(learningDb, 'courses', courseId);
      await updateDoc(docRef, { chapters: updatedChapters });
      fetchCourses();
    } catch (error) {
      console.error('Error editing topic name:', error);
    }
  };

  const handleEditTopicVideoLink = async (courseId, chapterIndex, topicIndex, newVideoLink) => {
    try {
      const trimmedLink = newVideoLink.trim(); // Trim any leading/trailing whitespace
      if (trimmedLink) {
        const updatedChapters = [...courses.find(course => course.id === courseId)?.chapters || []];

        // Ensure topics array exists and initialize videoLinks if undefined
        if (!updatedChapters[chapterIndex]?.topics[topicIndex]?.videoLinks) {
          updatedChapters[chapterIndex].topics[topicIndex].videoLinks = [];
        }

        updatedChapters[chapterIndex].topics[topicIndex].videoLinks.push(trimmedLink); // Push trimmed link to array
        const docRef = doc(learningDb, 'courses', courseId);
        await updateDoc(docRef, { chapters: updatedChapters });
        fetchCourses();
      } else {
        console.warn('Empty video link provided.');
      }
    } catch (error) {
      console.error('Error editing topic video link:', error);
    }
  };

  const handleDeleteVideoLink = async (courseId, chapterIndex, topicIndex, linkIndex) => {
    try {
      const updatedChapters = [...courses.find(course => course.id === courseId)?.chapters || []];
      updatedChapters[chapterIndex].topics[topicIndex].videoLinks.splice(linkIndex, 1);
      const docRef = doc(learningDb, 'courses', courseId);
      await updateDoc(docRef, { chapters: updatedChapters });
      fetchCourses();
    } catch (error) {
      console.error('Error deleting video link:', error);
    }
  };

  const handleDeleteChapter = async (courseId, chapterIndex) => {
    try {
      const updatedCourses = [...courses];
      updatedCourses.find(course => course.id === courseId)?.chapters.splice(chapterIndex, 1);
      const docRef = doc(learningDb, 'courses', courseId);
      await updateDoc(docRef, { chapters: updatedCourses.find(course => course.id === courseId)?.chapters });
      fetchCourses();
    } catch (error) {
      console.error('Error deleting chapter:', error);
    }
  };

  const handleDeleteTopic = async (courseId, chapterIndex, topicIndex) => {
    try {
      const updatedCourses = [...courses];
      updatedCourses.find(course => course.id === courseId)?.chapters[chapterIndex]?.topics.splice(topicIndex, 1);
      const docRef = doc(learningDb, 'courses', courseId);
      await updateDoc(docRef, { chapters: updatedCourses.find(course => course.id === courseId)?.chapters });
      fetchCourses();
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const handleEditOtherContent = async (courseId, field, value) => {
    try {
      const updatedCourse = { [field]: value }; // Update the specific field
      const docRef = doc(learningDb, 'courses', courseId);
      await updateDoc(docRef, updatedCourse);
      fetchCourses();
    } catch (error) {
      console.error(`Error editing ${field}:`, error);
    }
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
              <div style={{ width: '100%' }}>
                <Typography variant="h6" gutterBottom>Chapters:</Typography>
                {course.chapters && course.chapters.map((chapter, chapterIndex) => (
                  <div key={chapterIndex} style={{ marginBottom: '10px', borderLeft: '2px solid #ccc', paddingLeft: '10px' }}>
                    <TextField
                      label="Chapter Name"
                      value={chapter.chapterName}
                      onChange={(e) => handleEditChapterName(course.id, chapterIndex, e.target.value)}
                      margin="normal"
                      variant="outlined"
                      style={{ marginRight: '10px' }}
                    />
                    <IconButton
                      color="secondary"
                      size="small"
                      onClick={() => handleDeleteChapter(course.id, chapterIndex)}
                      style={{ marginTop: '5px' }}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                    <Accordion style={{ marginTop: '10px' }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Topics:</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div style={{ width: '100%' }}>
                          {chapter.topics && chapter.topics.map((topic, topicIndex) => (
                            <div key={topicIndex} style={{ marginBottom: '10px', borderLeft: '2px solid #ccc', paddingLeft: '10px' }}>
                              <TextField
                                label="Topic Name"
                                value={topic.topicName}
                                onChange={(e) => handleEditTopicName(course.id, chapterIndex, topicIndex, e.target.value)}
                                margin="normal"
                                variant="outlined"
                                style={{ marginRight: '10px' }}
                              />
                              {topic.videoLinks && topic.videoLinks.map((videoLink, linkIndex) => (
                                <div key={linkIndex} style={{ marginBottom: '5px' }}>
                                  <TextField
                                    label={`Video Link ${linkIndex + 1}`}
                                    value={videoLink}
                                    onChange={(e) => handleEditTopicVideoLink(course.id, chapterIndex, topicIndex, e.target.value)}
                                    margin="normal"
                                    variant="outlined"
                                    style={{ marginRight: '10px' }}
                                  />
                                  <IconButton
                                    color="secondary"
                                    size="small"
                                    onClick={() => handleDeleteVideoLink(course.id, chapterIndex, topicIndex, linkIndex)}
                                    style={{ marginTop: '5px' }}
                                  >
                                    <DeleteIcon fontSize="inherit" />
                                  </IconButton>
                                </div>
                              ))}
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() => handleEditTopicVideoLink(course.id, chapterIndex, topicIndex, newVideoLink)}
                                style={{ marginTop: '5px' }}
                              >
                                Add Video Link
                              </Button>

                              <IconButton
                                color="secondary"
                                size="small"
                                onClick={() => handleDeleteTopic(course.id, chapterIndex, topicIndex)}
                                style={{ marginTop: '5px' }}
                              >
                                <DeleteIcon fontSize="inherit" />
                              </IconButton>
                            </div>
                          ))}
                          <TextField
                            label="New Topic Name"
                            value={newTopicName}
                            onChange={(e) => setNewTopicName(e.target.value)}
                            margin="normal"
                            variant="outlined"
                            style={{ marginRight: '10px' }}
                          />
                          <TextField
                            label="New Video Link"
                            value={newVideoLink}
                            onChange={(e) => setNewVideoLink(e.target.value)}
                            margin="normal"
                            variant="outlined"
                            style={{ marginRight: '10px' }}
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleAddTopic(course.id, chapterIndex)}
                            style={{ marginTop: '5px' }}
                          >
                            Add Topic
                          </Button>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                ))}
                <TextField
                  label="New Chapter Name"
                  value={newChapterName}
                  onChange={(e) => setNewChapterName(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  style={{ marginRight: '10px' }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleAddChapter(course.id)}
                  style={{ marginTop: '5px' }}
                >
                  Add Chapter
                </Button>
              </div>
            </AccordionDetails>
            <AccordionDetails>
              <div style={{ width: '100%' }}>
                <Typography variant="h6" gutterBottom>Other Content:</Typography>
                <TextField
                  label="Course Level"
                  value={course.courseLevel}
                  onChange={(e) => handleEditOtherContent(course.id, 'courseLevel', e.target.value)}
                  margin="normal"
                  variant="outlined"
                  style={{ marginRight: '10px', width: '100%' }}
                />
                <TextField
                  label="Course Requirements"
                  value={course.courseRequirements}
                  onChange={(e) => handleEditOtherContent(course.id, 'courseRequirements', e.target.value)}
                  margin="normal"
                  variant="outlined"
                  style={{ marginRight: '10px', width: '100%' }}
                />
                <TextField
                  label="Description"
                  value={course.description}
                  onChange={(e) => handleEditOtherContent(course.id, 'description', e.target.value)}
                  margin="normal"
                  variant="outlined"
                  style={{ marginRight: '10px', width: '100%' }}
                />
                <TextField
                  label="Intro Video"
                  value={course.introVideo}
                  onChange={(e) => handleEditOtherContent(course.id, 'introVideo', e.target.value)}
                  margin="normal"
                  variant="outlined"
                  style={{ marginRight: '10px', width: '100%' }}
                />
                <TextField
                  label="Regular Price"
                  value={course.regularPrice}
                  onChange={(e) => handleEditOtherContent(course.id, 'regularPrice', e.target.value)}
                  margin="normal"
                  variant="outlined"
                  style={{ marginRight: '10px', width: '100%' }}
                />
                <TextField
                  label="Sale Price"
                  value={course.salePrice}
                  onChange={(e) => handleEditOtherContent(course.id, 'salePrice', e.target.value)}
                  margin="normal"
                  variant="outlined"
                  style={{ marginRight: '10px', width: '100%' }}
                />
                <TextField
                  label="What You'll Learn"
                  value={course.whatYouLearn}
                  onChange={(e) => handleEditOtherContent(course.id, 'whatYouLearn', e.target.value)}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={4}
                  style={{ marginRight: '10px', width: '100%' }}
                />
              </div>
            </AccordionDetails>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDeleteCourse(course.id)}
              style={{ margin: '10px' }}
            >
              Delete Course
            </Button>
          </Accordion>
        ))
      )}
    </div>
  );
};

export default EditCourses;
