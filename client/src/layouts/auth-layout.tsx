import { LoadingSpinner } from '@/components/common/loading-spinner';
import { useAuth } from '@/context/auth-context';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="grid h-screen w-full lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <img
          src="https://images.unsplash.com/photo-1665083767499-ce88decba1a2?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Replace with a relevant museum/art image
          alt="Museum background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center bg-black/50 p-10 text-white">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight">zyARat</h1>
            <p className="mt-4 text-xl text-gray-300">
              Step into History. Book Your Museum Adventure Today.
            </p>
          </div>
        </div>
      </div>
      <div className="flex h-full items-center justify-center p-6">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="text-center lg:hidden">
            <h1 className="text-3xl font-bold">zyARat</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Discover the cultural heritage in a new way
            </p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};