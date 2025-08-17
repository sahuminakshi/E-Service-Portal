
import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { ServiceRequest, User } from '../../../types/index';
import Icon from '../../../components/ui/Icon';
import { ALL_USERS } from '../../../constants/index';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Box, Avatar,
  Typography, TextField, IconButton
} from '@mui/material';
import { Close, Send } from '@mui/icons-material';

interface ChatModalProps {
    open: boolean;
    request: ServiceRequest;
    currentUser: User;
    onClose: () => void;
    onSendMessage: (requestId: string, text: string) => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ open, request, currentUser, onClose, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const otherUserId = currentUser.id === request.userId ? request.assignedTechnicianId : request.userId;
    const otherUser = ALL_USERS.find(u => u.id === otherUserId);

    const handleSendMessage = (e: FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(request.id, newMessage.trim());
            setNewMessage('');
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [request.messages]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { height: '80vh', maxHeight: '700px' }}}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={otherUser?.avatarUrl} alt={otherUser?.name} />
                    <Box ml={2}>
                        <Typography variant="h6">{otherUser?.name || 'User'}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            RE: {request.title}
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={onClose}><Close /></IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ bgcolor: 'action.hover', p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {(request.messages || []).map(msg => {
                        const isCurrentUser = msg.senderId === currentUser.id;
                        return (
                            <Box key={msg.id} sx={{ display: 'flex', justifyContent: isCurrentUser ? 'flex-end' : 'flex-start' }}>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: 4,
                                    borderTopLeftRadius: isCurrentUser ? 16 : 4,
                                    borderTopRightRadius: isCurrentUser ? 4 : 16,
                                    bgcolor: isCurrentUser ? 'primary.main' : 'background.paper',
                                    color: isCurrentUser ? 'primary.contrastText' : 'text.primary',
                                    maxWidth: '75%',
                                }}>
                                    <Typography variant="body2">{msg.text}</Typography>
                                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', opacity: 0.7, mt: 0.5 }}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
                <div ref={messagesEndRef} />
            </DialogContent>
            
            <DialogActions sx={{ p: 1.5 }}>
                <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', width: '100%', gap: 1 }}>
                    <TextField
                        fullWidth
                        size="small"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        autoComplete="off"
                    />
                    <IconButton type="submit" color="primary" disabled={!newMessage.trim()}>
                        <Send />
                    </IconButton>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default ChatModal;