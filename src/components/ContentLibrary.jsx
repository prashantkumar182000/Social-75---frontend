import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  TextField, 
  Chip, 
  Button, 
  CircularProgress,
  Snackbar,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { motion, useAnimation } from 'framer-motion';
import { getTalks } from '../utils/apiHelpers';

const ContentLibrary = () => {
  const [talks, setTalks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const controls = useAnimation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getTalks();
        setTalks(data);
        controls.start({ opacity: 1, y: 0 });
        
        if (data === dummyTalks) {
          setToast({
            open: true,
            message: 'Using sample data - API might be unavailable'
          });
        }
      } catch (error) {
        setToast({
          open: true,
          message: 'Failed to load content. Please try again later.'
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [controls]);

  const filteredTalks = talks.filter(talk => 
    talk.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
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
            <Grid item xs={12} sm={6} md={4} key={`talk-${talk.id}-${index}`}>
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
                  borderRadius: 2,
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
                    image={talk.image || `https://picsum.photos/id/${Math.abs(talk.id)}/400/300`}
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
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body2" paragraph sx={{ minHeight: 80 }}>
                      {talk.description || 'No description available.'}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mb: 2 }}>
                      🕒 {Math.floor(talk.duration / 60)} mins
                    </Typography>
                    <Button 
                      variant="contained" 
                      href={talk.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ 
                        bgcolor: theme.palette.primary.main,
                        '&:hover': { bgcolor: theme.palette.primary.dark }
                      }}
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
        autoHideDuration={6000}
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