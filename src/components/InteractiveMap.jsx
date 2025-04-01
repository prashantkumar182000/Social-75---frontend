import React, { useState, useEffect, useRef } from 'react';
import { 
  MapContainer, TileLayer, Marker, Popup, CircleMarker, Tooltip 
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { 
  Box, TextField, Button, Typography, Chip, CircularProgress, 
  Snackbar, IconButton, useTheme, Avatar, List, ListItem, 
  ListItemAvatar, ListItemText, Divider, Badge, Tabs, Tab
} from '@mui/material';
import { 
  LocationOn, AddLocation, MyLocation, Search, 
  Groups, Topic, FilterList, PersonAdd 
} from '@mui/icons-material';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { dummyMapUsers, interestClusters } from '../utils/dummyData';
import { getInterestColor, getCategoryColor } from '../utils/helpers';
import ConnectionsPanel from './ConnectionsPanel';

const createCustomIcon = (interest) => L.icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${getInterestColor(interest)}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const calculateSimilarity = (interest1, interest2) => {
  const words1 = new Set(interest1.toLowerCase().split(/[\s,]+/));
  const words2 = new Set(interest2.toLowerCase().split(/[\s,]+/));
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  return union.size > 0 ? intersection.size / union.size : 0;
};

const InteractiveMap = () => {
  const theme = useTheme();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [mapData, setMapData] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: 20.5937, lng: 78.9629 });
  const [interest, setInterest] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [similarUsers, setSimilarUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [connections, setConnections] = useState([]);
  const mapRef = useRef();

  // Updated dummy data fallback with working images
  const fallbackData = dummyMapUsers.map(item => ({
    ...item,
    avatar: item.avatar.includes('pravatar') 
      ? item.avatar.replace('pravatar', 'randomuser')
      : item.avatar
  }));

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
            },
            (err) => console.log('Location access denied:', err)
          );
        }

        // Fetch map data and connections
        const [mapRes, connectionsRes] = await Promise.all([
          axios.get('https://socio-99.onrender.com/api/map'),
          currentUser?.uid ? 
            axios.get(`https://socio-99.onrender.com/api/users/${currentUser.uid}/connections`) 
            : Promise.resolve({ data: [] })
        ]);

        setMapData(mapRes.data.length ? mapRes.data : fallbackData);
        setConnections(connectionsRes.data);
      } catch (err) {
        console.error("Using fallback data:", err);
        setMapData(fallbackData);
        setConnections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Handle connection requests
  const handleConnect = async (userId) => {
    try {
      const { data } = await axios.post('https://socio-99.onrender.com/api/connections', {
        userId: currentUser.uid,
        connectedUserId: userId
      });
      setConnections([...connections, data.connection]);
      setSuccess(`Connection request sent!`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send connection');
    }
  };

  const handleAccept = async (connectionId) => {
    try {
      const { data } = await axios.put(
        `https://socio-99.onrender.com/api/connections/${connectionId}`,
        { status: 'connected' }
      );
      setConnections(connections.map(c => 
        c._id === connectionId ? data.connection : c
      ));
      setSuccess("Connection accepted!");
    } catch (err) {
      setError('Failed to accept connection');
    }
  };

  const handleReject = async (connectionId) => {
    try {
      await axios.delete(`https://socio-99.onrender.com/api/connections/${connectionId}`);
      setConnections(connections.filter(c => c._id !== connectionId));
      setSuccess("Connection removed");
    } catch (err) {
      setError('Failed to reject connection');
    }
  };

  // Find similar users whenever interest changes
  useEffect(() => {
    if (interest.trim() && mapData.length) {
      const usersWithScores = mapData
        .map(user => ({
          ...user,
          similarity: calculateSimilarity(interest, user.interest)
        }))
        .filter(user => user.similarity > 0.3)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);

      setSimilarUsers(usersWithScores);
    } else {
      setSimilarUsers([]);
    }
  }, [interest, mapData]);

  // Filter map data based on search and category
  const filteredData = mapData.filter(user => {
    const matchesSearch = searchQuery ? 
      user.interest.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    const matchesCategory = category === 'all' || user.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleAddLocation = async () => {
    if (!interest.trim()) {
      setError('Please describe your interest');
      return;
    }

    const newUser = {
      location: userLocation,
      interest,
      category: category === 'all' ? 'general' : category,
      timestamp: new Date().toISOString(),
      avatar: currentUser?.photoURL || "https://randomuser.me/api/portraits/neutral.jpg"
    };

    try {
      const { data } = await axios.post('https://socio-99.onrender.com/api/map', newUser);
      setMapData([...mapData, data.data]);
      setInterest('');
      setSuccess('Your interest was added to the map!');
    } catch (err) {
      setError('Failed to add location. Using local data.');
      setMapData([...mapData, {
        ...newUser,
        id: Date.now().toString(),
        avatar: currentUser?.photoURL || newUser.avatar
      }]);
    }
  };

  // Fly to a specific location
  const flyToLocation = (lat, lng) => {
    mapRef.current?.flyTo([lat, lng], 15, {
      duration: 1.5
    });
  };

  // Cluster markers by topic
  const clusterMarkers = () => {
    return filteredData.map((user) => {
      const connectionStatus = connections.find(c => 
        (c.userId === currentUser?.uid && c.connectedUserId === user.id) ||
        (c.userId === user.id && c.connectedUserId === currentUser?.uid)
      )?.status;

      return (
        <Marker
          key={user.id || user._id}
          position={[user.location.lat, user.location.lng]}
          icon={createCustomIcon(user.interest)}
          eventHandlers={{
            click: () => {
              const similar = mapData
                .map(u => ({
                  ...u,
                  similarity: calculateSimilarity(user.interest, u.interest)
                }))
                .filter(u => u.similarity > 0.4 && u.id !== user.id)
                .slice(0, 3);
              setSimilarUsers(similar);
            }
          }}
        >
          <Popup>
            <Box sx={{ p: 1, minWidth: 200 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Avatar 
                  src={user.avatar} 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    border: currentUser?.uid && user.id === currentUser.uid ? 
                      `2px solid ${theme.palette.success.main}` : 'none' 
                  }} 
                />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user.interest}
                  {currentUser?.uid && user.id === currentUser.uid && (
                    <Chip label="You" size="small" sx={{ ml: 1 }} />
                  )}
                </Typography>
              </Box>
              <Chip 
                label={user.category.toUpperCase()}
                size="small"
                sx={{ 
                  backgroundColor: getCategoryColor(user.category),
                  color: 'white',
                  mb: 1
                }}
              />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {new Date(user.timestamp).toLocaleDateString()}
              </Typography>
              <Button 
                size="small" 
                startIcon={<PersonAdd />}
                sx={{ mt: 1 }}
                onClick={() => {
                  if (connectionStatus === 'pending') {
                    setSuccess('Connection request already pending');
                  } else if (connectionStatus === 'connected') {
                    setSuccess('You are already connected');
                  } else {
                    handleConnect(user.id);
                  }
                }}
                disabled={!!connectionStatus || user.id === currentUser?.uid}
              >
                {connectionStatus === 'pending' ? 'Request Sent' : 
                 connectionStatus === 'connected' ? 'Connected' : 'Connect'}
              </Button>
            </Box>
          </Popup>
        </Marker>
      );
    });
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: 'calc(100vh - 64px)',
      position: 'relative'
    }}>
      {/* Left Sidebar - Discover Panel */}
      <Box sx={{ 
        width: 350,
        p: 3,
        bgcolor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        overflowY: 'auto',
        display: { xs: 'none', md: 'block' }
      }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          🌍 Global Connections
        </Typography>
        
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Trending" icon={<Topic />} />
          <Tab label="Near You" icon={<Groups />} />
          <Tab 
            label="Connections" 
            icon={
              <Badge 
                badgeContent={connections.filter(c => c.status === 'pending').length} 
                color="error"
              >
                <PersonAdd />
              </Badge>
            }
          />
        </Tabs>

        {activeTab === 2 ? (
          <ConnectionsPanel
            connections={connections}
            currentUserId={currentUser?.uid}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        ) : activeTab === 0 ? (
          <>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Hot Topics Right Now
            </Typography>
            <List sx={{ mb: 3 }}>
              {interestClusters.map((cluster, index) => (
                <ListItem 
                  key={index}
                  button
                  onClick={() => {
                    setSearchQuery(cluster.name);
                    setCategory(cluster.category);
                  }}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getCategoryColor(cluster.category) }}>
                      {cluster.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={cluster.name}
                    secondary={`${cluster.count} active discussions`}
                  />
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              People Near You
            </Typography>
            {similarUsers.length > 0 ? (
              <List>
                {similarUsers.map((user, index) => (
                  <ListItem 
                    key={index}
                    button
                    onClick={() => flyToLocation(user.location.lat, user.location.lng)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <Box sx={{ 
                            bgcolor: getInterestColor(user.interest),
                            width: 12, 
                            height: 12,
                            borderRadius: '50%',
                            border: `2px solid ${theme.palette.background.paper}`
                          }} />
                        }
                      >
                        <Avatar src={user.avatar} />
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.interest}
                      secondary={`${Math.round(user.similarity * 100)}% match`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {interest ? 'No matches found' : 'Describe your interest to find matches'}
              </Typography>
            )}
          </>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Add Your Interest
        </Typography>
        <TextField
          fullWidth
          label="What's your cause?"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: <Search color="action" />
          }}
        />
        <TextField
          select
          fullWidth
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          SelectProps={{ native: true }}
          sx={{ mb: 2 }}
        >
          <option value="all">All Categories</option>
          <option value="environment">Environment</option>
          <option value="education">Education</option>
          <option value="social">Social Justice</option>
          <option value="health">Health</option>
          <option value="technology">Technology</option>
        </TextField>
        <Button
          fullWidth
          variant="contained"
          onClick={handleAddLocation}
          startIcon={<AddLocation />}
          disabled={!interest.trim()}
        >
          Join the Map
        </Button>
      </Box>

      {/* Main Map Area */}
      <Box sx={{ flex: 1, position: 'relative' }}>
        {/* Search Bar */}
        <Box sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1000,
          width: { xs: 'calc(100% - 32px)', md: 400 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          p: 2
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search interests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />
            }}
          />
        </Box>

        {/* Category Filter Chips */}
        <Box sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          display: 'flex',
          gap: 1,
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 1,
          boxShadow: 3
        }}>
          {['all', 'environment', 'education', 'social', 'health', 'technology'].map((cat) => (
            <Chip
              key={cat}
              label={cat === 'all' ? 'All' : cat}
              onClick={() => setCategory(cat)}
              color={category === cat ? 'primary' : 'default'}
              sx={{ textTransform: 'capitalize' }}
            />
          ))}
        </Box>

        {loading ? (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            bgcolor: 'background.default'
          }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            whenCreated={(map) => { mapRef.current = map }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Current User Location Marker */}
            <CircleMarker
              center={[userLocation.lat, userLocation.lng]}
              radius={8}
              color={theme.palette.primary.main}
              fillOpacity={1}
            >
              <Tooltip permanent>Your Location</Tooltip>
            </CircleMarker>

            {/* Cluster Group */}
            {clusterMarkers()}
          </MapContainer>
        )}
      </Box>

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        message={error}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess('')}
        message={success}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default InteractiveMap;