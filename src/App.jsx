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

// Force load CSS before rendering
const cssLink = document.createElement('link')
cssLink.rel = 'stylesheet'
cssLink.href = '/assets/index-D-usfT0x.css'
document.head.appendChild(cssLink)

// Simple style object - guaranteed to work
const styles = {
  container: { minHeight: '100vh', backgroundColor: '#F7F3EE', display: 'flex', flexDirection: 'column' },
  content: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' },
  emoji: { fontSize: '60px', marginBottom: '16px' },
  title: { fontSize: '36px', fontFamily: 'Georgia, serif', color: '#5C3317', marginBottom: '8px' },
  subtitle: { fontSize: '18px', color: '#8B7355', marginBottom: '32px' },
  button: { width: '100%', maxWidth: '280px', backgroundColor: '#A0522D', color: 'white', fontWeight: '500', padding: '14px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' },
}

function LandingPage() {
  const [clicked, setClicked] = useState(false)
  
  function handleStart() {
    try {
      localStorage.setItem('saquic_user', 'demo')
      setClicked(true)
      // Small delay to show feedback, then reload
      setTimeout(() => window.location.reload(), 100)
    } catch (e) {
      alert('Please enable cookies/_LOCAL_STORAGE')
    }
  }

  if (clicked) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.emoji}>⏳</div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.emoji}>🐓</div>
        <h1 style={styles.title}>SAQUIC</h1>
        <p style={styles.subtitle}>Fine Poultry Breeder</p>
        <button style={styles.button} onClick={handleStart}>Get Started</button>
      </div>
    </div>
  )
}

export default function App() {
  const [moreOpen, setMoreOpen] = useState(false)
  const [ready, setReady] = useState(false)
  
  useEffect(() => {
    // Check localStorage after mount
    const user = localStorage.getItem('saquic_user')
    setReady(true)
  }, [])
  
  // Show loading while checking
  if (!ready) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.emoji}>🐓</div>
          <p style={styles.subtitle}>Loading...</p>
        </div>
      </div>
    )
  }
  
  const inApp = localStorage.getItem('saquic_user') === 'demo'
  
  if (!inApp) {
    return <LandingPage />
  }

  return (
    <div style={styles.container}>
      <TopBar />
      <main style={{flex: 1, overflowY: 'auto'}}>
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
