
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, Role, Technician, TechnicianStatus } from '../types/index';
import { ALL_USERS, TECHNICIANS } from '../constants/index';

interface SignUpDetails {
    name: string;
    email: string;
    role: Role;
    specialty?: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string) => boolean;
  logout: () => void;
  signup: (details: SignUpDetails) => { success: boolean, message: string };
  updateUserProfile: (userId: string, updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (email: string): boolean => {
    // This is a mock login. In a real app, you'd verify password and use tokens.
    const user = ALL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUserProfile = (userId: string, updatedData: Partial<User>) => {
    // Update our mock database
    const userIndex = ALL_USERS.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      ALL_USERS[userIndex] = { ...ALL_USERS[userIndex], ...updatedData };
    }
    
    // Update technician list if name is changed
    if (updatedData.name) {
        const techIndex = TECHNICIANS.findIndex(t => t.id === userId);
        if (techIndex !== -1) {
            TECHNICIANS[techIndex].name = updatedData.name;
        }
    }

    // Update the current user state if it's the one being edited
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prevUser => prevUser ? { ...prevUser, ...updatedData } : null);
    }
  };
  
  const signup = (details: SignUpDetails): { success: boolean, message: string } => {
    // In a real app, this would be an API call. Here, we're modifying the in-memory arrays.
    // This is not ideal practice for state management but works for this mock setup.
    try {
        const userExists = ALL_USERS.some(u => u.email.toLowerCase() === details.email.toLowerCase());
        if (userExists) {
            return { success: false, message: "A user with this email already exists." };
        }

        const newUserId = `user-${Date.now()}`;
        const newUser: User = {
            id: newUserId,
            name: details.name,
            email: details.email,
            role: details.role,
            avatarUrl: `https://i.pravatar.cc/150?u=${newUserId}`,
            registeredAt: new Date(),
        };
        ALL_USERS.push(newUser);

        if (details.role === Role.Technician) {
            if (!details.specialty) {
                // This case should be prevented by form validation but is good to have.
                return { success: false, message: "Technician specialty is required." };
            }
            const newTechnician: Technician = {
                id: newUserId, // Technician ID matches User ID
                name: details.name,
                specialty: details.specialty,
                rating: Math.round((4 + Math.random()) * 10) / 10, // Random rating between 4.0 and 5.0
                status: TechnicianStatus.Available,
                avatarUrl: newUser.avatarUrl,
                jobsCompleted: 0,
            };
            TECHNICIANS.push(newTechnician);
        }

        // Automatically log in the new user
        login(details.email);
        return { success: true, message: "Signup successful!" };

    } catch (error) {
        console.error("Signup error:", error);
        return { success: false, message: "An unexpected error occurred during signup." };
    }
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, signup, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};