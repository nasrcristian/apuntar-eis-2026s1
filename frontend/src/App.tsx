import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import './App.css'

import UploadPage from './pages/UploadPage'
import MaterialPage from './pages/MaterialPage/MaterialPage'

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route path="/create" element={<UploadPage />} />
        <Route path="/material/:id" element={<MaterialPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
