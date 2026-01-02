import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ChevronLeft, Flame, Clock, Trophy, TrendingUp, 
  Dumbbell, Calendar, ChevronRight, Search, Trash2,
  ChevronDown, X, Check
} from 'lucide-react'

// Exercise image mapping - using emoji/icons as placeholders
const exerciseImages = {
  'push': '🫸',
  'press': '🏋️',
  'curl': '💪',
  'squat': '🦵',
  'deadlift': '🏋️‍♂️',
  'lunge': '🚶',
  'row': '🚣',
  'pull': '🧗',
  'dip': '⬇️',
  'raise': '🙆',
  'fly': '🦅',
  'crunch': '🔄',
  'plank': '📏',
  'cardio': '🏃',
  'run': '🏃',
  'bike': '🚴',
  'default': '💪'
}

function getExerciseEmoji(name) {
  const lower = name.toLowerCase()
  for (const [key, emoji] of Object.entries(exerciseImages)) {
    if (lower.includes(key)) return emoji
  }
  return exerciseImages.default
}

function Profile() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [exercises, setExercises] = useState([])
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [exerciseHistory, setExerciseHistory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  
  // Workout history
  const [workoutHistory, setWorkoutHistory] = useState([])
  const [showHistorySection, setShowHistorySection] = useState(true)
  const [selectedSession, setSelectedSession] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch('/api/stats')
      const statsData = await statsRes.json()
      setStats(statsData)

      // Fetch workout history (sessions)
      const historyRes = await fetch('/api/sessions')
      if (historyRes.ok) {
        const historyData = await historyRes.json()
        setWorkoutHistory(historyData)
      }

      // Fetch all workout days to get unique exercises
      const plansRes = await fetch('/api/plans')
      const plans = await plansRes.json()
      
      const exerciseMap = new Map() // Use Map for deduplication
      
      // Helper to normalize exercise names (remove punctuation, extra spaces, singularize)
      const normalizeName = (name) => {
        let normalized = name
          .toLowerCase()
          .trim()
          .replace(/[:\-\*\.]+$/, '') // Remove trailing punctuation
          .replace(/[:\-\*\.]+/g, ' ') // Replace punctuation with spaces
          .replace(/\s+/g, ' ')        // Collapse multiple spaces
          .trim()
        
        // Singularize common exercise plurals (remove trailing 's' for common patterns)
        // But be careful not to singularize words that shouldn't be (e.g., "press" stays "press")
        const singularExceptions = ['press', 'pullups', 'pushups', 'dips', 'abs', 'bis', 'tris']
        if (!singularExceptions.some(ex => normalized.endsWith(ex))) {
          // Remove trailing 's' if the word ends with 's' (simple plurals)
          if (normalized.endsWith('s') && normalized.length > 3) {
            normalized = normalized.slice(0, -1)
          }
        }
        
        return normalized
      }
      
      for (const plan of plans) {
        const planRes = await fetch(`/api/plans/${plan.id}`)
        const planData = await planRes.json()
        
        for (const day of planData.workout_days) {
          for (const circuit of day.circuits) {
            for (const exercise of circuit.exercises) {
              // Normalize name for deduplication
              const normalizedName = normalizeName(exercise.name)
              
              // Skip if empty after normalization
              if (!normalizedName || normalizedName.length < 2) continue
              
              if (!exerciseMap.has(normalizedName)) {
                // Clean up the display name too
                const cleanName = exercise.name
                  .replace(/[:\-\*]+$/, '')
                  .trim()
                
                exerciseMap.set(normalizedName, {
                  id: exercise.id,
                  name: cleanName
                })
              }
            }
          }
        }
      }
      
      // Convert to array and sort
      const uniqueExercises = Array.from(exerciseMap.values())
        .sort((a, b) => a.name.localeCompare(b.name))
      
      setExercises(uniqueExercises)
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchExerciseHistory = async (exercise) => {
    setSelectedExercise(exercise)
    try {
      const res = await fetch(`/api/exercises/${exercise.id}/history`)
      const data = await res.json()
      setExerciseHistory(data)
    } catch (err) {
      console.error('Failed to fetch exercise history:', err)
    }
  }

  const deleteSession = async (sessionId) => {
    if (!confirm('Delete this workout session?')) return
    
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' })
      if (res.ok) {
        setWorkoutHistory(prev => prev.filter(s => s.id !== sessionId))
        setSelectedSession(null)
      }
    } catch (err) {
      console.error('Failed to delete session:', err)
    }
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const filteredExercises = exercises.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderGraph = () => {
    if (!exerciseHistory?.history?.length) {
      return (
        <div style={styles.emptyGraph}>
          <TrendingUp size={48} color="var(--text-muted)" />
          <p>No weight history yet</p>
          <span>Complete workouts to track your progress!</span>
        </div>
      )
    }

    const history = exerciseHistory.history
    const maxWeight = Math.max(...history.map(h => h.weight))
    const minWeight = Math.min(...history.map(h => h.weight))
    const range = maxWeight - minWeight || 1

    return (
      <div style={styles.graphContainer}>
        <div style={styles.graphHeader}>
          <span style={styles.graphTitle}>Weight Progress</span>
          <div style={styles.graphStats}>
            <div style={styles.graphStat}>
              <span style={styles.graphStatLabel}>PR</span>
              <span style={styles.graphStatValue}>{exerciseHistory.max_weight} lbs</span>
            </div>
            <div style={styles.graphStat}>
              <span style={styles.graphStatLabel}>Last</span>
              <span style={styles.graphStatValue}>{exerciseHistory.last_weight} lbs</span>
            </div>
          </div>
        </div>
        
        <div style={styles.graph}>
          <div style={styles.yAxis}>
            <span>{maxWeight}</span>
            <span>{Math.round((maxWeight + minWeight) / 2)}</span>
            <span>{minWeight}</span>
          </div>
          
          <div style={styles.bars}>
            {history.slice(-10).map((entry, index) => {
              const height = ((entry.weight - minWeight) / range) * 100 || 20
              return (
                <div key={index} style={styles.barContainer}>
                  <div style={{...styles.bar, height: `${Math.max(height, 10)}%`}}>
                    <span style={styles.barValue}>{entry.weight}</span>
                  </div>
                  <span style={styles.barLabel}>
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        
        <div style={styles.graphFooter}>
          <span>Total sessions: {exerciseHistory.total_logs}</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner" />
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={styles.title}>Profile</h1>
        <div style={{ width: 40 }} />
      </div>

      {/* Stats Overview */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: 'rgba(239, 68, 68, 0.15)'}}>
            <Flame size={20} color="var(--accent-red)" />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>{stats?.current_streak || 0}</span>
            <span style={styles.statLabel}>Day Streak</span>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: 'rgba(34, 211, 238, 0.15)'}}>
            <Dumbbell size={20} color="var(--accent-cyan)" />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>{stats?.total_workouts || 0}</span>
            <span style={styles.statLabel}>Workouts</span>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: 'rgba(168, 85, 247, 0.15)'}}>
            <Clock size={20} color="var(--accent-purple)" />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>{stats?.total_workout_minutes || 0}</span>
            <span style={styles.statLabel}>Minutes</span>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: 'rgba(251, 191, 36, 0.15)'}}>
            <Trophy size={20} color="var(--accent-gold)" />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>{stats?.longest_streak || 0}</span>
            <span style={styles.statLabel}>Best Streak</span>
          </div>
        </div>
      </div>

      {/* Workout History Section */}
      <div style={styles.section}>
        <button 
          style={styles.sectionHeaderBtn}
          onClick={() => setShowHistorySection(!showHistorySection)}
        >
          <h2 style={styles.sectionTitle}>
            <Calendar size={20} />
            Workout History
          </h2>
          <ChevronDown 
            size={20} 
            style={{ 
              transform: showHistorySection ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s'
            }} 
          />
        </button>

        {showHistorySection && (
          <div style={styles.historyList}>
            {workoutHistory.length === 0 ? (
              <div style={styles.emptyHistory}>
                <Calendar size={32} color="var(--text-muted)" />
                <p>No workouts completed yet</p>
              </div>
            ) : (
              workoutHistory.slice(0, 10).map(session => (
                <div key={session.id} style={styles.historyItem}>
                  <div style={styles.historyItemContent}>
                    <div style={styles.historyDate}>
                      {formatDate(session.started_at)}
                    </div>
                    <div style={styles.historyDetails}>
                      <span style={styles.historyDuration}>
                        {session.duration_minutes ? `${session.duration_minutes} min` : 'In progress'}
                      </span>
                      {session.completed_at && (
                        <span style={styles.historyCompleted}>
                          <Check size={12} /> Completed
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    style={styles.deleteSessionBtn}
                    onClick={() => deleteSession(session.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Exercise History Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <TrendingUp size={20} />
          Weight History
        </h2>
        
        {/* Search */}
        <div style={styles.searchContainer}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Selected Exercise Graph */}
        {selectedExercise && (
          <div style={styles.selectedExercise}>
            <div style={styles.selectedHeader}>
              <div style={styles.selectedExerciseInfo}>
                <span style={styles.exerciseEmoji}>{getExerciseEmoji(selectedExercise.name)}</span>
                <h3 style={styles.selectedName}>{selectedExercise.name}</h3>
              </div>
              <button 
                style={styles.closeSelected}
                onClick={() => {
                  setSelectedExercise(null)
                  setExerciseHistory(null)
                }}
              >
                <X size={20} />
              </button>
            </div>
            {renderGraph()}
          </div>
        )}

        {/* Exercise List */}
        <div style={styles.exerciseList}>
          {filteredExercises.map((exercise) => (
            <button
              key={exercise.id}
              style={{
                ...styles.exerciseItem,
                ...(selectedExercise?.id === exercise.id ? styles.exerciseItemActive : {})
              }}
              onClick={() => fetchExerciseHistory(exercise)}
            >
              <div style={styles.exerciseItemLeft}>
                <span style={styles.exerciseEmoji}>{getExerciseEmoji(exercise.name)}</span>
                <span style={styles.exerciseName}>{exercise.name}</span>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </button>
          ))}
          
          {filteredExercises.length === 0 && (
            <div style={styles.emptyList}>
              <p>No exercises found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    paddingBottom: '100px'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '16px',
    color: 'var(--text-secondary)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    paddingTop: 'max(16px, env(safe-area-inset-top))',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-subtle)'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    padding: '8px'
  },
  title: {
    fontSize: '18px',
    fontWeight: 700
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    padding: '20px'
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px',
    border: '1px solid var(--border-subtle)'
  },
  statIcon: {
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  statValue: {
    fontSize: '22px',
    fontWeight: 700
  },
  statLabel: {
    fontSize: '12px',
    color: 'var(--text-muted)'
  },
  section: {
    padding: '0 20px',
    marginBottom: '24px'
  },
  sectionHeaderBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    marginBottom: '16px',
    fontFamily: 'inherit',
    color: 'var(--text-primary)'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '0'
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  emptyHistory: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '32px',
    color: 'var(--text-muted)',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-md)'
  },
  historyItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)'
  },
  historyItemContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  historyDate: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)'
  },
  historyDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  historyDuration: {
    fontSize: '12px',
    color: 'var(--text-muted)'
  },
  historyCompleted: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: 'var(--accent-green)',
    fontWeight: 500
  },
  deleteSessionBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '8px',
    color: 'var(--accent-red)',
    cursor: 'pointer'
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'var(--bg-elevated)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 16px',
    marginBottom: '16px'
  },
  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none'
  },
  selectedExercise: {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px',
    marginBottom: '16px',
    border: '1px solid var(--accent-orange)'
  },
  selectedHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px'
  },
  selectedExerciseInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  exerciseEmoji: {
    fontSize: '24px'
  },
  selectedName: {
    fontSize: '16px',
    fontWeight: 700
  },
  closeSelected: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: 'var(--text-muted)',
    borderRadius: 'var(--radius-full)',
    padding: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  graphContainer: {
    background: 'var(--bg-elevated)',
    borderRadius: 'var(--radius-md)',
    padding: '16px'
  },
  graphHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  graphTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-secondary)'
  },
  graphStats: {
    display: 'flex',
    gap: '16px'
  },
  graphStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  graphStatLabel: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase'
  },
  graphStatValue: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--accent-green)'
  },
  graph: {
    display: 'flex',
    height: '150px',
    gap: '8px'
  },
  yAxis: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontSize: '10px',
    color: 'var(--text-muted)',
    paddingRight: '8px',
    width: '40px',
    textAlign: 'right'
  },
  bars: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-end',
    gap: '4px'
  },
  barContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end'
  },
  bar: {
    width: '100%',
    maxWidth: '30px',
    background: 'linear-gradient(180deg, var(--accent-orange) 0%, var(--accent-red) 100%)',
    borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '4px',
    minHeight: '20px'
  },
  barValue: {
    fontSize: '9px',
    fontWeight: 600,
    color: '#fff'
  },
  barLabel: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    marginTop: '4px',
    whiteSpace: 'nowrap'
  },
  graphFooter: {
    marginTop: '12px',
    fontSize: '12px',
    color: 'var(--text-muted)',
    textAlign: 'center'
  },
  emptyGraph: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    color: 'var(--text-muted)',
    textAlign: 'center',
    gap: '8px'
  },
  exerciseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  exerciseItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '14px 16px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'left',
    color: 'var(--text-primary)'
  },
  exerciseItemActive: {
    borderColor: 'var(--accent-orange)',
    background: 'rgba(255, 107, 53, 0.1)'
  },
  exerciseItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  exerciseName: {
    fontSize: '14px',
    fontWeight: 500
  },
  emptyList: {
    textAlign: 'center',
    padding: '32px',
    color: 'var(--text-muted)'
  }
}

export default Profile
