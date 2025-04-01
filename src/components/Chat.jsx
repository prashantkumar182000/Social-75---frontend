import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, TextField, Button, Avatar, Chip,
  List, ListItem, ListItemAvatar, ListItemText, Divider,
  IconButton, Menu, MenuItem, Tooltip,
  useTheme, useMediaQuery, CircularProgress, Badge
} from '@mui/material';
import { 
  Send, ExpandMore, Forum, 
  Groups, Lightbulb, Add, MoreVert, Close
} from '@mui/icons-material';
import { auth } from '../firebase';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Pusher from 'pusher-js';

// Channel types
const CHANNELS = {
  GENERAL: { id: 'general', name: 'General', icon: <Forum /> },
  CLIMATE: { id: 'climate', name: 'Climate Action', icon: <Groups /> },
  EDUCATION: { id: 'education', name: 'Education', icon: <Groups /> },
  IDEAS: { id: 'ideas', name: 'Idea Hub', icon: <Lightbulb /> }
};

const Chat = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = useSelector(state => state.auth.user);
  const messagesEndRef = useRef(null);
  const [pendingMessages, setPendingMessages] = useState(new Set());

  // State
  const [activeChannel, setActiveChannel] = useState(CHANNELS.GENERAL.id);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  // Format timestamp consistently
  const formatTime = (timestamp) => {
    try {
      const date = timestamp ? new Date(timestamp) : new Date();
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  // Fetch messages for current channel
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `https://socio-99.onrender.com/api/messages?channel=${activeChannel}`
        );
        
        const sanitizedMessages = data.map(msg => ({
          ...msg,
          _id: msg._id || `temp_${Date.now()}`,
          timestamp: msg.timestamp || new Date().toISOString(),
          user: {
            uid: msg.user?.uid || user?.uid || 'unknown',
            name: msg.user?.name || user?.displayName || 'Anonymous',
            avatar: msg.user?.avatar || user?.photoURL || ''
          }
        }));

        setMessages(sanitizedMessages);
      } catch (err) {
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Pusher for real-time updates
    const pusher = new Pusher('b499431d9b73ef39d7a6', {
      cluster: 'ap2',
      encrypted: true
    });

    const channel = pusher.subscribe(`chat-${activeChannel}`);
    
    const messageHandler = (message) => {
      setMessages(prev => {
        // Skip if message is pending or already exists
        if (pendingMessages.has(message._id) || prev.some(m => m._id === message._id)) {
          return prev;
        }

        const sanitizedMessage = {
          ...message,
          _id: message._id || `server_${Date.now()}`,
          timestamp: message.timestamp || new Date().toISOString(),
          user: {
            uid: message.user?.uid || 'unknown',
            name: message.user?.name || 'Anonymous',
            avatar: message.user?.avatar || ''
          }
        };

        return [...prev, sanitizedMessage];
      });
    };

    channel.bind('new-message', messageHandler);

    return () => {
      channel.unbind('new-message', messageHandler);
      pusher.unsubscribe(`chat-${activeChannel}`);
    };
  }, [activeChannel, user, pendingMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const tempId = `temp_${Date.now()}`;
    const messageData = {
      text: newMessage,
      channel: activeChannel,
      user: {
        uid: user.uid,
        name: user.displayName || user.email.split('@')[0],
        avatar: user.photoURL || ''
      },
      replyTo: replyTo?._id || null,
      timestamp: new Date().toISOString(),
      _id: tempId // Temporary ID for optimistic update
    };

    try {
      // Optimistic update
      setPendingMessages(prev => new Set(prev).add(tempId));
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
      setReplyTo(null);

      // Send to server
      const { data } = await axios.post(
        'https://socio-99.onrender.com/api/send-message',
        messageData
      );

      // Update with server response
      setMessages(prev => prev.map(msg => 
        msg._id === tempId ? { ...msg, _id: data._id } : msg
      ));
    } catch (err) {
      // Rollback on error
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
      setError('Failed to send message');
    } finally {
      setPendingMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(tempId);
        return newSet;
      });
    }
  };

  // Handle Enter key press (but allow Shift+Enter for new lines)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: 'calc(100vh - 64px)',
      bgcolor: theme.palette.background.default
    }}>
      {/* Channel Sidebar */}
      <Box sx={{ 
        width: isMobile ? 70 : 200,
        borderRight: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography variant="h6" sx={{ 
          p: 2, 
          textAlign: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          {isMobile ? 'Chat' : 'Channels'}
        </Typography>

        <List sx={{ flex: 1, overflowY: 'auto' }}>
          {Object.values(CHANNELS).map(channel => (
            <ListItem 
              key={channel.id}
              selected={activeChannel === channel.id}
              onClick={() => setActiveChannel(channel.id)}
              sx={{
                px: isMobile ? 1 : 2,
                justifyContent: isMobile ? 'center' : 'flex-start',
                '&.Mui-selected': {
                  bgcolor: theme.palette.action.selected
                }
              }}
            >
              <Tooltip title={channel.name} placement="right" arrow>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: isMobile ? 0 : 1
                }}>
                  <Badge 
                    color="primary" 
                    invisible={channel.id !== 'ideas'}
                    badgeContent="New"
                  >
                    {channel.icon}
                  </Badge>
                  {!isMobile && (
                    <Typography sx={{ ml: 1 }}>
                      {channel.name}
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            </ListItem>
          ))}
        </List>

        {!isMobile && (
          <Button 
            startIcon={<Add />}
            sx={{ m: 1, borderRadius: 2 }}
          >
            New Topic
          </Button>
        )}
      </Box>

      {/* Main Chat Area */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Channel Header */}
        <Box sx={{ 
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {CHANNELS[activeChannel.toUpperCase()]?.name || 'Chat'}
          </Typography>
          <Chip 
            label={activeChannel === 'ideas' ? 'Brainstorming' : 'Discussion'} 
            size="small" 
            sx={{ ml: 2 }}
          />
          <Box sx={{ flex: 1 }} />
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem>Channel Info</MenuItem>
            <MenuItem>Mute Notifications</MenuItem>
          </Menu>
        </Box>

        {/* Messages */}
        <Box sx={{ 
          flex: 1,
          overflowY: 'auto',
          p: 2,
          bgcolor: theme.palette.background.default
        }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              pt: 4 
            }}>
              <CircularProgress />
            </Box>
          ) : messages.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              pt: 4,
              color: theme.palette.text.secondary
            }}>
              <Typography variant="h6">
                No messages yet
              </Typography>
              <Typography>
                Be the first to start the conversation!
              </Typography>
            </Box>
          ) : (
            <List>
              {messages.map((msg) => (
                <React.Fragment key={msg._id}>
                  {/* Main Message */}
                  <ListItem 
                    alignItems="flex-start"
                    sx={{ 
                      px: 1,
                      '&:hover': {
                        bgcolor: theme.palette.action.hover
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        src={msg.user?.avatar} 
                        alt={msg.user?.name} 
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography 
                            sx={{ 
                              fontWeight: 600,
                              mr: 1 
                            }}
                          >
                            {msg.user?.name || 'Anonymous'}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: theme.palette.text.secondary 
                            }}
                          >
                            {formatTime(msg.timestamp)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          {msg.replyTo && (
                            <Box sx={{ 
                              pl: 2,
                              mb: 1,
                              borderLeft: `3px solid ${theme.palette.divider}`,
                              color: theme.palette.text.secondary
                            }}>
                              <Typography variant="body2" fontStyle="italic">
                                Replying to: {messages.find(m => m._id === msg.replyTo)?.text || 'deleted message'}
                              </Typography>
                            </Box>
                          )}
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              wordBreak: 'break-word',
                              whiteSpace: 'pre-wrap'
                            }}
                          >
                            {msg.text}
                          </Typography>
                        </Box>
                      }
                    />
                    <IconButton 
                      size="small" 
                      onClick={() => setReplyTo(msg)}
                    >
                      <ExpandMore />
                    </IconButton>
                  </ListItem>

                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
              <div ref={messagesEndRef} />
            </List>
          )}
        </Box>

        {/* Message Input */}
        <Box 
          component="form" 
          onSubmit={sendMessage}
          sx={{ 
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper
          }}
        >
          {replyTo && (
            <Box sx={{ 
              mb: 1,
              p: 1,
              bgcolor: theme.palette.action.selected,
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <Typography variant="body2">
                Replying to <strong>{replyTo.user?.name || 'Anonymous'}</strong>: {replyTo.text.slice(0, 30)}...
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => setReplyTo(null)}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                activeChannel === 'ideas' 
                  ? 'Share your brilliant idea...' 
                  : `Message in ${CHANNELS[activeChannel.toUpperCase()]?.name}`
              }
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4
                }
              }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              sx={{ 
                borderRadius: 4,
                minWidth: 40,
                height: 40,
                alignSelf: 'flex-end'
              }}
            >
              <Send />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;