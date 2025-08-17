
import React from 'react';
import { ServiceRequest, RequestStatus, Role } from '../../../types/index';
import StatusBadge from '../../../components/ui/StatusBadge';
import { TECHNICIANS } from '../../../constants/index';
import Icon from '../../../components/ui/Icon';
import { useAuth } from '../../../contexts/AuthContext';
import { formatDate } from '../../../utils/formatters';
import { 
    Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Box, Avatar, Tooltip, IconButton, Button, Rating
} from '@mui/material';

interface RequestHistoryProps {
  requests: ServiceRequest[];
  onCancelRequest?: (requestId: string) => void;
  onViewInvoice?: (request: ServiceRequest) => void;
  onRateRequest?: (request: ServiceRequest) => void;
  onStartChat?: (request: ServiceRequest) => void;
  onViewMedia?: (request: ServiceRequest) => void;
}

const RequestHistory: React.FC<RequestHistoryProps> = ({ requests, onCancelRequest, onViewInvoice, onRateRequest, onStartChat, onViewMedia }) => {
  const { currentUser } = useAuth();
  const sortedRequests = [...requests].sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());

  const renderRating = (request: ServiceRequest) => {
      const isUser = currentUser?.role === Role.User;
      const ratingToShow = isUser ? request.userRating : request.technicianRating;
      if (!ratingToShow) return null;
      return <Rating value={ratingToShow.value} readOnly size="small" />;
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={3}>Service Request History</Typography>
      <TableContainer component={Paper} elevation={4}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Request</TableCell>
              <TableCell>Technician</TableCell>
              <TableCell>Scheduled For</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRequests.map((request) => {
              const technician = TECHNICIANS.find(t => t.id === request.assignedTechnicianId);
              const hasUserRated = !!request.userRating;
              const hasTechRated = !!request.technicianRating;

              return (
              <TableRow key={request.id} hover>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">{request.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{request.category}</Typography>
                  {renderRating(request)}
                </TableCell>
                <TableCell>
                  {technician ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={technician.avatarUrl} alt={technician.name} sx={{ width: 40, height: 40, mr: 1.5 }} />
                      <Box>
                        <Typography variant="body2" fontWeight="medium">{technician.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{technician.specialty}</Typography>
                      </Box>
                    </Box>
                  ) : <Typography variant="body2" color="text.secondary">Unassigned</Typography>}
                </TableCell>
                <TableCell>
                  {request.requestedTimeslot ? (
                      <Box>
                          <Typography variant="body2">{formatDate(request.requestedTimeslot.date)}</Typography>
                          <Typography variant="caption" color="text.secondary">{request.requestedTimeslot.time}</Typography>
                      </Box>
                  ) : <Typography variant="body2" color="text.secondary">N/A</Typography>}
                </TableCell>
                <TableCell><StatusBadge status={request.status} /></TableCell>
                <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                        {request.media?.length && onViewMedia && <Tooltip title="View Attachments"><IconButton onClick={() => onViewMedia(request)} size="small"><Icon name="paper-clip"/></IconButton></Tooltip>}
                        {(request.status === RequestStatus.Accepted || request.status === RequestStatus.InProgress) && onStartChat && <Tooltip title="Open Chat"><IconButton onClick={() => onStartChat(request)} size="small"><Icon name="chat-bubble-left-right"/></IconButton></Tooltip>}
                        {onCancelRequest && (request.status === RequestStatus.Pending || request.status === RequestStatus.Accepted) && <Button onClick={() => onCancelRequest(request.id)} color="error" size="small">Cancel</Button>}
                        {onViewInvoice && request.status === RequestStatus.AwaitingPayment && <Button onClick={() => onViewInvoice(request)} variant="contained" size="small">View & Pay</Button>}
                        {onRateRequest && request.status === RequestStatus.Paid && (
                          <>
                            {currentUser?.role === Role.User && !hasUserRated && <Button onClick={() => onRateRequest(request)} color="warning" size="small">Rate Tech</Button>}
                            {currentUser?.role === Role.Technician && !hasTechRated && <Button onClick={() => onRateRequest(request)} color="warning" size="small">Rate User</Button>}
                          </>
                        )}
                    </Box>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
        {requests.length === 0 && (
            <Typography sx={{ textAlign: 'center', p: 4 }} color="text.secondary">No service history found.</Typography>
        )}
      </TableContainer>
    </Box>
  );
};

export default RequestHistory;