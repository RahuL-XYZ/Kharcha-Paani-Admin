import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../features/auth/AuthProvider';
import { ThemeProvider } from '../context/ThemeContext';
import { router } from './router';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
