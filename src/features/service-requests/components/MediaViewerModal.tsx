
import React, { useState, useEffect } from 'react';
import { Media } from '../../../types/index';
import { Dialog, Box, Typography, IconButton } from '@mui/material';
import { Close, ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';

interface MediaViewerModalProps {
    open: boolean;
    media: Media[];
    title: string;
    onClose: () => void;
}

const MediaViewerModal: React.FC<MediaViewerModalProps> = ({ open, media, title, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!open) {
            setCurrentIndex(0);
        }
    }, [open]);

    const goToPrevious = () => setCurrentIndex(prev => (prev === 0 ? media.length - 1 : prev - 1));
    const goToNext = () => setCurrentIndex(prev => (prev === media.length - 1 ? 0 : prev + 1));
    
    const currentMedia = media[currentIndex];

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="lg" 
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                    height: '90vh',
                }
            }}
        >
            <Box sx={{ position: 'relative', width: '100%', height: '100%', color: 'white' }}>
                 <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, p: 2, zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)' }}>
                    <Box>
                        <Typography variant="h6">{title}</Typography>
                        <Typography variant="body2">{`Attachment ${currentIndex + 1} of ${media.length}`}</Typography>
                    </Box>
                    <IconButton onClick={onClose} sx={{ color: 'white' }}><Close /></IconButton>
                </Box>
                
                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {currentMedia?.type === 'image' && (
                        <Box component="img" src={currentMedia.url} alt={`Attachment ${currentIndex + 1}`} sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    )}
                     {currentMedia?.type === 'video' && (
                        <Box component="video" src={currentMedia.url} controls sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    )}
                </Box>

                {media.length > 1 && (
                    <>
                        <IconButton onClick={goToPrevious} sx={{ position: 'absolute', top: '50%', left: 16, transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}><ArrowBackIosNew /></IconButton>
                        <IconButton onClick={goToNext} sx={{ position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}><ArrowForwardIos /></IconButton>
                    </>
                )}
            </Box>
        </Dialog>
    );
};

export default MediaViewerModal;