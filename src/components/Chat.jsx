import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, TextField, Button, Avatar, Chip,
  List, ListItem, ListItemAvatar, ListItemText, Divider,
  IconButton, Menu, MenuItem, Tooltip, Badge,
  useTheme, useMediaQuery, CircularProgress
} from '@mui/material';
import { 
  Send, ExpandMore, Forum, 
  Groups, Lightbulb, Add, MoreVert, Close
} from '@mui/icons-material';
import { auth } from '../firebase';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Pusher from 'pusher-js';

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

  const [activeChannel, setActiveChannel] = useState(CHANNELS.GENERAL.id);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [pendingMessages, setPendingMessages] = useState(new Set());

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `https://socio-99.onrender.com/api/messages?channel=${activeChannel}`
        );
        setMessages(data);
      } catch (err) {
        console.error("Using fallback messages");
        setMessages([{
          _id: 'fallback',
          text: 'Welcome to the community chat!',
          user: { name: 'System', avatar: '' },
          timestamp: new Date().toISOString()
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const pusher = new Pusher('b499431d9b73ef39d7a6', {
      cluster: 'ap2',
      authEndpoint: 'https://socio-99.onrender.com/api/pusher/auth',
      auth: {
        headers: {
          'Authorization': `Bearer ${auth.currentUser?.getIdToken()}`
        }
      }
    });

    const channel = pusher.subscribe(`chat-${activeChannel}`);
    
    channel.bind('new-message', (message) => {
      setMessages(prev => {
        if (prev.some(m => m._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`chat-${activeChannel}`);
    };
  }, [activeChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
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
      replyTo: replyTo?._id || null
    };

    try {
      setPendingMessages(prev => new Set(prev).add(tempId));
      setMessages(prev => [...prev, { ...messageData, _id: tempId }]);
      setNewMessage('');
      setReplyTo(null);

      const { data } = await axios.post(
        'https://socio-99.onrender.com/api/messages',
        messageData
      );

      setMessages(prev => prev.map(msg => 
        msg._id === tempId ? data : msg
      ));
    } catch (err) {
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

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', bgcolor: theme.palette.background.default }}>
      {/* Channel Sidebar */}
      <Box sx={{ width: isMobile ? 70 : 200, borderRight: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.background.paper }}>
        <Typography variant="h6" sx={{ p: 2, textAlign: 'center', borderBottom: `1px solid ${theme.palette.divider}` }}>
          {isMobile ? 'Chat' : 'Channels'}
        </Typography>
        <List>
          {Object.values(CHANNELS).map(channel => (
            <ListItem 
              key={channel.id}
              button
              selected={activeChannel === channel.id}
              onClick={() => setActiveChannel(channel.id)}
              sx={{ px: isMobile ? 1 : 2, justifyContent: isMobile ? 'center' : 'flex-start' }}
            >
              <Tooltip title={channel.name} placement="right">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {channel.icon}
                  {!isMobile && channel.name}
                </Box>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Chat Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.background.paper }}>
          <Typography variant="h6">
            {CHANNELS[activeChannel.toUpperCase()]?.name || 'Chat'}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {messages.map(msg => (
                <React.Fragment key={msg._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar src={msg.user?.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography component="span" sx={{ fontWeight: 600, mr: 1 }}>
                            {msg.user?.name}
                          </Typography>
                          <Typography component="span" variant="caption">
                            {formatTime(msg.timestamp)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          {msg.replyTo && (
                            <Typography component="div" variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              Replying to: {messages.find(m => m._id === msg.replyTo)?.text || 'deleted message'}
                            </Typography>
                          )}
                          <Typography component="div" variant="body1">
                            {msg.text}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
              <div ref={messagesEndRef} />
            </List>
          )}
        </Box>

        <Box component="form" onSubmit={sendMessage} sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          {replyTo && (
            <Box sx={{ mb: 1, p: 1, bgcolor: theme.palette.action.selected, borderRadius: 1 }}>
              <Typography variant="body2">
                Replying to: {replyTo.user?.name} - {replyTo.text.slice(0, 30)}...
                <IconButton size="small" onClick={() => setReplyTo(null)} sx={{ float: 'right' }}>
                  <Close fontSize="small" />
                </IconButton>
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message in ${CHANNELS[activeChannel.toUpperCase()]?.name}`}
            />
            <Button type="submit" variant="contained" disabled={!newMessage.trim()}>
              <Send />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;