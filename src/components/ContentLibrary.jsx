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
  const [talks, setTalks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '' });
  const theme = useTheme();
  const controls = useAnimation();

  // Enhanced fetch function with retries
  const fetchContent = async (retries = 2) => {
    try {
      const { data } = await axios.get(
        'https://socio-99.onrender.com/api/content',
        {
          timeout: 8000, // Increased timeout
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-store'
          }
        }
      );

      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchContent(retries - 1);
      }
      throw err;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const apiTalks = await fetchContent();
        const mergedTalks = [...dummyTalks, ...apiTalks];
        
        setTalks(mergedTalks);
        setToast({ 
          open: true, 
          message: apiTalks.length ? 'Live content loaded' : 'Using cached content'
        });
      } catch (err) {
        console.error("Fallback to dummy data:", err);
        setTalks(dummyTalks);
        setToast({ open: true, message: 'Using guaranteed content' });
      } finally {
        setLoading(false);
        controls.start({ opacity: 1, y: 0 });
      }
    };

    loadData();
  }, [controls]);

  const filteredTalks = talks.filter(talk => 
    talk.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    talk.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
      {/* Search Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          Content Library
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          label="Search talks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ maxWidth: 600 }}
        />
      </Box>

      {/* Content Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredTalks.map((talk, index) => (
            <Grid item xs={12} sm={6} md={4} key={talk._id || index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                transition={{ delay: index * 0.05 }}
              >
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={getRandomImage(talk.id)}
                    alt={talk.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {talk.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {talk.description}
                    </Typography>
                    <Button 
                      variant="contained" 
                      href={talk.url} 
                      target="_blank"
                      fullWidth
                    >
                      Watch Now
                    </Button>
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
      />
    </Box>
  );
};

export default ContentLibrary;