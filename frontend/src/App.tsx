import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'

/** Renders the application route tree. */
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
