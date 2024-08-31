import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Alert,
    Snackbar,
    Card,
    CardContent,
    Avatar,
    TextField,
    Button
} from '@mui/material';
import { collection, doc, getDoc, getDocs, query, orderBy, onSnapshot, addDoc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore';
import { learningDb } from '../../utils/Firebase/learningFirebaseConfig';

const Comment = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState('');
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState('');
    const [comments, setComments] = useState([]);
    const [notification, setNotification] = useState(null);
    const [seenCourses, setSeenCourses] = useState(new Set());
    const [replyText, setReplyText] = useState('');
    const [replyingToCommentId, setReplyingToCommentId] = useState(null);
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editingReplyText, setEditingReplyText] = useState('');

    // Fetch initial data
    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const courseCommentsCollection = collection(learningDb, 'courseComments');
                const courseCommentsSnapshot = await getDocs(courseCommentsCollection);

                if (courseCommentsSnapshot.empty) {
                    setError('No documents found.');
                    return;
                }

                const coursesData = [];
                for (const docSnapshot of courseCommentsSnapshot.docs) {
                    const courseId = docSnapshot.id;
                    const courseDocRef = doc(learningDb, 'courses', courseId);
                    const courseDocSnapshot = await getDoc(courseDocRef);

                    if (courseDocSnapshot.exists()) {
                        const courseData = courseDocSnapshot.data();
                        coursesData.push({ id: courseId, ...courseData });
                    }
                }

                setCourses(coursesData);
            } catch (err) {
                setError('Failed to fetch document details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();

        // Set up periodic fetching
        const intervalId = setInterval(fetchCourseDetails, 60000); // Fetch every 60 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    // Fetch chapters when a course is selected
    useEffect(() => {
        const fetchChapters = async () => {
            if (selectedCourse) {
                try {
                    setLoading(true);

                    const chaptersCollection = collection(learningDb, 'courseComments', selectedCourse, 'chapters');
                    const chaptersSnapshot = await getDocs(chaptersCollection);

                    if (chaptersSnapshot.empty) {
                        setError(`No chapters found for course ID ${selectedCourse}.`);
                        return;
                    }

                    const chaptersData = chaptersSnapshot.docs.map(doc => ({
                        id: doc.id,
                        name: doc.id
                    }));
                    setChapters(chaptersData);
                } catch (err) {
                    setError('Failed to fetch chapters.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchChapters();
    }, [selectedCourse]);

    // Fetch topics when a chapter is selected
    useEffect(() => {
        const fetchTopics = async () => {
            if (selectedChapter) {
                try {
                    setLoading(true);

                    const topicsCollection = collection(learningDb, 'courseComments', selectedCourse, 'chapters', selectedChapter, 'topics');
                    const topicsSnapshot = await getDocs(topicsCollection);

                    if (topicsSnapshot.empty) {
                        setError(`No topics found for chapter ID ${selectedChapter}.`);
                        return;
                    }

                    const topicsData = topicsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        name: doc.id
                    }));
                    setTopics(topicsData);
                } catch (err) {
                    setError('Failed to fetch topics.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTopics();
    }, [selectedChapter]);

    // Fetch videos when a topic is selected
    useEffect(() => {
        const fetchVideos = async () => {
            if (selectedTopic) {
                try {
                    setLoading(true);

                    const videosCollection = collection(learningDb, 'courseComments', selectedCourse, 'chapters', selectedChapter, 'topics', selectedTopic, 'videos');
                    const videosSnapshot = await getDocs(videosCollection);

                    if (videosSnapshot.empty) {
                        setError(`No videos found for topic ID ${selectedTopic}.`);
                        return;
                    }

                    const videosData = videosSnapshot.docs.map(doc => ({
                        id: doc.id,
                        name: doc.id
                    }));
                    setVideos(videosData);
                } catch (err) {
                    setError('Failed to fetch videos.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchVideos();
    }, [selectedTopic]);

    // Fetch comments when a video is selected
    useEffect(() => {
        const fetchComments = async () => {
            if (selectedVideo) {
                try {
                    setLoading(true);

                    const commentsCollection = collection(learningDb, 'courseComments', selectedCourse, 'chapters', selectedChapter, 'topics', selectedTopic, 'videos', selectedVideo, 'comments');
                    const commentsQuery = query(commentsCollection, orderBy('createdAt', 'desc'));
                    const commentsSnapshot = await getDocs(commentsQuery);

                    if (commentsSnapshot.empty) {
                        setError(`No comments found for video ID ${selectedVideo}.`);
                        return;
                    }

                    const commentsData = [];
                    for (const docSnapshot of commentsSnapshot.docs) {
                        const commentId = docSnapshot.id;
                        const commentData = docSnapshot.data();

                        // Fetch replies
                        const repliesCollection = collection(learningDb, 'courseComments', selectedCourse, 'chapters', selectedChapter, 'topics', selectedTopic, 'videos', selectedVideo, 'comments', commentId, 'replies');
                        const repliesQuery = query(repliesCollection, orderBy('createdAt', 'desc'));
                        const repliesSnapshot = await getDocs(repliesQuery);
                        const repliesData = repliesSnapshot.docs.map(replyDoc => ({
                            id: replyDoc.id,
                            ...replyDoc.data()
                        }));

                        // Fetch likes count
                        const likesCollection = collection(learningDb, 'courseComments', selectedCourse, 'chapters', selectedChapter, 'topics', selectedTopic, 'videos', selectedVideo, 'comments', commentId, 'likes');
                        const likesSnapshot = await getDocs(likesCollection);
                        const likesCount = likesSnapshot.size;

                        commentsData.push({ id: commentId, ...commentData, replies: repliesData, likes: likesCount });
                    }

                    setComments(commentsData);
                } catch (err) {
                    setError('Failed to fetch comments.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchComments();
    }, [selectedVideo]);

    // Real-time updates for comments and replies
    useEffect(() => {
        if (selectedVideo) {
            const commentsCollection = collection(learningDb, 'courseComments', selectedCourse, 'chapters', selectedChapter, 'topics', selectedTopic, 'videos', selectedVideo, 'comments');
            const unsubscribeComments = onSnapshot(commentsCollection, async (snapshot) => {
                const commentsData = [];
                for (const docSnapshot of snapshot.docs) {
                    const commentId = docSnapshot.id;
                    const commentData = docSnapshot.data();

                    // Fetch replies
                    const repliesCollection = collection(learningDb, 'courseComments', selectedCourse, 'chapters', selectedChapter, 'topics', selectedTopic, 'videos', selectedVideo, 'comments', commentId, 'replies');
                    const repliesQuery = query(repliesCollection, orderBy('createdAt', 'desc'));
                    const repliesSnapshot = await getDocs(repliesQuery);
                    const repliesData = repliesSnapshot.docs.map(replyDoc => ({
                        id: replyDoc.id,
                        ...replyDoc.data()
                    }));

                    // Fetch likes count
                    const likesCollection = collection(learningDb, 'courseComments', selectedCourse, 'chapters', selectedChapter, 'topics', selectedTopic, 'videos', selectedVideo, 'comments', commentId, 'likes');
                    const likesSnapshot = await getDocs(likesCollection);
                    const likesCount = likesSnapshot.size;

                    commentsData.push({ id: commentId, ...commentData, replies: repliesData, likes: likesCount });
                }
                // Show new comments at the top
                commentsData.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
                setComments(commentsData);

                const newCommentCount = snapshot.docChanges().filter(change => change.type === 'added').length;
                if (newCommentCount > 0 && !seenCourses.has(selectedCourse)) {
                    setNotification({
                        message: `You have ${newCommentCount} new comments for the selected course.`,
                        severity: 'info'
                    });
                }
            });

            return () => unsubscribeComments(); // Cleanup listener on component unmount
        }
    }, [selectedVideo, selectedCourse]);

    const handleCloseNotification = () => {
        setNotification(null);
        setSeenCourses(prev => new Set(prev).add(selectedCourse));
    };

    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    };

    const handleReplySubmit = async () => {
        if (replyText.trim() && replyingToCommentId) {
            try {
                const replyData = {
                    text: `${replyText}`,
                    createdAt: Timestamp.now(),
                    edited: false,
                    profilePhoto: 'https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/divyansh-store%2Favtars%2Fundefined%20-%20Imgur.gif?alt=media&token=332f182e-4d23-4726-990a-70d7979af2a2',
                    userId: 'duggu-mgmt-PZ',
                    userName: 'duggu-Admin ⭐',
                    role: 'admin'
                };
                await addDoc(collection(learningDb, 'courseComments', selectedCourse, 'chapters', selectedChapter, 'topics', selectedTopic, 'videos', selectedVideo, 'comments', replyingToCommentId, 'replies'), replyData);
                setReplyText('');
                setReplyingToCommentId(null);
            } catch (err) {
                setError('Failed to add reply.');
            }
        }
    };

    const handleEditReplyChange = (e) => {
        setEditingReplyText(e.target.value);
    };

    const handleEditReplySubmit = async () => {
        if (editingReplyText.trim() && editingReplyId) {
            try {
                const replyDocRef = doc(learningDb, 'courseComments', selectedCourse, 'chapters', selectedChapter, 'topics', selectedTopic, 'videos', selectedVideo, 'comments', replyingToCommentId, 'replies', editingReplyId);
                await updateDoc(replyDocRef, { text: editingReplyText, edited: true });
                setEditingReplyText('');
                setEditingReplyId(null);
            } catch (err) {
                setError('Failed to edit reply.');
            }
        }
    };

    const handleDeleteReply = async (replyId) => {
        if (window.confirm('Are you sure you want to delete this reply?')) {
            try {
                const replyDocRef = doc(learningDb, 'courseComments', selectedCourse, 'chapters', selectedChapter, 'topics', selectedTopic, 'videos', selectedVideo, 'comments', replyingToCommentId, 'replies', replyId);
                await deleteDoc(replyDocRef);
            } catch (err) {
                setError('Failed to delete reply.');
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment and all its replies?')) {
            try {
                const commentDocRef = doc(learningDb, 'courseComments', selectedCourse, 'chapters', selectedChapter, 'topics', selectedTopic, 'videos', selectedVideo, 'comments', commentId);
                await deleteDoc(commentDocRef);
            } catch (err) {
                setError('Failed to delete comment.');
            }
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Course Comments
            </Typography>

            <Snackbar
                open={Boolean(notification)}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position notification at the top
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification?.severity || 'info'}
                    sx={{ width: '100%' }}
                >
                    {notification?.message}
                </Alert>
            </Snackbar>

            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}

            <Grid container spacing={2}>
                <Grid item xs={12} container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel>Select Course</InputLabel>
                            <Select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                disabled={loading || courses.length === 0}
                            >
                                {courses.map(course => (
                                    <MenuItem key={course.id} value={course.id}>
                                        {course.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {chapters.length > 0 && (
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel>Select Chapter</InputLabel>
                                <Select
                                    value={selectedChapter}
                                    onChange={(e) => setSelectedChapter(e.target.value)}
                                    disabled={loading || !selectedCourse}
                                >
                                    {chapters.map(chapter => (
                                        <MenuItem key={chapter.id} value={chapter.id}>
                                            {chapter.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}

                    {topics.length > 0 && (
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel>Select Topic</InputLabel>
                                <Select
                                    value={selectedTopic}
                                    onChange={(e) => setSelectedTopic(e.target.value)}
                                    disabled={loading || !selectedChapter}
                                >
                                    {topics.map(topic => (
                                        <MenuItem key={topic.id} value={topic.id}>
                                            {topic.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}

                    {videos.length > 0 && (
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel>Select Video</InputLabel>
                                <Select
                                    value={selectedVideo}
                                    onChange={(e) => setSelectedVideo(e.target.value)}
                                    disabled={loading || !selectedTopic}
                                >
                                    {videos.map(video => (
                                        <MenuItem key={video.id} value={video.id}>
                                            {video.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                </Grid>
            </Grid>

            <Grid item xs={12} sx={{ marginTop: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Comments
                </Typography>
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <Card key={comment.id} sx={{ marginBottom: 2 }}>
                            <CardContent>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item>
                                        <Avatar src={comment.profilePhoto || ''} />
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="subtitle1" component="div">
                                            {comment.userName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <span dangerouslySetInnerHTML={{ __html: comment.text }} />
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(comment.createdAt?.toDate()).toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Likes: {comment.likes || 0}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => {
                                                setReplyingToCommentId(comment.id);
                                                setReplyText('');
                                            }}
                                            sx={{ marginTop: 1 }}
                                        >
                                            Reply
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDeleteComment(comment.id)}
                                            sx={{ marginTop: 1 }}
                                        >
                                            Delete
                                        </Button>
                                    </Grid>
                                </Grid>
                                {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                                    <div style={{ marginTop: 16 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Replies
                                        </Typography>
                                        {comment.replies.map(reply => (
                                            <Card
                                                key={reply.id}
                                                sx={{
                                                    marginTop: 1,
                                                    backgroundColor: reply.role === 'admin' ? '#ffe0e0' : '#ffffe0'
                                                }}
                                            >
                                                <CardContent>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item>
                                                            <Avatar src={reply.profilePhoto || ''} />
                                                        </Grid>
                                                        <Grid item xs>
                                                            <Typography variant="body2" component="div">
                                                                {reply.userName}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                <span dangerouslySetInnerHTML={{ __html: reply.text }} />
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {new Date(reply.createdAt?.toDate()).toLocaleString()}
                                                            </Typography>
                                                            {editingReplyId === reply.id ? (
                                                                <div style={{ marginTop: 8 }}>
                                                                    <TextField
                                                                        label="Edit Reply"
                                                                        fullWidth
                                                                        variant="outlined"
                                                                        value={editingReplyText}
                                                                        onChange={handleEditReplyChange}
                                                                        margin="normal"
                                                                    />
                                                                    <Button
                                                                        variant="contained"
                                                                        color="secondary"
                                                                        onClick={handleEditReplySubmit}
                                                                        disabled={!editingReplyText.trim()}
                                                                        sx={{ marginTop: 1 }}
                                                                    >
                                                                        Save
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <Button
                                                                    variant="outlined"
                                                                    color="primary"
                                                                    onClick={() => {
                                                                        setEditingReplyId(reply.id);
                                                                        setEditingReplyText(reply.text);
                                                                    }}
                                                                    sx={{ marginTop: 1, marginRight: 1 }}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                onClick={() => handleDeleteReply(reply.id)}
                                                                sx={{ marginTop: 1 }}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                                {replyingToCommentId === comment.id && (
                                    <div style={{ marginTop: 16 }}>
                                        <TextField
                                            label="Reply"
                                            fullWidth
                                            variant="outlined"
                                            value={replyText}
                                            onChange={handleReplyChange}
                                            margin="normal"
                                        />
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleReplySubmit}
                                            disabled={!replyText.trim()}
                                        >
                                            Reply
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography>No comments available.</Typography>
                )}
            </Grid>
        </Container>
    );
};

export default Comment;
