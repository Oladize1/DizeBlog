import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store'

const ProtectedPage = () => {
  const { user } = useAuthStore()
  return user ? <Outlet/> : <Navigate to={'/login'} replace />
}

export default ProtectedPage