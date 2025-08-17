
import React, { useState } from 'react';
import { Technician, ServiceRequest, ViewType, Role, Media } from './types/index';
import { TECHNICIANS } from './constants/index';
import { useAuth } from './contexts/AuthContext';
import { useServiceRequests } from './features/service-requests/hooks/useServiceRequests';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import UserDashboard from './features/dashboard/UserDashboard';
import CreateRequestForm from './features/service-requests/components/CreateRequestForm';
import RequestHistory from './features/service-requests/components/RequestHistory';
import TechniciansPage from './features/technicians/TechniciansPage';
import LoginPage from './features/auth/LoginPage';
import AdminDashboard from './features/dashboard/AdminDashboard';
import TechnicianDashboard from './features/dashboard/TechnicianDashboard';
import ProfilePage from './features/profile/ProfilePage';
import InvoiceModal from './features/service-requests/components/InvoiceModal';
import RatingModal from './features/service-requests/components/RatingModal';
import ChatModal from './features/messaging/components/ChatModal';
import MediaViewerModal from './features/service-requests/components/MediaViewerModal';
import Box from '@mui/material/Box';


const App: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const technicians: Technician[] = TECHNICIANS;
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  // Modal states
  const [invoiceToPay, setInvoiceToPay] = useState<ServiceRequest | null>(null);
  const [requestToRate, setRequestToRate] = useState<{ request: ServiceRequest; role: Role } | null>(null);
  const [chattingRequest, setChattingRequest] = useState<ServiceRequest | null>(null);
  const [viewingMedia, setViewingMedia] = useState<{ media: Media[], title: string } | null>(null);


  const {
    serviceRequests,
    addServiceRequest,
    updateRequestStatus,
    cancelServiceRequest,
    cancelRequestByTechnician,
    sendInvoice,
    payInvoice,
    submitRating,
    sendMessage,
  } = useServiceRequests(currentUser, updateUserProfile);
  
  const handleAddServiceRequest = (...args: Parameters<typeof addServiceRequest>) => {
      addServiceRequest(...args);
      setActiveView('dashboard');
  };

  const handlePayInvoice = (requestId: string) => {
      payInvoice(requestId);
      setInvoiceToPay(null);
  };
  
  const handleSubmitRating = (...args: Parameters<typeof submitRating>) => {
    submitRating(...args);
    setRequestToRate(null);
  }

  const handleSendMessage = (requestId: string, text: string) => {
    if (currentUser) {
        sendMessage(requestId, text, currentUser.id);
    }
  };


  if (!currentUser) {
    return <LoginPage />;
  }
  
  const openMediaViewer = (request: ServiceRequest) => {
      if (request.media && request.media.length > 0) {
          setViewingMedia({ media: request.media, title: request.title });
      }
  };

  const renderActiveView = () => {
    const currentTech = technicians.find(t => t.id === currentUser.id);

    // Handle shared views first
    if (activeView === 'profile') {
        return <ProfilePage user={currentUser} technician={currentTech} />;
    }
    
    // Role-specific view routing
    switch (currentUser.role) {
      case Role.Admin:
        switch(activeView) {
            case 'history':
                return <RequestHistory requests={serviceRequests} onStartChat={setChattingRequest} onViewMedia={openMediaViewer} />;
            case 'technicians':
                return <TechniciansPage technicians={technicians} />;
            case 'dashboard':
            default:
                return <AdminDashboard requests={serviceRequests} technicians={technicians} user={currentUser} />;
        }
      
      case Role.Technician:
        if (!currentTech) return <div>Error: Technician data not found.</div>;
        switch(activeView) {
            case 'history':
                const techHistory = serviceRequests.filter(r => r.assignedTechnicianId === currentUser.id);
                return <RequestHistory requests={techHistory} onRateRequest={(request) => setRequestToRate({ request, role: currentUser.role })} onStartChat={setChattingRequest} onViewMedia={openMediaViewer} />;
            case 'dashboard':
            default:
                return <TechnicianDashboard 
                          technician={currentTech} 
                          requests={serviceRequests} 
                          user={currentUser} 
                          onUpdateRequestStatus={updateRequestStatus}
                          onCancelRequest={cancelRequestByTechnician}
                          onSendInvoice={sendInvoice}
                          onRateRequest={(request) => setRequestToRate({ request, role: currentUser.role })}
                          onStartChat={setChattingRequest} 
                          onViewMedia={openMediaViewer}
                       />;
        }

      case Role.User:
      default:
        const userRequests = serviceRequests.filter(r => r.userId === currentUser.id);
         switch (activeView) {
            case 'new-request':
                return <CreateRequestForm onSubmit={handleAddServiceRequest} />;
            case 'history':
                return <RequestHistory requests={userRequests} onCancelRequest={cancelServiceRequest} onViewInvoice={setInvoiceToPay} onRateRequest={(request) => setRequestToRate({ request, role: currentUser.role })} onStartChat={setChattingRequest} onViewMedia={openMediaViewer} />;
            case 'technicians':
                return <TechniciansPage technicians={technicians} />;
            case 'dashboard':
            default:
                return <UserDashboard requests={userRequests} technicians={technicians} user={currentUser} setView={setActiveView} onCancelRequest={cancelServiceRequest} onViewInvoice={setInvoiceToPay} onRateRequest={(request) => setRequestToRate({ request, role: currentUser.role })} onStartChat={setChattingRequest} onViewMedia={openMediaViewer} />;
        }
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'transparent' }}>
      <Sidebar activeView={activeView} setView={setActiveView} userRole={currentUser.role} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header />
        <Box 
          component="main" 
          sx={{ 
            flex: 1, 
            overflowY: 'auto', 
            p: { xs: 2, sm: 3, lg: 4 },
            bgcolor: 'transparent'
          }}
        >
          {renderActiveView()}
        </Box>
      </Box>
      
       {/* Modals Layer */}
       {invoiceToPay && (
        <InvoiceModal 
          request={invoiceToPay} 
          open={!!invoiceToPay}
          onClose={() => setInvoiceToPay(null)}
          onPay={handlePayInvoice}
        />
      )}
       {requestToRate && (
        <RatingModal
          request={requestToRate.request}
          userRole={requestToRate.role}
          open={!!requestToRate}
          onClose={() => setRequestToRate(null)}
          onSubmit={handleSubmitRating}
        />
      )}
      {chattingRequest && currentUser && (
        <ChatModal
          request={chattingRequest}
          currentUser={currentUser}
          open={!!chattingRequest}
          onClose={() => setChattingRequest(null)}
          onSendMessage={handleSendMessage}
        />
      )}
      {viewingMedia && (
          <MediaViewerModal 
            media={viewingMedia.media}
            title={viewingMedia.title}
            open={!!viewingMedia}
            onClose={() => setViewingMedia(null)}
          />
      )}
    </Box>
  );
};

export default App;