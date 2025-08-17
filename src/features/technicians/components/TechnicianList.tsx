
import React from 'react';
import { Technician } from '../../../types/index';
import StatusBadge from '../../../components/ui/StatusBadge';
import { 
    Paper, Typography, Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider
} from '@mui/material';

interface TechnicianListProps {
  title: string;
  technicians: Technician[];
}

const TechnicianItem: React.FC<{ tech: Technician }> = ({ tech }) => (
    <ListItem secondaryAction={<StatusBadge status={tech.status} />}>
        <ListItemAvatar>
            <Avatar src={tech.avatarUrl} alt={tech.name} />
        </ListItemAvatar>
        <ListItemText
            primary={tech.name}
            secondary={tech.specialty}
        />
    </ListItem>
);

const TechnicianList: React.FC<TechnicianListProps> = ({ title, technicians }) => {
  return (
    <Paper elevation={4}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="bold">{title}</Typography>
      </Box>
      {technicians.length > 0 ? (
        <List sx={{ p: 0 }}>
          {technicians.map((tech, index) => (
            <React.Fragment key={tech.id}>
              <TechnicianItem tech={tech} />
              {index < technicians.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography sx={{ textAlign: 'center', p: 4 }} color="text.secondary">
            No available technicians right now.
        </Typography>
      )}
    </Paper>
  );
};

export default TechnicianList;