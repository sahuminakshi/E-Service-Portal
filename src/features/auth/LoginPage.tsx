
import React, { useState } from 'react';
import WelcomePage from './WelcomePage';
import AuthForm from './AuthForm';

const LoginPage: React.FC = () => {
    const [view, setView] = useState<'welcome' | 'auth'>('welcome');

    return (
        <>
            {view === 'welcome' ? (
                <WelcomePage onNavigateToAuth={() => setView('auth')} />
            ) : (
                <AuthForm />
            )}
        </>
    );
};

export default LoginPage;