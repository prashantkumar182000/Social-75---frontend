// src/components/ContentLibrary.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const ContentLibrary = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://socio-99.onrender.com/api/content',
          {
            timeout: 8000, // Increased from 3000ms
            withCredentials: false, // Changed from true
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }
        );

        console.log('RAW API RESPONSE:', response);
        setData(response.data);
        
      } catch (err) {
        console.error("FULL ERROR:", err);
        console.error("ERROR DETAILS:", {
          config: err.config,
          response: err.response,
          request: err.request
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3">Content Library Debug</Typography>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">API Response Structure:</Typography>
        <pre style={{ 
          background: '#1e1e1e',
          color: '#d4d4d4',
          padding: '1rem',
          borderRadius: '4px',
          maxHeight: '400px',
          overflow: 'auto'
        }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Window Location:</Typography>
        <div>{window.location.href}</div>
      </Box>
    </Box>
  );
};

export default ContentLibrary;