

import React from 'react';
import { ServiceRequest, Technician, User, RequestStatus, TechnicianStatus } from '../../types/index';
import { Paper, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import Icon from '../../components/ui/Icon';
import { ALL_USERS } from '../../constants/index';
import { formatCurrency } from '../../utils/formatters';
import { 
  ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';

interface AdminDashboardProps {
  requests: ServiceRequest[];
  technicians: Technician[];
  user: User;
}

const StatCard: React.FC<{ title: string; value: string | number; change: string; icon: string; }> = ({ title, value, change, icon }) => (
    <Paper elevation={4} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
                <Typography color="text.secondary" gutterBottom>{title}</Typography>
                <Typography variant="h4" component="p" fontWeight="bold">{value}</Typography>
                <Typography variant="caption" color="text.secondary">{change}</Typography>
            </Box>
            <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: '50%' }}>
                 <Icon name={icon} sx={{ color: 'text.primary' }} />
            </Box>
        </Box>
    </Paper>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper elevation={3} sx={{ p: 1.5 }}>
        <Typography fontWeight="bold">{label}</Typography>
        <Typography variant="body2">{`Requests: ${payload[0].value}`}</Typography>
      </Paper>
    );
  }
  return null;
};

const PerformanceChart: React.FC<{data: any[]}> = ({data}) => (
    <Paper elevation={4} sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>Requests Performance</Typography>
        <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }}/>
                    <Bar dataKey="requests" fill="#4f46e5" radius={[8, 8, 0, 0]} barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    </Paper>
);

const AttendanceChart: React.FC<{data: any[]}> = ({data}) => {
    const COLORS = {
        [TechnicianStatus.Available]: '#22c55e',
        [TechnicianStatus.Busy]: '#f59e0b',
        [TechnicianStatus.Offline]: '#64748b',
    };
    
    const total = data.reduce((sum, entry) => sum + entry.value, 0);

    return (
        <Paper elevation={4} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>Technician Status</Typography>
            <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={95} fill="#8884d8" paddingAngle={5} dataKey="value" nameKey="name">
                            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#ccc'} stroke={'none'}/>)}
                        </Pie>
                         <Legend iconType="circle" />
                         <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#1e293b" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{total}</text>
                         <text x="50%" y="50%" dy={24} textAnchor="middle" fill="#64748b" style={{ fontSize: '0.8rem' }}>Total Techs</text>
                    </PieChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    )
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ requests, technicians, user }) => {
  const totalUsers = ALL_USERS.length;
  const totalRequests = requests.length;
  const totalRevenue = requests
    .filter(r => r.status === RequestStatus.Paid && r.invoice)
    .reduce((sum, r) => sum + (r.invoice?.total || 0), 0);
  const avgRating = technicians.reduce((acc, t) => acc + t.rating, 0) / (technicians.length || 1);

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  }).reverse();

  const performanceData = last7Days.map(day => {
    const dayString = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const reqCount = requests.filter(r => new Date(r.requestedAt).toDateString() === day.toDateString()).length;
    return { name: dayString, requests: reqCount };
  });

  const technicianStatusData = Object.values(TechnicianStatus).map(status => ({
      name: status,
      value: technicians.filter(t => t.status === status).length,
  })).filter(d => d.value > 0);

  return (
    <Box>
      <Typography variant="h3" component="h1" fontWeight="900" sx={{ mb: 1 }}>Dashboard</Typography>
      <Typography color="text.secondary">Here is today’s report and performances.</Typography>
      
      <Grid container spacing={3} mt={2}>
        <Grid xs={12} sm={6} md={3}>
          <StatCard title="Total Users" value={totalUsers} change="+2% from last month" icon="users"/>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard title="Total Requests" value={totalRequests} change="+15% from last month" icon="briefcase"/>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} change="+8% from last month" icon="analytics"/>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard title="Avg. Satisfaction" value={`${avgRating.toFixed(1)}/5`} change="+5% from last month" icon="star"/>
        </Grid>
        
        <Grid xs={12} lg={8}>
          <PerformanceChart data={performanceData} />
        </Grid>
        <Grid xs={12} lg={4}>
          <AttendanceChart data={technicianStatusData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
