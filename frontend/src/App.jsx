import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import WorkoutList from './pages/WorkoutList'
import WorkoutDetail from './pages/WorkoutDetail'
import ActiveWorkout from './pages/ActiveWorkout'
import Upload from './pages/Upload'
import Profile from './pages/Profile'
import Layout from './components/Layout'

function App() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home stats={stats} onStatsUpdate={fetchStats} />} />
          <Route path="workouts" element={<WorkoutList />} />
          <Route path="workouts/:dayId" element={<WorkoutDetail />} />
          <Route path="workout/:sessionId" element={<ActiveWorkout onComplete={fetchStats} />} />
          <Route path="upload" element={<Upload />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

