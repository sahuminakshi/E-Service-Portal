

import React, { useState, ChangeEvent } from 'react';
import { User, Technician } from '../../types/index';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { 
    Box, Paper, Typography, Avatar, Button, TextField,
    List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Icon from '../../components/ui/Icon';

interface ProfilePageProps {
  user: User;
  technician?: Technician;
}

const InfoRow: React.FC<{ icon: string; label: string; value: React.ReactNode; }> = ({ icon, label, value }) => (
    <ListItem divider>
        <ListItemIcon sx={{ minWidth: 40 }}><Icon name={icon} sx={{ color: 'text.secondary' }}/></ListItemIcon>
        <ListItemText primary={label} secondary={value || <Typography variant="body2" color="text.disabled">Not provided</Typography>}
         primaryTypographyProps={{ color: 'text.secondary' }}
         secondaryTypographyProps={{ color: 'text.primary', fontWeight: 'medium' }}
        />
    </ListItem>
);

const ProfilePage: React.FC<ProfilePageProps> = ({ user, technician }) => {
  const { updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
      name: user.name,
      contactPhone: user.contactPhone || '',
      address: user.address || '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.name) {
        alert("Name cannot be empty.");
        return;
    }
    updateUserProfile(user.id, formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
      setFormData({
          name: user.name,
          contactPhone: user.contactPhone || '',
          address: user.address || '',
      });
      setIsEditing(false);
  };
  
  return (
    <Box>
        <Typography variant="h4" component="h1" fontWeight="bold">My Profile</Typography>
        <Typography color="text.secondary">View and manage your personal and account information.</Typography>
      
        <Grid container spacing={4} mt={2}>
            <Grid xs={12} md={4}>
                <Paper elevation={4} sx={{ p: 3, textAlign: 'center' }}>
                    <Avatar src={user.avatarUrl} alt={user.name} sx={{ width: 128, height: 128, mx: 'auto', mb: 2, border: '4px solid', borderColor: 'primary.main' }} />
                    <Typography variant="h5" fontWeight="bold">{isEditing ? formData.name : user.name}</Typography>
                    <Typography color="text.secondary">{user.email}</Typography>
                    <StatusBadge status={user.role as any} />
                </Paper>
            </Grid>
        
            <Grid xs={12} md={8}>
                <Paper elevation={4}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="h6" fontWeight="bold">Account Details</Typography>
                        {!isEditing && (
                            <Button variant="contained" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        )}
                    </Box>
                    
                    {isEditing ? (
                        <Box p={3} component="form" noValidate autoComplete="off">
                            <Grid container spacing={3}>
                                <Grid xs={12}><TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleInputChange} /></Grid>
                                <Grid xs={12}><TextField fullWidth label="Phone" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} /></Grid>
                                <Grid xs={12}><TextField fullWidth multiline rows={3} label="Address" name="address" value={formData.address} onChange={handleInputChange} /></Grid>
                            </Grid>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                                <Button onClick={handleCancel} variant="outlined">Cancel</Button>
                                <Button onClick={handleSave} variant="contained" color="success">Save Changes</Button>
                            </Box>
                        </Box>
                    ) : (
                        <List sx={{ p: 0 }}>
                            <InfoRow icon="user-circle" label="Full Name" value={user.name} />
                            <InfoRow icon="mail" label="Email" value={user.email} />
                            <InfoRow icon="phone" label="Phone" value={user.contactPhone} />
                            <InfoRow icon="map-pin" label="Address" value={user.address} />
                            <InfoRow icon="calendar" label="Member Since" value={new Date(user.registeredAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                        </List>
                    )}
                </Paper>

                {technician && (
                    <Paper elevation={4} sx={{ mt: 4 }}>
                         <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                            <Typography variant="h6" fontWeight="bold">Technician Details</Typography>
                        </Box>
                        <List sx={{ p: 0 }}>
                            <InfoRow icon="briefcase" label="Specialty" value={technician.specialty} />
                            <InfoRow icon="star" label="Rating" value={`${technician.rating.toFixed(1)} / 5.0`} />
                            <InfoRow icon="plus" label="Jobs Completed" value={technician.jobsCompleted} />
                            <InfoRow icon="bolt" label="Current Status" value={<StatusBadge status={technician.status} />} />
                        </List>
                    </Paper>
                )}
            </Grid>
        </Grid>
    </Box>
  );
};

export default ProfilePage;
