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
  const [talks, setTalks] = useState([...dummyTalks]); // Initialize with dummy data
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
          { timeout: 3000 }
        );
        
        // Merge API data with dummy data
        const mergedData = [...new Map(
          [...dummyTalks, ...(Array.isArray(data) ? data : [])]
            .map(item => [item.id, item])
        ).values()];

        setTalks(mergedData);
        setToast({ open: true, message: 'Updated with live content' });

      } catch (err) {
        console.error("Using guaranteed content:", err);
        setToast({ open: true, message: 'Using guaranteed content' });
      } finally {
        setLoading(false);
        controls.start({ opacity: 1, y: 0 });
        setTimeout(() => setLoading(false), 3000);
      }
    };

    fetchData();
  }, [controls]);

  const filteredTalks = talks.filter(talk => {
    const searchMatch = talk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talk.description.toLowerCase().includes(searchTerm.toLowerCase());
    return searchMatch;
  });

  return (
    <Box sx={{ p: 4, bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
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
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredTalks.map((talk, index) => (
            <Grid item xs={12} sm={6} md={4} key={talk.id || index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={controls}
                transition={{ delay: index * 0.1, duration: 0.5 }}
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
                    boxShadow: 6
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={getRandomImage(talk.id)}
                    alt={talk.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                      {talk.title}
                    </Typography>
                    <Chip 
                      label={talk.speaker} 
                      color="primary" 
                      size="small" 
                      sx={{ mb: 2, borderRadius: 2 }}
                    />
                    <Typography variant="body2" paragraph sx={{ minHeight: 100 }}>
                      {talk.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={`${Math.floor(talk.duration / 60)} mins`}
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                      <Button 
                        variant="contained"
                        href={talk.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          borderRadius: 2,
                          px: 3,
                          bgcolor: theme.palette.primary.main,
                          '&:hover': { bgcolor: theme.palette.primary.dark }
                        }}
                      >
                        Watch Now
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
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setToast(prev => ({ ...prev, open: false }))}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default ContentLibrary;