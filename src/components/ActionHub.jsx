// src/components/ActionHub.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, CardMedia, 
  TextField, Chip, Button, CircularProgress, Snackbar, IconButton,
  useTheme, useMediaQuery
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { motion, useAnimation } from 'framer-motion';
import axios from 'axios';
import { dummyNGOs } from '../utils/dummyData';
import { getRandomImage } from '../utils/helpers';

const ActionHub = () => {
  const [ngos, setNgos] = useState([...dummyNGOs]); // Initialize with dummy data
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ type: 'all', location: '' });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const controls = useAnimation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          'https://socio-99.onrender.com/api/action-hub',
          { timeout: 3000 } // Shorter timeout for faster fallback
        );
        
        // Merge API data with dummy data, removing duplicates
        const mergedData = [...new Map(
          [...dummyNGOs, ...(Array.isArray(data) ? data : [])]
            .map(item => [item.id, item])
        ).values()];

        setNgos(mergedData);
        setToast({ open: true, message: 'Updated with live data' });

      } catch (err) {
        console.error("Using guaranteed dummy data:", err);
        setToast({ open: true, message: 'Using guaranteed content' });
      } finally {
        setLoading(false);
        controls.start({ opacity: 1, y: 0 });
        // Ensure loading state clears even if API hangs
        setTimeout(() => setLoading(false), 3000);
      }
    };

    fetchData();
  }, [controls]);

  const filteredNgos = ngos.filter(ngo => {
    const searchMatch = ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.mission.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = filters.type === 'all' || ngo.type === filters.type;
    const locationMatch = filters.location ? 
      ngo.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
    return searchMatch && typeMatch && locationMatch;
  });

  return (
    <Box sx={{ p: 4, bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
          Action Hub
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          label="Search organizations"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            bgcolor: theme.palette.background.paper,
            maxWidth: 600,
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
          }}
        />
      </Box>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Chip
          label="All"
          onClick={() => setFilters(prev => ({ ...prev, type: 'all' }))}
          color={filters.type === 'all' ? 'success' : 'default'}
          sx={{ borderRadius: 2 }}
        />
        <Chip
          label="NGOs"
          onClick={() => setFilters(prev => ({ ...prev, type: 'NGO' }))}
          color={filters.type === 'NGO' ? 'success' : 'default'}
          sx={{ borderRadius: 2 }}
        />
        <TextField
          variant="outlined"
          label="Filter by location"
          value={filters.location}
          onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
          sx={{ width: 200, borderRadius: 2 }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress size={60} sx={{ color: theme.palette.success.main }} />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredNgos.map((ngo, index) => (
            <Grid item xs={12} sm={6} md={4} key={ngo.id || index}>
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
                    image={getRandomImage(ngo.id)}
                    alt={ngo.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                      {ngo.name}
                    </Typography>
                    <Chip 
                      label={ngo.type} 
                      color="success" 
                      size="small" 
                      sx={{ mb: 2, borderRadius: 2 }}
                    />
                    <Typography variant="body2" paragraph sx={{ minHeight: 80 }}>
                      {ngo.mission}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      📍 {ngo.location}
                    </Typography>
                    {ngo.website && (
                      <Button 
                        variant="outlined"
                        fullWidth
                        href={ngo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          mt: 1,
                          borderRadius: 2,
                          borderColor: theme.palette.success.main,
                          color: theme.palette.success.main,
                          '&:hover': {
                            backgroundColor: theme.palette.success.light + '15'
                          }
                        }}
                      >
                        Visit Website
                      </Button>
                    )}
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

export default ActionHub;