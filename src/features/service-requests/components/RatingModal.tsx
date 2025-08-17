
import React, { useState, FormEvent } from 'react';
import { ServiceRequest, Role } from '../../../types/index';
import { ALL_USERS, TECHNICIANS } from '../../../constants/index';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, TextField, Rating as MuiRating, CircularProgress
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface RatingModalProps {
    open: boolean;
    request: ServiceRequest;
    userRole: Role; // The role of the person currently rating
    onClose: () => void;
    onSubmit: (requestId: string, role: Role, rating: number, feedback: string) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ open, request, userRole, onClose, onSubmit }) => {
    const [rating, setRating] = useState<number | null>(0);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!rating || rating === 0) {
            alert('Please select a star rating.');
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            onSubmit(request.id, userRole, rating, feedback);
            setIsSubmitting(false);
        }, 1000);
    };

    const isRatingUser = userRole === Role.Technician;
    const title = isRatingUser ? `Rate Customer: ${ALL_USERS.find(u => u.id === request.userId)?.name}` : `Rate Technician: ${TECHNICIANS.find(t => t.id === request.assignedTechnicianId)?.name}`;
    const subTitle = `For service: "${request.title}"`;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {title}
                <Typography variant="body2" color="text.secondary">{subTitle}</Typography>
            </DialogTitle>
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ textAlign: 'center', my: 2 }}>
                        <Typography component="legend" mb={1}>Your Rating</Typography>
                        <MuiRating
                            name="simple-controlled"
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                            size="large"
                        />
                    </Box>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Add Feedback (Optional)"
                        multiline
                        rows={4}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder={isRatingUser ? "e.g., The customer was friendly and communicative." : "e.g., The technician was professional and efficient."}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose} variant="outlined">Cancel</Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting || !rating}>
                        {isSubmitting ? <CircularProgress size={24} /> : 'Submit Rating'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default RatingModal;