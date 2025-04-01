import React from 'react';
import { 
  Box, Typography, List, ListItem, Avatar, 
  ListItemAvatar, ListItemText, Button, Divider, Chip 
} from '@mui/material';
import { PersonAdd, Check, Close } from '@mui/icons-material';

const ConnectionsPanel = ({ 
  connections, 
  currentUserId, 
  onAccept, 
  onReject, 
  onConnect 
}) => {
  const incomingRequests = connections.filter(
    c => c.connectedUserId === currentUserId && c.status === 'pending'
  );
  
  const outgoingRequests = connections.filter(
    c => c.userId === currentUserId && c.status === 'pending'
  );
  
  const establishedConnections = connections.filter(
    c => (c.userId === currentUserId || c.connectedUserId === currentUserId) && 
         c.status === 'connected'
  );

  return (
    <Box>
      {/* Incoming Requests */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        Connection Requests ({incomingRequests.length})
      </Typography>
      
      {incomingRequests.length > 0 ? (
        <List sx={{ mb: 3 }}>
          {incomingRequests.map((conn) => (
            <ListItem key={conn._id} sx={{ borderRadius: 2, mb: 1 }}>
              <ListItemAvatar>
                <Avatar src={conn.user?.photoURL} />
              </ListItemAvatar>
              <ListItemText
                primary={conn.user?.displayName || 'Anonymous'}
                secondary={`Wants to connect about ${conn.user?.interest}`}
              />
              <Button 
                size="small" 
                startIcon={<Check />}
                sx={{ mr: 1 }}
                onClick={() => onAccept(conn._id)}
              >
                Accept
              </Button>
              <Button 
                size="small" 
                startIcon={<Close />}
                onClick={() => onReject(conn._id)}
              >
                Reject
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          No pending requests
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Outgoing Requests */}
      {outgoingRequests.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Your Pending Requests ({outgoingRequests.length})
          </Typography>
          <List sx={{ mb: 3 }}>
            {outgoingRequests.map((conn) => (
              <ListItem key={conn._id} sx={{ borderRadius: 2, mb: 1 }}>
                <ListItemAvatar>
                  <Avatar src={conn.connectedUser?.photoURL} />
                </ListItemAvatar>
                <ListItemText
                  primary={conn.connectedUser?.displayName || 'Anonymous'}
                  secondary={`Request sent for ${conn.connectedUser?.interest}`}
                />
                <Chip 
                  label="Pending" 
                  size="small" 
                  color="warning"
                  variant="outlined"
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
        </>
      )}

      {/* Established Connections */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        Your Connections ({establishedConnections.length})
      </Typography>
      
      {establishedConnections.length > 0 ? (
        <List sx={{ mb: 3 }}>
          {establishedConnections.map((conn) => {
            const otherUser = conn.userId === currentUserId 
              ? conn.connectedUser 
              : conn.user;
            
            return (
              <ListItem key={conn._id} sx={{ borderRadius: 2, mb: 1 }}>
                <ListItemAvatar>
                  <Avatar src={otherUser?.photoURL} />
                </ListItemAvatar>
                <ListItemText
                  primary={otherUser?.displayName || 'Anonymous'}
                  secondary={`Connected about ${otherUser?.interest}`}
                />
                <Chip 
                  label="Connected" 
                  size="small" 
                  color="success"
                  variant="outlined"
                />
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          No connections yet
        </Typography>
      )}
    </Box>
  );
};

export default ConnectionsPanel;