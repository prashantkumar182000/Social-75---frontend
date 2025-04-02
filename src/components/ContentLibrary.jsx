// src/components/ContentLibrary.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, CardMedia, 
  TextField, Chip, Button, CircularProgress, Snackbar, IconButton,
  useTheme, useMediaQuery
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { motion, useAnimation } from 'framer-motion';
import axios from 'axios';
import { dummyTalks } from '../utils/dummyData';
import { getRandomImage } from '../utils/helpers';

const ContentLibrary = () => {
  const [talks, setTalks] = useState([...dummyTalks]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const controls = useAnimation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          'https://socio-99.onrender.com/api/content',
          {
            timeout: 3000,
            withCredentials: true,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('API Response:', data); // Debug log

        // Merge API data with dummy data
        const mergedData = [...new Map(
          [...dummyTalks, ...(Array.isArray(data) ? data : [])]
            .map(item => [item.id || Math.random(), item])
        ).values()];

        setTalks(mergedData);
        setToast({ 
          open: true, 
          message: data && data.length > 0 
            ? 'Updated with live content' 
            : 'Using guaranteed content' 
        });

      } catch (err) {
        console.error("Fetch error:", {
          message: err.message,
          response: err.response?.data,
          stack: err.stack
        });
        setToast({ 
          open: true, 
          message: 'Using guaranteed content' 
        });
      } finally {
        setLoading(false);
        controls.start({ opacity: 1, y: 0 });
      }
    };

    // Add cleanup function
    const abortController = new AbortController();
    fetchData();

    return () => abortController.abort();
  }, [controls]);

  const filteredTalks = talks.filter(talk => {
    const searchMatch = talk.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talk.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return searchMatch;
  });

  return (
    <Box sx={{ 
      p: 4, 
      bgcolor: theme.palette.background.default, 
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Debug overlay - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bgcolor: 'rgba(0,0,0,0.7)',
          color: 'white',
          p: 1,
          fontSize: '0.8rem',
          zIndex: 1000
        }}>
          API Status: {loading ? 'Loading...' : talks.length > dummyTalks.length ? 'Live' : 'Fallback'}
        </Box>
      )}

      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: 2 
      }}>
        <Typography variant="h3" sx={{ 
          fontWeight: 700, 
          color: theme.palette.primary.main 
        }}>
          Content Library
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          label="Search TED Talks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            bgcolor: theme.palette.background.paper,
            maxWidth: 600,
            '& .MuiOutlinedInput-root': { 
              borderRadius: 2,
            },
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          <CircularProgress 
            size={60} 
            sx={{ 
              color: theme.palette.primary.main,
            }} 
          />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredTalks.map((talk, index) => (
            <Grid item xs={12} sm={6} md={4} key={talk.id || index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={controls}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.5,
                  type: 'spring',
                  stiffness: 100
                }}
              >
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: '0.3s',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: 3,
                  '&:hover': { 
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={getRandomImage(talk.id)}
                    alt={talk.title || 'Talk image'}
                    sx={{ 
                      objectFit: 'cover',
                      backgroundColor: theme.palette.action.hover
                    }}
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/seed/${talk.id}/400/300`;
                    }}
                  />
                  <CardContent sx={{ 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 700,
                        minHeight: '3em'
                      }}
                    >
                      {talk.title || 'Untitled Talk'}
                    </Typography>
                    {talk.speaker && (
                      <Chip 
                        label={talk.speaker} 
                        color="primary" 
                        size="small" 
                        sx={{ 
                          mb: 2, 
                          borderRadius: 2,
                          alignSelf: 'flex-start'
                        }}
                      />
                    )}
                    <Typography 
                      variant="body2" 
                      paragraph 
                      sx={{ 
                        minHeight: 100,
                        flexGrow: 1
                      }}
                    >
                      {talk.description || 'No description available'}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mt: 'auto'
                    }}>
                      {talk.duration && (
                        <Chip 
                          label={`${Math.floor(talk.duration / 60)} mins`}
                          variant="outlined"
                          sx={{ borderRadius: 2 }}
                        />
                      )}
                      <Button 
                        variant="contained"
                        href={talk.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        disabled={!talk.url}
                        sx={{ 
                          borderRadius: 2,
                          px: 3,
                          bgcolor: theme.palette.primary.main,
                          '&:hover': { 
                            bgcolor: theme.palette.primary.dark 
                          },
                          '&:disabled': {
                            bgcolor: theme.palette.action.disabled
                          }
                        }}
                      >
                        {talk.url ? 'Watch Now' : 'Link Unavailable'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        message={toast.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setToast(prev => ({ ...prev, open: false }))}
          >
            <Close fontSize="small" />
          </IconButton>
        }
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.900'
          }
        }}
      />
    </Box>
  );
};

export default ContentLibrary;