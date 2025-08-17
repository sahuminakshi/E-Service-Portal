
import React from 'react';
import { ServiceRequest, RequestStatus } from '../../../types/index';
import StatusBadge from '../../../components/ui/StatusBadge';
import {TECHNICIANS, ALL_USERS} from '../../../constants/index';
import Icon from '../../../components/ui/Icon';
import { formatShortDate, formatCurrency } from '../../../utils/formatters';
import { 
    Paper, Typography, Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, 
    Divider, IconButton, Tooltip
} from '@mui/material';

interface RequestListProps {
  title: string;
  requests: ServiceRequest[];
  renderActions?: (request: ServiceRequest) => React.ReactNode;
  onStartChat?: (request: ServiceRequest) => void;
  onViewMedia?: (request: ServiceRequest) => void;
}

const RequestItem: React.FC<{ 
    request: ServiceRequest, 
    renderActions?: (request: ServiceRequest) => React.ReactNode,
    onStartChat?: (request: ServiceRequest) => void;
    onViewMedia?: (request: ServiceRequest) => void;
}> = ({ request, renderActions, onStartChat, onViewMedia }) => {
    const technician = TECHNICIANS.find(t => t.id === request.assignedTechnicianId);
    const customer = ALL_USERS.find(u => u.id === request.userId);

    return (
    <ListItem alignItems="flex-start" secondaryAction={
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
        <StatusBadge status={request.status} />
        {renderActions && renderActions(request)}
        <Box>
            {request.media?.length && onViewMedia && <Tooltip title="View Attachments"><IconButton size="small" onClick={() => onViewMedia(request)}><Icon name="paper-clip"/></IconButton></Tooltip>}
            {(request.status === RequestStatus.Accepted || request.status === RequestStatus.InProgress) && onStartChat && <Tooltip title="Open Chat"><IconButton size="small" onClick={() => onStartChat(request)}><Icon name="chat-bubble-left-right"/></IconButton></Tooltip>}
        </Box>
      </Box>
    }>
        <ListItemAvatar>
            <Avatar src={technician?.avatarUrl || customer?.avatarUrl} alt={technician?.name || customer?.name} />
        </ListItemAvatar>
        <ListItemText
            primary={request.title}
            secondary={
                <>
                    <Typography component="span" variant="body2" color="text.primary">{request.category}</Typography>
                    {` — Scheduled for ${formatShortDate(request.requestedTimeslot?.date || '')} at ${request.requestedTimeslot?.time}`}
                    {request.status === RequestStatus.AwaitingPayment && request.invoice && (
                        <Typography component="p" variant="caption" color="primary" fontWeight="bold">
                            Amount Due: {formatCurrency(request.invoice.total)}
                        </Typography>
                    )}
                </>
            }
        />
    </ListItem>
)};


const RequestList: React.FC<RequestListProps> = ({ title, requests, renderActions, onStartChat, onViewMedia }) => {
  return (
    <Paper elevation={4}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold">{title}</Typography>
      </Box>
      {requests.length > 0 ? (
        <List sx={{ p: 0 }}>
          {requests.map((request, index) => (
            <React.Fragment key={request.id}>
              <RequestItem request={request} renderActions={renderActions} onStartChat={onStartChat} onViewMedia={onViewMedia} />
              {index < requests.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography sx={{ textAlign: 'center', p: 4 }} color="text.secondary">No requests to display.</Typography>
      )}
    </Paper>
  );
};

export default RequestList;