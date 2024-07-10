import React, { useState } from 'react';
import { learningDb } from '../../../utils/Firebase/learningFirebaseConfig'; // Adjust import as per your configuration
import { collection, addDoc } from 'firebase/firestore';
import { Button, TextField, Typography, CircularProgress, MenuItem } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCourse = () => {
  const [courseName, setCourseName] = useState('');
  const [courseThumbnail, setCourseThumbnail] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [chapters, setChapters] = useState([{ chapterName: '', topics: [{ topicName: '', videoLinks: [''] }] }]);
  const [loading, setLoading] = useState(false);

  const [regularPrice, setRegularPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [introVideo, setIntroVideo] = useState('');
  const [courseLevel, setCourseLevel] = useState('');
  const [whatYouLearn, setWhatYouLearn] = useState('');
  const [courseRequirements, setCourseRequirements] = useState('');

  const handleAddChapter = () => {
    setChapters([...chapters, { chapterName: '', topics: [{ topicName: '', videoLinks: [''] }] }]);
  };

  const handleAddTopic = (chapterIndex) => {
    const newChapters = [...chapters];
    newChapters[chapterIndex].topics.push({ topicName: '', videoLinks: [''] });
    setChapters(newChapters);
  };

  const handleCourseSubmit = async () => {
    try {
      setLoading(true);

      // Format courseRequirements into bullet points
      const formattedCourseRequirements = courseRequirements
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => `- ${line.trim()}`)
        .join('\n');

      const courseRef = await addDoc(collection(learningDb, 'courses'), {
        name: courseName,
        thumbnail: courseThumbnail,
        description: courseDescription,
        publishDate: publishDate,
        regularPrice: regularPrice,
        salePrice: salePrice,
        introVideo: introVideo,
        courseLevel: courseLevel,
        whatYouLearn: whatYouLearn,
        courseRequirements: formattedCourseRequirements,
        chapters: chapters,
      });

      console.log('Course added with ID: ', courseRef.id);
      toast.success('Course added successfully!');

      // Clear input fields and state after submission
      setCourseName('');
      setCourseThumbnail('');
      setCourseDescription('');
      setPublishDate('');
      setRegularPrice('');
      setSalePrice('');
      setIntroVideo('');
      setCourseLevel('');
      setWhatYouLearn('');
      setCourseRequirements('');
      setChapters([{ chapterName: '', topics: [{ topicName: '', videoLinks: [''] }] }]);
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Error adding course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChapterNameChange = (event, index) => {
    const newChapters = [...chapters];
    newChapters[index].chapterName = event.target.value;
    setChapters(newChapters);
  };

  const handleTopicNameChange = (event, chapterIndex, topicIndex) => {
    const newChapters = [...chapters];
    newChapters[chapterIndex].topics[topicIndex].topicName = event.target.value;
    setChapters(newChapters);
  };

  const handleVideoLinkChange = (event, chapterIndex, topicIndex, linkIndex) => {
    const newChapters = [...chapters];
    newChapters[chapterIndex].topics[topicIndex].videoLinks[linkIndex] = event.target.value;
    setChapters(newChapters);
  };

  const handleAddVideoLink = (chapterIndex, topicIndex) => {
    const newChapters = [...chapters];
    newChapters[chapterIndex].topics[topicIndex].videoLinks.push('');
    setChapters(newChapters);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Add Course
      </Typography>
      <TextField
        label="Course Name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
        style={{ marginBottom: '20px' }}
      />
      <TextField
        label="Course Thumbnail URL"
        value={courseThumbnail}
        onChange={(e) => setCourseThumbnail(e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
        style={{ marginBottom: '20px' }}
      />
      <TextField
        label="Description"
        value={courseDescription}
        onChange={(e) => setCourseDescription(e.target.value)}
        fullWidth
        multiline
        rows={4}
        margin="normal"
        variant="outlined"
        style={{ marginBottom: '20px' }}
      />
      <TextField
        label="Publish Course Date"
        type="date"
        value={publishDate}
        onChange={(e) => setPublishDate(e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        style={{ marginBottom: '20px' }}
      />
      <TextField
        label="Regular Price"
        type="number"
        value={regularPrice}
        onChange={(e) => setRegularPrice(e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
        style={{ marginBottom: '20px' }}
      />
      <TextField
        label="Sale Price"
        type="number"
        value={salePrice}
        onChange={(e) => setSalePrice(e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
        style={{ marginBottom: '20px' }}
      />
      <TextField
        label="Intro Video URL"
        value={introVideo}
        onChange={(e) => setIntroVideo(e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
        style={{ marginBottom: '20px' }}
      />
      <TextField
        select
        label="Course Level"
        value={courseLevel}
        onChange={(e) => setCourseLevel(e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
        style={{ marginBottom: '20px' }}
      >
        <MenuItem value="Beginner">Beginner</MenuItem>
        <MenuItem value="Intermediate">Intermediate</MenuItem>
        <MenuItem value="Advanced">Advanced</MenuItem>
      </TextField>
      <TextField
        label="What You Learn Description"
        value={whatYouLearn}
        onChange={(e) => setWhatYouLearn(e.target.value)}
        fullWidth
        multiline
        rows={4}
        margin="normal"
        variant="outlined"
        style={{ marginBottom: '20px' }}
      />
      <TextField
        label="Course Requirements Description"
        value={courseRequirements}
        onChange={(e) => setCourseRequirements(e.target.value)}
        fullWidth
        multiline
        rows={4}
        margin="normal"
        variant="outlined"
        style={{ marginBottom: '20px' }}
      />
      <Typography variant="h4" gutterBottom>
        Course Content
      </Typography>

      {chapters.map((chapter, chapterIndex) => (
        <div key={chapterIndex} style={{ marginBottom: '20px' }}>
          <TextField
            label={`Chapter ${chapterIndex + 1} Name`}
            value={chapter.chapterName}
            onChange={(e) => handleChapterNameChange(e, chapterIndex)}
            fullWidth
            margin="normal"
            variant="outlined"
            style={{ marginBottom: '10px' }}
          />
          {chapter.topics.map((topic, topicIndex) => (
            <div key={topicIndex} style={{ marginBottom: '10px' }}>
              <TextField
                label={`Topic ${topicIndex + 1} Name`}
                value={topic.topicName}
                onChange={(e) => handleTopicNameChange(e, chapterIndex, topicIndex)}
                margin="normal"
                variant="outlined"
                style={{ marginRight: '10px' }}
              />
              {topic.videoLinks.map((videoLink, linkIndex) => (
                <TextField
                  key={linkIndex}
                  label={`Video Link ${linkIndex + 1}`}
                  value={videoLink}
                  onChange={(e) => handleVideoLinkChange(e, chapterIndex, topicIndex, linkIndex)}
                  margin="normal"
                  variant="outlined"
                  style={{ marginRight: '10px' }}
                />
              ))}
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddVideoLink(chapterIndex, topicIndex)}
              >
                Add Video Link
              </Button>
            </div>
          ))}
          <Button variant="contained" color="primary" onClick={() => handleAddTopic(chapterIndex)}>
            Add Topic
          </Button>
        </div>
      ))}
      <Button variant="contained" color="primary" onClick={handleAddChapter}>
        Add Chapter
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCourseSubmit}
        style={{ marginLeft: '20px', position: 'relative' }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Submit Course'}
      </Button>
      <ToastContainer /> {/* React Toastify container */}
    </div>
  );
};

export default AddCourse;
