import { Routes, Route } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import './App.css'

import UploadPage from './pages/UploadPage'
import MaterialPage from './pages/MaterialPage/MaterialPage'
import MaterialListPage from './pages/MaterialListPage'
import Register from './components/Register/Register'

function App() {
  return (
   <>  
    <CssBaseline />
      <Routes>
        <Route path="/" element={<MaterialListPage />} />
        <Route path="/create" element={<UploadPage />} />
        <Route path="/material/:id" element={<MaterialPage />}/>
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
