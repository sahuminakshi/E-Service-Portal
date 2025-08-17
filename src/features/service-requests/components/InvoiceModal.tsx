

import React, { useState, FormEvent } from 'react';
import { ServiceRequest } from '../../../types/index';
import Icon from '../../../components/ui/Icon';
import { formatCurrency } from '../../../utils/formatters';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography,
    TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Close } from '@mui/icons-material';

interface InvoiceModalProps {
    open: boolean;
    request: ServiceRequest;
    onClose: () => void;
    onPay: (requestId: string) => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ open, request, onClose, onPay }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const invoice = request.invoice;

    if (!invoice) return null;

    const handlePayment = (e: FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            onPay(request.id);
            setIsProcessing(false);
        }, 2000);
    };
    
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h5" component="span" fontWeight="bold">Invoice </Typography>
                    <Typography variant="body1" component="span" color="text.secondary">#{invoice.id}</Typography>
                </Box>
                <Icon name="shield-check" sx={{ color: 'primary.main', fontSize: 32 }}/>
            </DialogTitle>
            <DialogContent dividers>
                <Box component="form" id="payment-form" onSubmit={handlePayment}>
                    <Grid container spacing={4}>
                        <Grid xs={12} md={7}>
                            <Typography variant="h6" gutterBottom>Summary</Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Description</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {invoice.items.map((item, index) => (
                                            <TableRow key={index}><TableCell>{item.description}</TableCell><TableCell align="right">{formatCurrency(item.amount)}</TableCell></TableRow>
                                        ))}
                                        <TableRow><TableCell>Subtotal</TableCell><TableCell align="right">{formatCurrency(request.cost || 0)}</TableCell></TableRow>
                                        <TableRow><TableCell>Tax (8%)</TableCell><TableCell align="right">{formatCurrency(invoice.tax)}</TableCell></TableRow>
                                        <TableRow sx={{ '& td': { fontWeight: 'bold' } }}>
                                            <TableCell>Total Due</TableCell>
                                            <TableCell align="right" sx={{ fontSize: '1.1rem' }}>{formatCurrency(invoice.total)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid xs={12} md={5}>
                            <Typography variant="h6" gutterBottom>Payment Information</Typography>
                            <Grid container spacing={2}>
                                <Grid xs={12}><TextField fullWidth required label="Card Number" placeholder="•••• •••• •••• 4242" /></Grid>
                                <Grid xs={6}><TextField fullWidth required label="Expiry Date" placeholder="MM / YY" /></Grid>
                                <Grid xs={6}><TextField fullWidth required label="CVC" placeholder="•••" /></Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="outlined">Cancel</Button>
                <Button type="submit" form="payment-form" variant="contained" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : `Pay ${formatCurrency(invoice.total)} Now`}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InvoiceModal;
