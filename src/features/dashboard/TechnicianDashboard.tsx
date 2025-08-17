

import React, { useState } from 'react';
import { ServiceRequest, Technician, User, RequestStatus } from '../../types/index';
import RequestList from '../service-requests/components/RequestList';
import { useAuth } from '../../contexts/AuthContext';
import { 
    Box, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, 
    DialogContentText, DialogActions, TextField, IconButton
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Icon from '../../components/ui/Icon';
import { Close } from '@mui/icons-material';

interface TechnicianDashboardProps {
  technician: Technician;
  requests: ServiceRequest[];
  user: User;
  onUpdateRequestStatus: (requestId: string, newStatus: RequestStatus, techId?: string) => void;
  onCancelRequest: (requestId: string, reason: string) => void;
  onSendInvoice: (requestId: string) => void;
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

const CancellationModal: React.FC<{
    open: boolean;
    request: ServiceRequest;
    onConfirm: (reason: string) => void;
    onClose: () => void;
}> = ({ open, request, onConfirm, onClose }) => {
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        if (!reason.trim()) {
            alert('Please provide a reason for cancellation.');
            return;
        }
        onConfirm(reason);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Cancel Request: {request.title}
                <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}><Close /></IconButton>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please provide a reason for cancelling this job. The customer will be notified.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="cancellationReason"
                    label="Reason for Cancellation"
                    type="text"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Go Back</Button>
                <Button onClick={handleConfirm} disabled={!reason.trim()} variant="contained" color="error">
                    Confirm Cancellation
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const AcceptJobModal: React.FC<{
    open: boolean;
    request: ServiceRequest;
    onConfirm: (phone: string) => void;
    onClose: () => void;
}> = ({ open, request, onConfirm, onClose }) => {
    const [phone, setPhone] = useState('');

    const handleConfirm = () => {
        if (!phone.trim() || phone.trim().length < 10) {
            alert('Please provide a valid contact phone number.');
            return;
        }
        onConfirm(phone);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Confirm Contact Info</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To accept this job for "{request.title}", please provide your contact number. The customer will see this information.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="technicianPhone"
                    label="Your Phone Number"
                    type="tel"
                    fullWidth
                    variant="outlined"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleConfirm} disabled={!phone.trim()} variant="contained" color="success">
                    Confirm & Accept Job
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({ technician, requests, user, onUpdateRequestStatus, onCancelRequest, onSendInvoice, onRateRequest, onStartChat, onViewMedia }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const [cancellingRequest, setCancellingRequest] = useState<ServiceRequest | null>(null);
  const [acceptingRequest, setAcceptingRequest] = useState<ServiceRequest | null>(null);

  const myJobs = requests.filter(r => r.assignedTechnicianId === technician.id && r.status !== RequestStatus.Cancelled && r.status !== RequestStatus.Paid);
  const jobQueue = requests.filter(r => r.status === RequestStatus.Pending && !r.assignedTechnicianId);
  const needsRating = requests.filter(r => r.assignedTechnicianId === technician.id && r.status === RequestStatus.Paid && !r.technicianRating);
  const completedAndPaidJobs = requests.filter(r => r.assignedTechnicianId === technician.id && r.status === RequestStatus.Paid);
  
  const handleConfirmCancellation = (reason: string) => {
    if (cancellingRequest) {
        onCancelRequest(cancellingRequest.id, reason);
        setCancellingRequest(null);
    }
  };

  const handleConfirmAcceptance = (phone: string) => {
    if (acceptingRequest && currentUser && updateUserProfile) {
      updateUserProfile(currentUser.id, { contactPhone: phone });
      onUpdateRequestStatus(acceptingRequest.id, RequestStatus.Accepted, technician.id);
      setAcceptingRequest(null);
      alert(`Contact info saved and job accepted! The customer has been notified and provided with your number: ${phone}.`);
    }
  };

  const handleAcceptClick = (request: ServiceRequest) => {
      if (!currentUser?.contactPhone) {
        setAcceptingRequest(request);
      } else {
        onUpdateRequestStatus(request.id, RequestStatus.Accepted, technician.id);
        alert(`Job accepted! The customer has been notified and provided with your contact info: ${currentUser.contactPhone}.`);
      }
  };
  
  const myJobActions = (request: ServiceRequest) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {request.status === RequestStatus.Accepted && <Button onClick={() => onUpdateRequestStatus(request.id, RequestStatus.InProgress)} size="small" variant="contained" color="info">Start Job</Button>}
        {request.status === RequestStatus.InProgress && <Button onClick={() => onUpdateRequestStatus(request.id, RequestStatus.Completed)} size="small" variant="contained" color="success">Complete Job</Button>}
        {request.status === RequestStatus.Completed && <Button onClick={() => onSendInvoice(request.id)} size="small" variant="contained" color="secondary">Send Invoice</Button>}
        {(request.status === RequestStatus.Accepted || request.status === RequestStatus.InProgress) && <IconButton onClick={() => setCancellingRequest(request)} size="small" color="error"><Icon name="x-circle" /></IconButton>}
        {request.status === RequestStatus.AwaitingPayment && <Typography variant="caption" color="text.secondary">Invoice Sent</Typography>}
    </Box>
  );
  
   const queueActions = (request: ServiceRequest) => <Button onClick={() => handleAcceptClick(request)} size="small" variant="contained" color="success">Accept</Button>;
   const ratingActions = (request: ServiceRequest) => <Button onClick={() => onRateRequest(request)} size="small" variant="contained" color="warning">Rate Customer</Button>;

  return (
    <>
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold">Technician Dashboard</Typography>
        <Typography color="text.secondary">Welcome, {user.name}. Ready to get to work?</Typography>
      </Box>

      <Grid container spacing={3} mt={2}>
        <Grid xs={12} sm={6} md={3}><StatCard title="Active Jobs" value={myJobs.length} icon="briefcase" color="info.main" /></Grid>
        <Grid xs={12} sm={6} md={3}><StatCard title="Jobs in Queue" value={jobQueue.length} icon="history" color="warning.main" /></Grid>
        <Grid xs={12} sm={6} md={3}><StatCard title="Total Paid Jobs" value={completedAndPaidJobs.length} icon="shield-check" color="success.main" /></Grid>
        <Grid xs={12} sm={6} md={3}><StatCard title="Your Rating" value={technician.rating.toFixed(1)} icon="star" color="text.secondary" /></Grid>
      </Grid>

      <Grid container spacing={4} mt={1}>
        <Grid xs={12} lg={6}>
          <RequestList title="My Active Jobs" requests={myJobs} renderActions={myJobActions} onStartChat={onStartChat} onViewMedia={onViewMedia} />
          {needsRating.length > 0 && (
            <Box mt={4}><RequestList title="Pending Customer Ratings" requests={needsRating} renderActions={ratingActions} /></Box>
          )}
        </Grid>
        <Grid xs={12} lg={6}>
          <RequestList title="Available Job Queue" requests={jobQueue} renderActions={queueActions} onViewMedia={onViewMedia} />
        </Grid>
      </Grid>
      
      {cancellingRequest && <CancellationModal open={!!cancellingRequest} request={cancellingRequest} onConfirm={handleConfirmCancellation} onClose={() => setCancellingRequest(null)} />}
      {acceptingRequest && <AcceptJobModal open={!!acceptingRequest} request={acceptingRequest} onConfirm={handleConfirmAcceptance} onClose={() => setAcceptingRequest(null)} />}
    </>
  );
};

export default TechnicianDashboard;
