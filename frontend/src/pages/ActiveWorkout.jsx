import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Pause, Play, ChevronLeft, ChevronRight, X, 
  RotateCcw, Shuffle, Info, Clock, Weight, TrendingUp, BookOpen
} from 'lucide-react'
import { getExerciseInfo } from '../data/exerciseDatabase'

function getExerciseColor(exerciseName) {
  const name = exerciseName.toLowerCase()
  if (name.includes('press') || name.includes('bench') || name.includes('push') || name.includes('chest')) return '#ff6b35'
  if (name.includes('curl') || name.includes('bicep')) return '#b366ff'
  if (name.includes('row') || name.includes('pull') || name.includes('back') || name.includes('lat')) return '#4ade80'
  if (name.includes('squat') || name.includes('leg') || name.includes('lunge')) return '#3b82f6'
  if (name.includes('deadlift')) return '#ef4444'
  if (name.includes('shoulder') || name.includes('raise') || name.includes('delt')) return '#fbbf24'
  if (name.includes('tricep') || name.includes('extension') || name.includes('dip')) return '#ec4899'
  if (name.includes('ab') || name.includes('crunch') || name.includes('plank') || name.includes('l-sit') || name.includes('leg raise')) return '#06b6d4'
  return '#6b7280'
}

function ActiveWorkout({ onComplete }) {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  
  const [session, setSession] = useState(null)
  const [workout, setWorkout] = useState(null)
  const [currentCircuit, setCurrentCircuit] = useState(0)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [weight, setWeight] = useState('')
  const [completedSets, setCompletedSets] = useState({})
  const [weightHistory, setWeightHistory] = useState({})
  const [showExerciseDetail, setShowExerciseDetail] = useState(false)
  
  const timerRef = useRef(null)

  useEffect(() => {
    fetchSession()
    return () => clearInterval(timerRef.current)
  }, [sessionId])

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimer(t => t + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isRunning])

  // Fetch weight history when exercise changes
  useEffect(() => {
    const exercise = getCurrentExerciseData()
    if (exercise) {
      fetchWeightHistory(exercise.id)
    }
  }, [currentExercise, currentCircuit, workout])

  const fetchSession = async () => {
    try {
      const sessionRes = await fetch(`/api/sessions/${sessionId}`)
      const sessionData = await sessionRes.json()
      setSession(sessionData)
      
      const workoutRes = await fetch(`/api/days/${sessionData.workout_day_id}`)
      const workoutData = await workoutRes.json()
      setWorkout(workoutData)
    } catch (err) {
      console.error('Failed to fetch session:', err)
    }
  }

  const fetchWeightHistory = async (exerciseId) => {
    try {
      const res = await fetch(`/api/exercises/${exerciseId}/history`)
      if (res.ok) {
        const data = await res.json()
        setWeightHistory(prev => ({ ...prev, [exerciseId]: data }))
        // Pre-fill weight with last used weight
        if (data.last_weight && !weight) {
          setWeight(data.last_weight.toString())
        }
      }
    } catch (err) {
      console.error('Failed to fetch weight history:', err)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getCurrentExerciseData = () => {
    if (!workout?.circuits) return null
    const circuit = workout.circuits[currentCircuit]
    if (!circuit) return null
    return circuit.exercises[currentExercise]
  }

  const getTotalSets = () => {
    const exercise = getCurrentExerciseData()
    if (!exercise) return 3
    const sets = parseInt(exercise.sets) || 3
    return sets
  }

  const getReps = () => {
    const exercise = getCurrentExerciseData()
    if (!exercise) return '10-12'
    return exercise.reps || '10-12'
  }

  const getSetKey = () => {
    return `${currentCircuit}-${currentExercise}-${currentSet}`
  }

  const handleNext = async () => {
    const totalSets = getTotalSets()
    
    // Mark current set as completed
    setCompletedSets(prev => ({
      ...prev,
      [getSetKey()]: { weight: weight || null }
    }))
    
    // Log to database
    await logExercise()
    
    // Check if more sets remain for this exercise
    if (currentSet < totalSets) {
      // Move to next set of SAME exercise
      setCurrentSet(currentSet + 1)
    } else {
      // All sets done, move to next exercise
      const circuit = workout.circuits[currentCircuit]
      
      if (currentExercise < circuit.exercises.length - 1) {
        // Next exercise in circuit
        setCurrentExercise(currentExercise + 1)
        setCurrentSet(1)
        setWeight('')
      } else {
        // End of circuit, move to next circuit
        if (currentCircuit < workout.circuits.length - 1) {
          setCurrentCircuit(currentCircuit + 1)
          setCurrentExercise(0)
          setCurrentSet(1)
          setWeight('')
        } else {
          // Workout complete!
          await completeWorkout()
        }
      }
    }
  }

  const handlePrevious = () => {
    if (currentSet > 1) {
      setCurrentSet(currentSet - 1)
    } else if (currentExercise > 0) {
      const prevExercise = workout.circuits[currentCircuit].exercises[currentExercise - 1]
      setCurrentExercise(currentExercise - 1)
      setCurrentSet(parseInt(prevExercise.sets) || 3)
      setWeight('')
    } else if (currentCircuit > 0) {
      const prevCircuit = workout.circuits[currentCircuit - 1]
      const prevExercise = prevCircuit.exercises[prevCircuit.exercises.length - 1]
      setCurrentCircuit(currentCircuit - 1)
      setCurrentExercise(prevCircuit.exercises.length - 1)
      setCurrentSet(parseInt(prevExercise.sets) || 3)
      setWeight('')
    }
  }

  const logExercise = async () => {
    const exercise = getCurrentExerciseData()
    if (!exercise) return
    
    try {
      await fetch(`/api/sessions/${sessionId}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise_id: exercise.id,
          set_number: currentSet,
          reps_completed: parseInt(getReps()) || 10,
          weight_used: weight ? parseFloat(weight) : null,
          completed: true
        })
      })
    } catch (err) {
      console.error('Failed to log exercise:', err)
    }
  }

  const completeWorkout = async () => {
    try {
      await fetch(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed_at: new Date().toISOString(),
          duration_minutes: Math.floor(timer / 60)
        })
      })
      onComplete?.()
      navigate('/')
    } catch (err) {
      console.error('Failed to complete workout:', err)
    }
  }

  const exercise = getCurrentExerciseData()
  const exerciseInfo = exercise ? getExerciseInfo(exercise.name) : null
  const exerciseColor = exercise ? getExerciseColor(exercise.name) : '#6b7280'
  const history = exercise ? weightHistory[exercise.id] : null

  if (!workout || !exercise) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner} />
        <p>Loading workout...</p>
      </div>
    )
  }

  const totalExercises = workout.circuits.reduce((sum, c) => sum + c.exercises.length, 0)
  const currentExerciseNumber = workout.circuits
    .slice(0, currentCircuit)
    .reduce((sum, c) => sum + c.exercises.length, 0) + currentExercise + 1
  const totalSets = getTotalSets()

  return (
    <div style={styles.container}>
      {/* Header with Timer */}
      <div style={styles.header}>
        <button style={styles.closeBtn} onClick={() => navigate('/')}>
          <X size={24} />
        </button>
        
        <button 
          style={styles.timerDisplay}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          <span style={styles.timerText}>{formatTime(timer)}</span>
        </button>
        
        <div style={styles.progressText}>
          {currentExerciseNumber}/{totalExercises}
        </div>
      </div>

      {/* Exercise Image/Visual */}
      <div 
        style={{
          ...styles.exerciseMedia, 
          background: exerciseInfo?.image 
            ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${exerciseInfo.image}) center/cover`
            : `linear-gradient(135deg, ${exerciseColor}40 0%, ${exerciseColor}15 100%)`
        }}
        onClick={() => setShowExerciseDetail(true)}
      >
        {!exerciseInfo?.image && (
          <div style={styles.mediaPlaceholder}>
            <div style={{...styles.exerciseIcon, background: exerciseColor}}>
              <Weight size={40} color="#fff" />
            </div>
          </div>
        )}
        <div style={styles.mediaOverlay}>
          <span style={styles.currentLabel}>CURRENT EXERCISE</span>
        </div>
        <button style={styles.infoBtn} onClick={(e) => { e.stopPropagation(); setShowExerciseDetail(true) }}>
          <BookOpen size={18} />
          <span>How To</span>
        </button>
        <div style={styles.muscleTag}>
          {exerciseInfo?.muscles || 'Multiple muscles'}
        </div>
      </div>

      {/* Exercise Info */}
      <div style={styles.exerciseInfo}>
        <h1 style={styles.exerciseName}>{exercise.name}</h1>
        
        {/* Coach Tip */}
        <div style={styles.tipBox}>
          <div style={styles.tipHeader}>
            <Info size={14} color="var(--accent-orange)" />
            <span style={styles.tipLabel}>QUICK TIP</span>
          </div>
          <p style={styles.tipText}>{exerciseInfo?.description || 'Focus on proper form and controlled movements.'}</p>
        </div>

        {/* Weight Input */}
        <div style={styles.weightSection}>
          <div style={styles.weightHeader}>
            <Weight size={16} color="var(--text-secondary)" />
            <span>Log Weight (lbs)</span>
            {history?.last_weight && (
              <span style={styles.lastWeight}>Last: {history.last_weight} lbs</span>
            )}
          </div>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={history?.last_weight ? history.last_weight.toString() : "0"}
            style={styles.weightInput}
          />
          {history?.max_weight && (
            <div style={styles.prBadge}>
              <TrendingUp size={12} />
              <span>PR: {history.max_weight} lbs</span>
            </div>
          )}
        </div>
      </div>

      {/* Set Counter */}
      <div style={styles.setSection}>
        <div style={styles.setDisplay}>
          <span style={styles.repsLabel}>{getReps()}</span>
          <span style={styles.repsText}>REPS</span>
        </div>
        
        <div style={styles.setCounter}>
          <span style={styles.setNumber}>{currentSet}</span>
          <span style={styles.setTotal}>of {totalSets}</span>
        </div>

        {/* Set Progress Dots */}
        <div style={styles.setDots}>
          {Array.from({ length: totalSets }, (_, i) => (
            <div 
              key={i} 
              style={{
                ...styles.setDot,
                background: i < currentSet 
                  ? 'var(--accent-orange)' 
                  : i === currentSet - 1 
                    ? 'var(--accent-orange)' 
                    : 'var(--bg-elevated)'
              }}
            />
          ))}
        </div>
        
        <div style={styles.circuitInfo}>
          Circuit {currentCircuit + 1} of {workout.circuits.length}
        </div>
      </div>

      {/* Navigation */}
      <div style={styles.navigation}>
        <button style={styles.navSideBtn} onClick={handlePrevious}>
          <RotateCcw size={20} />
          <span>Previous</span>
        </button>
        
        <button style={styles.navCenterBtn} onClick={handleNext}>
          <span>{currentSet < totalSets ? 'Next Set' : 'Next Exercise'}</span>
          <ChevronRight size={24} />
        </button>
        
        <button style={styles.navSideBtn} onClick={handleNext}>
          <Shuffle size={20} />
          <span>Skip</span>
        </button>
      </div>

      {/* Exercise Detail Modal */}
      {showExerciseDetail && (
        <div style={styles.modal} onClick={() => setShowExerciseDetail(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setShowExerciseDetail(false)}>
              <X size={24} />
            </button>
            
            {exerciseInfo?.image && (
              <div style={styles.modalImage}>
                <img src={exerciseInfo.image} alt={exercise.name} style={styles.modalImg} />
              </div>
            )}
            
            <div style={styles.modalBody}>
              <h2 style={styles.modalTitle}>{exercise.name}</h2>
              <p style={styles.modalMuscles}>{exerciseInfo?.muscles}</p>
              
              <div style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>How to Perform</h3>
                <p style={styles.modalDescription}>{exerciseInfo?.description}</p>
              </div>
              
              <div style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>Key Points</h3>
                <ul style={styles.modalTips}>
                  {exerciseInfo?.tips?.map((tip, i) => (
                    <li key={i} style={styles.modalTip}>
                      <span style={styles.tipBullet}>•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              
              {exerciseInfo?.source && (
                <p style={styles.modalSource}>
                  Source: <a href={`https://${exerciseInfo.source}`} target="_blank" rel="noopener noreferrer" style={styles.sourceLink}>{exerciseInfo.source}</a>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    display: 'flex',
    flexDirection: 'column'
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
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid var(--bg-elevated)',
    borderTopColor: 'var(--accent-orange)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    paddingTop: 'max(12px, env(safe-area-inset-top))',
    background: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10
  },
  closeBtn: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    padding: '8px',
    color: '#fff',
    cursor: 'pointer'
  },
  timerDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.15)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    color: '#fff',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  timerText: {
    fontSize: '18px',
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums'
  },
  progressText: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.7)'
  },
  exerciseMedia: {
    height: '220px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  mediaPlaceholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  exerciseIcon: {
    width: '80px',
    height: '80px',
    borderRadius: 'var(--radius-xl)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mediaOverlay: {
    position: 'absolute',
    bottom: '12px',
    left: '16px'
  },
  currentLabel: {
    fontSize: '10px',
    fontWeight: 700,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: '1px',
    background: 'rgba(0, 0, 0, 0.4)',
    padding: '5px 10px',
    borderRadius: 'var(--radius-full)'
  },
  infoBtn: {
    position: 'absolute',
    top: '70px',
    right: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  muscleTag: {
    position: 'absolute',
    bottom: '12px',
    right: '16px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#fff',
    background: 'rgba(0, 0, 0, 0.5)',
    padding: '5px 10px',
    borderRadius: 'var(--radius-full)'
  },
  exerciseInfo: {
    padding: '16px 20px',
    flex: 1,
    overflowY: 'auto'
  },
  exerciseName: {
    fontSize: '22px',
    fontWeight: 700,
    marginBottom: '12px',
    lineHeight: 1.2
  },
  tipBox: {
    background: 'rgba(255, 107, 53, 0.1)',
    border: '1px solid rgba(255, 107, 53, 0.2)',
    borderRadius: 'var(--radius-md)',
    padding: '12px',
    marginBottom: '12px'
  },
  tipHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '6px'
  },
  tipLabel: {
    fontSize: '10px',
    fontWeight: 700,
    color: 'var(--accent-orange)',
    letterSpacing: '0.5px'
  },
  tipText: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    margin: 0
  },
  weightSection: {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-md)',
    padding: '12px'
  },
  weightHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    marginBottom: '8px'
  },
  lastWeight: {
    marginLeft: 'auto',
    color: 'var(--accent-purple)',
    fontWeight: 500
  },
  weightInput: {
    width: '100%',
    padding: '14px',
    background: 'var(--bg-elevated)',
    border: '2px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '20px',
    fontWeight: 600,
    fontFamily: 'inherit',
    textAlign: 'center'
  },
  prBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    marginTop: '8px',
    fontSize: '12px',
    color: 'var(--accent-green)',
    fontWeight: 600
  },
  setSection: {
    padding: '16px 20px',
    textAlign: 'center',
    borderTop: '1px solid var(--border-subtle)'
  },
  setDisplay: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: '6px',
    marginBottom: '8px'
  },
  repsLabel: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--accent-orange)'
  },
  repsText: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    fontWeight: 500
  },
  setCounter: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: '6px',
    marginBottom: '12px'
  },
  setNumber: {
    fontSize: '48px',
    fontWeight: 800,
    color: 'var(--text-primary)',
    lineHeight: 1
  },
  setTotal: {
    fontSize: '18px',
    color: 'var(--text-muted)'
  },
  setDots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '8px'
  },
  setDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    transition: 'background 0.2s ease'
  },
  circuitInfo: {
    fontSize: '12px',
    color: 'var(--text-muted)'
  },
  navigation: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '16px 20px',
    paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
    background: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border-subtle)'
  },
  navSideBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '12px 16px',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '11px',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  navCenterBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px 24px',
    background: 'var(--accent-orange)',
    border: 'none',
    borderRadius: 'var(--radius-lg)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  
  // Modal styles
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 200,
    padding: '20px'
  },
  modalContent: {
    width: '100%',
    maxWidth: '500px',
    maxHeight: '85vh',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  modalClose: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'rgba(0, 0, 0, 0.5)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    padding: '8px',
    color: '#fff',
    cursor: 'pointer',
    zIndex: 10
  },
  modalImage: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    position: 'relative'
  },
  modalImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  modalBody: {
    padding: '20px',
    overflowY: 'auto'
  },
  modalTitle: {
    fontSize: '22px',
    fontWeight: 700,
    marginBottom: '4px'
  },
  modalMuscles: {
    fontSize: '14px',
    color: 'var(--accent-orange)',
    marginBottom: '20px',
    fontWeight: 500
  },
  modalSection: {
    marginBottom: '20px'
  },
  modalSectionTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px'
  },
  modalDescription: {
    fontSize: '15px',
    color: 'var(--text-primary)',
    lineHeight: 1.6
  },
  modalTips: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  modalTip: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
    lineHeight: 1.5
  },
  tipBullet: {
    color: 'var(--accent-orange)',
    fontWeight: 700
  },
  modalSource: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-subtle)'
  },
  sourceLink: {
    color: 'var(--accent-cyan)',
    textDecoration: 'none'
  }
}

export default ActiveWorkout
