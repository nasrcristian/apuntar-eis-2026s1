import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import './App.css'

import UploadPage from './pages/UploadPage'

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route path="/create" element={<UploadPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
