import React, { useState, useEffect } from 'react';

import {
  EmojiEvents, Psychology, Favorite, Share,
  ArrowForward, CheckCircle, Topic, Groups
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { auth } from '../firebase';
import {
  Box, Typography, Button, Card, CardContent, LinearProgress,
  Chip, Avatar, Divider, IconButton, useTheme, useMediaQuery, Snackbar,
  CircularProgress // Add this import
} from '@mui/material';
import { useSelector } from 'react-redux';

const PassionFinder = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = useSelector(state => state.auth.user);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '' });

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get('https://socio-99.onrender.com/api/passion-questions');
        setQuestions(data);
      } catch (err) {
        setError('Failed to load questions');
        setToast({ open: true, message: 'Using fallback questions' });
      }
    };
    fetchQuestions();
  }, []);

  // AI-powered recommendation engine
  const calculatePassion = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('https://socio-99.onrender.com/api/analyze-passion', {
        userId: user?.uid,
        responses: selectedTags
      });
      setResult(data);
    } catch (err) {
      setError('AI analysis failed');
      setToast({ open: true, message: 'Using basic recommendations' });
      
      // Fallback: Simple tag frequency analysis
      const tagFrequency = selectedTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});

      const topPassion = Object.entries(tagFrequency)
        .sort((a, b) => b[1] - a[1])[0][0];

      const { data: fallback } = await axios.get(
        `https://socio-99.onrender.com/api/passion-data/${topPassion}`
      );
      setResult(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (tags) => {
    const newTags = [...selectedTags, ...tags];
    setSelectedTags(newTags);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculatePassion();
    }
  };

  const saveResults = async () => {
    try {
      const response = await axios.post('https://socio-99.onrender.com/api/save-passion', {
        userId: user?.uid,
        passionId: result?.id,
        tags: selectedTags
      }, {
        headers: {
          'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`
        }
      });
      
      console.log('Save response:', response.data); // Add this
      setToast({ open: true, message: 'Results saved successfully!' });
    } catch (err) {
      console.error('Save error:', err.response?.data || err.message); // Enhanced logging
      setToast({ 
        open: true, 
        message: err.response?.data?.message || 'Failed to save results' 
      });
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedTags([]);
    setResult(null);
  };

  if (questions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{
      p: isMobile ? 2 : 4,
      maxWidth: 800,
      mx: 'auto',
      minHeight: '100vh'
    }}>
      <Typography variant="h3" sx={{
        fontWeight: 800,
        mb: 4,
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center'
      }}>
        Passion Finder
      </Typography>

      {!result ? (
        <Card sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: 3,
          background: theme.palette.background.paper
        }}>
          <LinearProgress 
            variant="determinate" 
            value={(currentQuestion / questions.length) * 100} 
            sx={{ 
              height: 8, 
              borderRadius: 4, 
              mb: 3,
              background: theme.palette.action.disabledBackground,
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }
            }} 
          />

          <Typography variant="h5" sx={{ 
            fontWeight: 600, 
            mb: 4,
            textAlign: 'center'
          }}>
            {questions[currentQuestion]?.text}
          </Typography>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
            gap: 2 
          }}>
            {questions[currentQuestion]?.options.map((option, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  fullWidth
                  onClick={() => handleAnswer(option.tags)}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: theme.palette.action.hover,
                    '&:hover': {
                      bgcolor: theme.palette.action.selected
                    },
                    transition: 'all 0.3s ease',
                    height: '100%'
                  }}
                >
                  <Typography sx={{ 
                    fontWeight: 500,
                    color: theme.palette.text.primary
                  }}>
                    {option.text}
                  </Typography>
                </Button>
              </motion.div>
            ))}
          </Box>
        </Card>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{
              p: 4,
              borderRadius: 4,
              boxShadow: 3,
              background: theme.palette.background.paper
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ 
                  width: 60, 
                  height: 60, 
                  mr: 3,
                  bgcolor: theme.palette.primary.main 
                }}>
                  <EmojiEvents fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    {result.title}
                  </Typography>
                  <Typography sx={{ 
                    color: theme.palette.text.secondary,
                    mt: 1
                  }}>
                    {result.subtitle}
                  </Typography>
                </Box>
              </Box>

              <Typography sx={{ 
                fontSize: '1.1rem', 
                lineHeight: 1.6,
                mb: 4
              }}>
                {result.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Psychology sx={{ color: theme.palette.secondary.main }} />
                Recommended Learning
              </Typography>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                gap: 2,
                mb: 4
              }}>
                {result.resources.slice(0, 4).map((resource, i) => (
                  <Card key={i} sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: theme.palette.action.hover,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2
                    },
                    transition: 'all 0.3s ease'
                  }}>
                    <Chip 
                      label={resource.type} 
                      size="small" 
                      sx={{ 
                        mb: 1,
                        bgcolor: theme.palette.primary.dark,
                        color: '#fff'
                      }} 
                    />
                    <Typography sx={{ fontWeight: 500 }}>
                      {resource.title}
                    </Typography>
                    <Button 
                      size="small" 
                      endIcon={<ArrowForward />}
                      sx={{ mt: 1, px: 0 }}
                      href={resource.link}
                      target="_blank"
                    >
                      Explore
                    </Button>
                  </Card>
                ))}
              </Box>

              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Favorite sx={{ color: theme.palette.error.main }} />
                Action Plan
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                {result.actions.slice(0, 3).map((action, i) => (
                  <Box key={i} sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 1.5,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: theme.palette.action.selected
                  }}>
                    <CheckCircle sx={{ 
                      mr: 2, 
                      color: theme.palette.success.main 
                    }} />
                    <Typography>{action.text}</Typography>
                  </Box>
                ))}
              </Box>

              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Groups sx={{ color: theme.palette.info.main }} />
                Community Connections
              </Typography>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                gap: 2,
                mb: 4
              }}>
                <Button
                  variant="contained"
                  startIcon={<Topic />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: theme.palette.primary.main
                  }}
                  href={`/chat?topic=${encodeURIComponent(result.title)}`}
                >
                  Join Discussion
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Groups />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2
                  }}
                  href={`/map?filter=${result.category}`}
                >
                  Find Local Groups
                </Button>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
                mt: 4
              }}>
                <Button
                  variant="outlined"
                  onClick={restartQuiz}
                  sx={{
                    borderRadius: 2,
                    px: 4
                  }}
                >
                  Retake Quiz
                </Button>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton sx={{ 
                    bgcolor: theme.palette.action.hover,
                    borderRadius: 2
                  }}>
                    <Share />
                  </IconButton>
                  <Button
                    variant="contained"
                    onClick={saveResults}
                    disabled={!user}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                    }}
                  >
                    {user ? 'Save My Profile' : 'Login to Save'}
                  </Button>
                </Box>
              </Box>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
      />
    </Box>
  );
};

export default PassionFinder;