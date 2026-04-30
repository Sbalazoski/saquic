import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import TopBar from './components/TopBar'
import BottomNav from './components/BottomNav'
import MoreDrawer from './components/MoreDrawer'
import Landing from './pages/Landing'
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

// Simple auth check
function useAuth() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('saquic_user')
    return saved ? saved : null
  })
  return user
}

export default function App() {
  const [moreOpen, setMoreOpen] = useState(false)
  const user = useAuth()

  // If no user, redirect to landing
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

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
