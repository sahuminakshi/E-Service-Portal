

import React from 'react';
import { Technician } from '../../types/index';
import StatusBadge from '../../components/ui/StatusBadge';
import Icon from '../../components/ui/Icon';
import { Box, Typography, Card, CardContent, CardActions, Button, Avatar, Rating } from '@mui/material';
import Grid from '@mui/material/Grid';

interface TechniciansPageProps {
  technicians: Technician[];
}

const TechnicianCard: React.FC<{ tech: Technician }> = ({ tech }) => (
    <Card elevation={4} sx={{ textAlign: 'center', p: 2 }}>
        <Avatar src={tech.avatarUrl} alt={tech.name} sx={{ width: 96, height: 96, mx: 'auto', border: '3px solid', borderColor: 'primary.main' }} />
        <CardContent>
            <Typography variant="h6" fontWeight="bold">{tech.name}</Typography>
            <Typography color="primary" gutterBottom>{tech.specialty}</Typography>
            <StatusBadge status={tech.status} />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 1 }}>
                <Rating value={tech.rating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary">({tech.jobsCompleted} jobs)</Typography>
            </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
            <Button 
              fullWidth 
              variant="contained" 
              disabled={tech.status !== 'Available'}
            >
              Request Service
            </Button>
        </CardActions>
    </Card>
);

const TechniciansPage: React.FC<TechniciansPageProps> = ({ technicians }) => {
  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={3}>Our Technicians</Typography>
      <Grid container spacing={3}>
        {technicians.map((tech) => (
          <Grid key={tech.id} xs={12} sm={6} md={4} lg={3}>
            <TechnicianCard tech={tech} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TechniciansPage;
