import React, { useEffect } from 'react'
import { useAuth } from './auth/AuthContext'
import { attachTokenInterceptor } from './api/axios';
import App from './App';

export default function AppWrapper() {
    const  {token , logout} = useAuth();
    useEffect(() => {
        attachTokenInterceptor(() => token , logout);
} , [token , logout]);
    return (
        <App />
  )
}
