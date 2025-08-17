
import React from 'react';
import { RequestStatus, TechnicianStatus } from '../../types/index';
import Chip from '@mui/material/Chip';
import { 
    Pending, Done, Sync, LocalShipping, Payment, Paid, Cancel, 
    CheckCircle, NotInterested, RadioButtonUnchecked 
} from '@mui/icons-material';

interface StatusBadgeProps {
  status: RequestStatus | TechnicianStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig: { [key: string]: { label: string; color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"; icon: React.ReactElement} } = {
    [RequestStatus.Pending]: { label: status, color: 'warning', icon: <Pending /> },
    [RequestStatus.Accepted]: { label: status, color: 'info', icon: <CheckCircle /> },
    [RequestStatus.InProgress]: { label: status, color: 'primary', icon: <Sync /> },
    [RequestStatus.Completed]: { label: status, color: 'secondary', icon: <Done /> },
    [RequestStatus.AwaitingPayment]: { label: 'Awaiting Payment', color: 'info', icon: <Payment /> },
    [RequestStatus.Paid]: { label: status, color: 'success', icon: <Paid /> },
    [RequestStatus.Cancelled]: { label: status, color: 'error', icon: <Cancel /> },
    [TechnicianStatus.Available]: { label: status, color: 'success', icon: <CheckCircle /> },
    [TechnicianStatus.Busy]: { label: status, color: 'warning', icon: <LocalShipping /> },
    [TechnicianStatus.Offline]: { label: status, color: 'default', icon: <RadioButtonUnchecked /> },
  };

  const config = statusConfig[status] || { label: status, color: 'default', icon: <NotInterested /> };

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size="small"
      variant="filled"
      sx={{
        '& .MuiChip-icon': {
          fontSize: '1rem',
          color: 'inherit'
        },
        '& .MuiChip-label': {
          fontWeight: 500
        },
        color: `${config.color}.contrastText`,
        bgcolor: `${config.color}.main`,
        opacity: 0.9
      }}
    />
  );
};

export default StatusBadge;