
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Tooltip } from '@mui/material';
import { Notifications, Logout } from '@mui/icons-material';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  
  if (!currentUser) return null;

  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ 
        backgroundColor: 'transparent',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Notifications">
            <IconButton color="primary">
              <Notifications />
            </IconButton>
          </Tooltip>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar src={currentUser.avatarUrl} alt={currentUser.name} sx={{ width: 40, height: 40 }}/>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {currentUser.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                {currentUser.role} View
              </Typography>
            </Box>
            <Tooltip title="Logout">
              <IconButton onClick={logout} color="primary" aria-label="Logout">
                  <Logout />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;