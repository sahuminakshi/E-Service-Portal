

import { useState, useCallback } from 'react';
import { ServiceRequest, RequestStatus, Rating, Role, User, Message, Media } from '../../../types/index';
import { SERVICE_REQUESTS } from '../../../constants/index';

export const useServiceRequests = (
    currentUser: User | null,
    updateUserProfile: (userId: string, updatedData: Partial<User>) => void
) => {
    const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(SERVICE_REQUESTS);

    const cancelServiceRequest = useCallback((requestId: string) => {
        setServiceRequests(prev => prev.map(req => {
            if (req.id === requestId && (req.status === RequestStatus.Pending || req.status === RequestStatus.Accepted)) {
                return { ...req, status: RequestStatus.Cancelled, cancellationReason: "Cancelled by user." };
            }
            return req;
        }));
    }, []);

    const cancelRequestByTechnician = useCallback((requestId: string, reason: string) => {
        setServiceRequests(prev => prev.map(req => {
            if (req.id === requestId) {
                return { ...req, status: RequestStatus.Cancelled, cancellationReason: reason };
            }
            return req;
        }));
    }, []);

    const addServiceRequest = useCallback((
        title: string,
        category: string,
        description: string,
        address: string,
        contactPhone: string,
        requestedTimeslot: { date: string; time: string },
        mediaFiles: File[]
    ) => {
        if (!currentUser) return;

        if (!currentUser.address || !currentUser.contactPhone) {
            if (address && contactPhone) {
                updateUserProfile(currentUser.id, { address, contactPhone });
            }
        }

        const newMedia: Media[] = mediaFiles.map(file => ({
            type: file.type.startsWith('image/') ? 'image' : 'video',
            url: URL.createObjectURL(file),
        }));

        const newRequest: ServiceRequest = {
            id: `req-${Date.now()}`,
            title,
            category,
            description,
            address,
            contactPhone,
            status: RequestStatus.Pending,
            requestedAt: new Date(),
            userId: currentUser.id,
            requestedTimeslot,
            media: newMedia,
            assignedTechnicianId: null,
            cost: Math.floor(Math.random() * (500 - 50 + 1)) + 50, // Random cost
        };
        setServiceRequests(prevRequests => [newRequest, ...prevRequests]);
    }, [currentUser, updateUserProfile]);

    const updateRequestStatus = useCallback((requestId: string, newStatus: RequestStatus, techId?: string) => {
        setServiceRequests(prev => prev.map(req => {
            if (req.id === requestId) {
                const updatedReq: ServiceRequest = { ...req, status: newStatus };
                if (newStatus === RequestStatus.Accepted && techId) {
                    updatedReq.assignedTechnicianId = techId;
                }
                if (newStatus === RequestStatus.Completed) {
                    updatedReq.completedAt = new Date();
                }
                return updatedReq;
            }
            return req;
        }));
    }, []);

    const sendInvoice = useCallback((requestId: string) => {
        setServiceRequests(prev => prev.map(req => {
            if (req.id === requestId && req.status === RequestStatus.Completed && req.cost) {
                const subtotal = req.cost;
                const tax = subtotal * 0.08; // 8% tax
                const total = subtotal + tax;

                return {
                    ...req,
                    status: RequestStatus.AwaitingPayment,
                    invoice: {
                        id: `inv-${Date.now()}`,
                        issuedAt: new Date(),
                        items: [{ description: `${req.category} Service`, amount: subtotal }],
                        tax,
                        total,
                    }
                };
            }
            return req;
        }));
    }, []);

    const payInvoice = useCallback((requestId: string) => {
        setServiceRequests(prev => prev.map(req => {
            if (req.id === requestId && req.status === RequestStatus.AwaitingPayment && req.invoice) {
                return {
                    ...req,
                    status: RequestStatus.Paid,
                    invoice: { ...req.invoice, paidAt: new Date() },
                };
            }
            return req;
        }));
    }, []);

    const submitRating = useCallback((requestId: string, role: Role, rating: number, feedback: string) => {
        const newRating: Rating = {
            value: rating,
            feedback: feedback.trim(),
            ratedAt: new Date(),
        };

        setServiceRequests(prev => prev.map(req => {
            if (req.id === requestId) {
                if (role === Role.User) {
                    return { ...req, userRating: newRating };
                } else if (role === Role.Technician) {
                    return { ...req, technicianRating: newRating };
                }
            }
            return req;
        }));
    }, []);

    const sendMessage = useCallback((requestId: string, text: string, senderId: string) => {
        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            senderId,
            text,
            timestamp: new Date(),
        };

        setServiceRequests(prev => prev.map(req => {
            if (req.id === requestId) {
                const updatedMessages = req.messages ? [...req.messages, newMessage] : [newMessage];
                return { ...req, messages: updatedMessages };
            }
            return req;
        }));
    }, []);

    return {
        serviceRequests,
        addServiceRequest,
        updateRequestStatus,
        cancelServiceRequest,
        cancelRequestByTechnician,
        sendInvoice,
        payInvoice,
        submitRating,
        sendMessage,
    };
};