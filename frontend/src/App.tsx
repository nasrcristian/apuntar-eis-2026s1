import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import './App.css'

import UploadPage from './pages/UploadPage'
import MaterialPage from './pages/MaterialPage/MaterialPage'
import MaterialListPage from './pages/MaterialListPage'
import Register from './components/Register/Register'
import LoginPage from './pages/auth/LoginPage'
import HomePage from './pages/HomePage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
   <>  
    <CssBaseline />
      <Routes>
        <Route path="/" element={<MaterialListPage />} />
        <Route path="/create" element={
            <ProtectedRoute><UploadPage /></ProtectedRoute>
        } />
        <Route path="/material/:id" element={<MaterialPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </>
  )
}

export default App
