

import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { SERVICE_CATEGORIES, TIME_SLOTS } from '../../../constants/index';
import { Paper, Typography, Box, TextField, Select, MenuItem, Button, FormControl, InputLabel, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import { PhotoCameraBackOutlined, VideocamOutlined, Close } from '@mui/icons-material';

interface CreateRequestFormProps {
  onSubmit: (title: string, category: string, description: string, address: string, contactPhone: string, timeslot: { date: string; time: string }, mediaFiles: File[]) => void;
}

const CreateRequestForm: React.FC<CreateRequestFormProps> = ({ onSubmit }) => {
  const { currentUser } = useAuth();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(SERVICE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [contactPhone, setContactPhone] = useState(currentUser?.contactPhone || '');
  const [isLoading, setIsLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleFileChange = (files: FileList | null) => {
    if (files) {
        const newFiles = Array.from(files);
        if (mediaFiles.length + newFiles.length > 5) {
            alert('You can upload a maximum of 5 files.');
            return;
        }
        setMediaFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !category || !description || !address || !contactPhone) {
      alert('Please fill out all service details, including the address and a contact phone number.');
      return;
    }
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time for the appointment.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      onSubmit(title, category, description, address, contactPhone, {
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
      }, mediaFiles);
      setIsLoading(false);
    }, 1500);
  };
  
  const renderCalendar = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0,0,0,0);

    const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
    
    const isPastDate = (day: number) => new Date(year, month, day) < today;

    return (
        <Paper elevation={2} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Button onClick={handlePrevMonth}>&lt;</Button>
                <Typography fontWeight="bold">{monthNames[month]} {year}</Typography>
                <Button onClick={handleNextMonth}>&gt;</Button>
            </Box>
            <Grid container columns={7} spacing={1} textAlign="center">
                {daysOfWeek.map(day => <Grid xs={1} key={day}><Typography variant="caption" color="text.secondary">{day}</Typography></Grid>)}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <Grid xs={1} key={`empty-${i}`}></Grid>)}
                {Array.from({ length: daysInMonth }).map((_, day) => {
                    const dayNumber = day + 1;
                    const isPast = isPastDate(dayNumber);
                    const isSelected = selectedDate?.toDateString() === new Date(year, month, dayNumber).toDateString();
                    return (
                        <Grid xs={1} key={dayNumber}>
                            <Button
                                fullWidth
                                variant={isSelected ? 'contained' : 'text'}
                                onClick={() => !isPast && setSelectedDate(new Date(year, month, dayNumber))}
                                disabled={isPast}
                                sx={{ minWidth: 36, height: 36, p: 0, borderRadius: '50%' }}
                            >
                                {dayNumber}
                            </Button>
                        </Grid>
                    )
                })}
            </Grid>
        </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={3}>Create a New Service Request</Typography>
      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, maxWidth: 'lg', mx: 'auto' }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <TextField label="Service Title" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
            <FormControl fullWidth required>
              <InputLabel id="category-label">Service Category</InputLabel>
              <Select labelId="category-label" value={category} label="Service Category" onChange={(e) => setCategory(e.target.value)}>
                {SERVICE_CATEGORIES.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Problem Description" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required fullWidth />
            
            <Box>
                <Typography variant="subtitle1" gutterBottom>Add Photos or Video (Optional)</Typography>
                <Box
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); handleFileChange(e.dataTransfer.files); }}
                  sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 1, p: 3, textAlign: 'center', bgcolor: 'action.hover' }}
                >
                    <PhotoCameraBackOutlined sx={{ fontSize: 48, color: 'text.secondary' }} />
                    <Typography>
                        <Button component="label">Upload files<input type="file" hidden multiple accept="image/*,video/*" onChange={e => handleFileChange(e.target.files)} /></Button> or drag and drop
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Max 5 files. PNG, JPG, GIF, MP4 up to 10MB.</Typography>
                </Box>
                {mediaFiles.length > 0 && (
                    <Grid container spacing={2} mt={1}>
                        {mediaFiles.map((file, index) => (
                            <Grid key={index} xs={4} sm={3} md={2.4}>
                                <Paper sx={{ position: 'relative', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {file.type.startsWith('image/') ? (
                                        <img src={URL.createObjectURL(file)} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                    ) : (
                                        <VideocamOutlined sx={{ fontSize: 40 }} />
                                    )}
                                    <IconButton size="small" onClick={() => removeFile(index)} sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'error.main', color: 'common.white', '&:hover': { bgcolor: 'error.dark' } }}><Close fontSize="inherit" /></IconButton>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            <TextField label="Service Address" multiline rows={2} value={address} onChange={(e) => setAddress(e.target.value)} required fullWidth />
            <TextField label="Contact Phone Number" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required fullWidth />
            
            <Grid container spacing={4}>
                <Grid xs={12} md={6}>
                    <Typography variant="h6" align="center" gutterBottom>Select a Date</Typography>
                    {renderCalendar()}
                </Grid>
                <Grid xs={12} md={6}>
                    <Typography variant="h6" align="center" gutterBottom>
                        {selectedDate ? `Available Times for ${selectedDate.toLocaleDateString()}` : 'Select a Date First'}
                    </Typography>
                    <Grid container spacing={2} sx={{ opacity: selectedDate ? 1 : 0.5 }}>
                        {TIME_SLOTS.map(time => (
                            <Grid xs={6} key={time}>
                                <Button fullWidth variant={selectedTime === time ? "contained" : "outlined"} onClick={() => setSelectedTime(time)} disabled={!selectedDate}>
                                    {time}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>

            <Button type="submit" variant="contained" size="large" disabled={isLoading} fullWidth>{isLoading ? 'Submitting...' : 'Submit Request'}</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateRequestForm;
