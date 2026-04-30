import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import TopBar from './components/TopBar'
import BottomNav from './components/BottomNav'
import MoreDrawer from './components/MoreDrawer'
import Dashboard from './pages/Dashboard'
import Flock from './pages/Flock'
import BirdDetail from './pages/BirdDetail'
import AddBird from './pages/AddBird'
import Eggs from './pages/Eggs'
import Lineage from './pages/Lineage'
import Hatch from './pages/Hatch'
import Chicks from './pages/Chicks'
import Breeds from './pages/Breeds'
import Detect from './pages/Detect'
import Health from './pages/Health'
import Showcase from './pages/Showcase'

// Landing page component
function LandingPage() {
  function handleStart() {
    localStorage.setItem('saquic_user', 'demo')
    window.location.reload()
  }
  
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">🐓</div>
        <h1 className="text-4xl font-serif text-deep mb-2">SAQUIC</h1>
        <p className="text-earth text-lg mb-8">Fine Poultry Breeder</p>
        <button 
          onClick={handleStart}
          className="w-full max-w-sm bg-rust text-white font-medium py-3 px-4 rounded-lg hover:bg-deep transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [moreOpen, setMoreOpen] = useState(false)
  const [inApp, setInApp] = useState(() => {
    return localStorage.getItem('saquic_user') === 'demo'
  })

  // If not in app mode, show landing
  if (!inApp) {
    return <LandingPage />
  }

  // Otherwise show app
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <TopBar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/flock" element={<Flock />} />
          <Route path="/bird/:id" element={<BirdDetail />} />
          <Route path="/add-bird" element={<AddBird />} />
          <Route path="/eggs" element={<Eggs />} />
          <Route path="/lineage" element={<Lineage />} />
          <Route path="/hatch" element={<Hatch />} />
          <Route path="/chicks" element={<Chicks />} />
          <Route path="/breeds" element={<Breeds />} />
          <Route path="/detect" element={<Detect />} />
          <Route path="/health" element={<Health />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav onMore={() => setMoreOpen(true)} />
      <MoreDrawer open={moreOpen} onClose={() => setMoreOpen(false)} />
    </div>
  )
}
