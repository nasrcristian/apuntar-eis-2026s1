import { Routes, Route } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import './App.css'

import UploadPage from './pages/UploadPage'
import MaterialPage from './pages/MaterialPage/MaterialPage'
import MaterialListPage from './pages/MaterialListPage'
import Register from './pages/Register/Register'
import LoginPage from './pages/auth/LoginPage'
import HomePage from './pages/HomePage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Navbar from './components/navbar/Navbar'
import ProfilePage from './pages/ProfilePage'
import MyMaterialsPage from './pages/MyMaterialsPage'
import { ThemeProvider, createTheme } from '@mui/material/styles'

function App() {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path="/library" element={<MaterialListPage />} />
        <Route path="/create" element={
          <ProtectedRoute><UploadPage /></ProtectedRoute>
        }/>
        <Route path="/material/:id" element={<MaterialPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        }/>
        <Route path="/mis-publicaciones" element={
            <ProtectedRoute><MyMaterialsPage /></ProtectedRoute>
        }/>
      </Routes>
    </>
  );
}

export default App;
