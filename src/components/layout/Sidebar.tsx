
import React from 'react';
import { ViewType, Role } from '../../types/index';
import Icon from '../ui/Icon';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

interface SidebarProps {
  activeView: ViewType;
  setView: (view: ViewType) => void;
  userRole: Role;
}

const NavItem: React.FC<{
  iconName: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ iconName, label, isActive, onClick }) => {
  return (
    <ListItem disablePadding sx={{ my: 0.5 }}>
      <ListItemButton
        onClick={onClick}
        selected={isActive}
        sx={{
          borderRadius: 2,
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            boxShadow: 3,
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          },
          '&:hover': {
            backgroundColor: 'action.hover'
          },
          '& .MuiListItemIcon-root': {
            color: isActive ? 'primary.contrastText' : 'inherit',
          },
        }}
      >
        <ListItemIcon>
          <Icon name={iconName} />
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, userRole }) => {

  const getNavItems = () => {
      const commonProfile = { id: 'profile', label: 'My Profile', icon: 'user-circle' };

      const userItems = [
          { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
          commonProfile,
          { id: 'new-request', label: 'New Request', icon: 'plus' },
          { id: 'history', label: 'My History', icon: 'history' },
          { id: 'technicians', label: 'Find Techs', icon: 'users' },
      ];
      
      const technicianItems = [
          { id: 'dashboard', label: 'Dashboard', icon: 'briefcase' },
          commonProfile,
          { id: 'history', label: 'Job History', icon: 'history' },
      ];

      const adminItems = [
          { id: 'dashboard', label: 'Analytics', icon: 'analytics' },
          commonProfile,
          { id: 'history', label: 'All Requests', icon: 'history' },
          { id: 'technicians', label: 'Manage Techs', icon: 'users' },
      ];

      switch(userRole) {
          case Role.Admin: return adminItems;
          case Role.Technician: return technicianItems;
          case Role.User:
          default:
              return userItems;
      }
  }

  const navItems = getNavItems();

  const drawerWidth = 256;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: 'none',
          // Glassmorphism effect applied via theme
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, height: 64, justifyContent: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <Icon name="shield-check" sx={{ color: 'primary.main', fontSize: 32 }}/>
        <Typography variant="h5" component="h1" sx={{ ml: 1.5, fontWeight: 'bold' }}>
          E-Service
        </Typography>
      </Box>
      <Box sx={{ p: 2, overflow: 'auto' }}>
        <List>
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              iconName={item.icon}
              label={item.label}
              isActive={activeView === item.id}
              onClick={() => setView(item.id as ViewType)}
            />
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;