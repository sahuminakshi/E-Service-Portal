

import React from 'react';
import { ServiceRequest, Technician, User, RequestStatus, ViewType } from '../../types/index';
import RequestList from '../service-requests/components/RequestList';
import TechnicianList from '../technicians/components/TechnicianList';
import { Paper, Typography, Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import Icon from '../../components/ui/Icon';

interface UserDashboardProps {
  requests: ServiceRequest[];
  technicians: Technician[];
  user: User;
  setView: (view: ViewType) => void;
  onCancelRequest: (requestId: string) => void;
  onViewInvoice: (request: ServiceRequest) => void;
  onRateRequest: (request: ServiceRequest) => void;
  onStartChat: (request: ServiceRequest) => void;
  onViewMedia: (request: ServiceRequest) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string; }> = ({ title, value, icon, color }) => (
    <Paper elevation={4} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: color, color: 'common.white', display: 'flex' }}>
            <Icon name={icon} />
        </Box>
        <Box ml={2}>
            <Typography color="text.secondary" variant="body2">{title}</Typography>
            <Typography variant="h5" fontWeight="bold">{value}</Typography>
        </Box>
    </Paper>
);

const UserDashboard: React.FC<UserDashboardProps> = ({ requests, technicians, user, setView, onCancelRequest, onViewInvoice, onRateRequest, onStartChat, onViewMedia }) => {
  const activeRequests = requests.filter(r => r.status !== RequestStatus.Paid && r.status !== RequestStatus.Cancelled);
  const paidRequests = requests.filter(r => r.status === RequestStatus.Paid);
  const availableTechnicians = technicians.filter(t => t.status === 'Available');
  
  const userActions = (request: ServiceRequest) => {
    if (request.status === RequestStatus.Pending || request.status === RequestStatus.Accepted) {
      return <Button onClick={() => onCancelRequest(request.id)} size="small" variant="outlined" color="error">Cancel</Button>;
    }
    if (request.status === RequestStatus.AwaitingPayment) {
        return <Button onClick={() => onViewInvoice(request)} size="small" variant="contained" color="primary">View & Pay</Button>;
    }
    if (request.status === RequestStatus.Paid && !request.userRating) {
        return <Button onClick={() => onRateRequest(request)} size="small" variant="contained" color="warning">Rate Service</Button>;
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold">Welcome back, {user.name.split(' ')[0]}!</Typography>
      <Typography color="text.secondary">Here's a summary of your service portal activity.</Typography>

      <Grid container spacing={3} mt={2}>
        <Grid xs={12} sm={6} lg={3}>
            <StatCard title="Active Requests" value={activeRequests.length} icon="history" color="warning.main" />
        </Grid>
        <Grid xs={12} sm={6} lg={3}>
            <StatCard title="Completed & Paid" value={paidRequests.length} icon="shield-check" color="success.main" />
        </Grid>
        <Grid xs={12} sm={6} lg={3}>
            <StatCard title="Available Technicians" value={availableTechnicians.length} icon="users" color="info.main" />
        </Grid>
        <Grid xs={12} sm={6} lg={3}>
             <Paper 
                elevation={4} 
                sx={{ 
                    p: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': {
                        bgcolor: 'action.hover'
                    }
                }}
                onClick={() => setView('new-request')}
            >
                <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: 'primary.main', color: 'common.white', display: 'flex', mb: 1 }}>
                    <Icon name="plus" />
                </Box>
                <Typography variant="subtitle1" fontWeight="bold" color="primary">Create New Request</Typography>
            </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4} mt={1}>
        <Grid xs={12} lg={8}>
            <RequestList title="Your Active Services" requests={activeRequests} renderActions={userActions} onStartChat={onStartChat} onViewMedia={onViewMedia} />
        </Grid>
        <Grid xs={12} lg={4}>
            <TechnicianList title="Available Technicians" technicians={availableTechnicians} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard;
