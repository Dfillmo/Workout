import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronDown, ChevronUp, Play, Dumbbell, Clock, Zap, Scale, BookOpen, X } from 'lucide-react'
import { getExerciseInfo } from '../data/exerciseDatabase'

// Exercise muscle group mapping for colors and emojis
const exerciseData = {
  'push up': { color: '#ff6b35', emoji: '🫸' },
  'press': { color: '#ff6b35', emoji: '🏋️' },
  'bench': { color: '#ff6b35', emoji: '🛋️' },
  'chest': { color: '#ff6b35', emoji: '💪' },
  'fly': { color: '#ff6b35', emoji: '🦅' },
  'curl': { color: '#b366ff', emoji: '💪' },
  'bicep': { color: '#b366ff', emoji: '💪' },
  'hammer': { color: '#b366ff', emoji: '🔨' },
  'row': { color: '#4ade80', emoji: '🚣' },
  'pull': { color: '#4ade80', emoji: '🧗' },
  'back': { color: '#4ade80', emoji: '🔙' },
  'lat': { color: '#4ade80', emoji: '🦇' },
  'deadlift': { color: '#ef4444', emoji: '🏋️‍♂️' },
  'squat': { color: '#3b82f6', emoji: '🦵' },
  'leg': { color: '#3b82f6', emoji: '🦵' },
  'lunge': { color: '#3b82f6', emoji: '🚶' },
  'extension': { color: '#ec4899', emoji: '📏' },
  'tricep': { color: '#ec4899', emoji: '💪' },
  'pushdown': { color: '#ec4899', emoji: '⬇️' },
  'dip': { color: '#ec4899', emoji: '⬇️' },
  'shoulder': { color: '#fbbf24', emoji: '🙆' },
  'raise': { color: '#fbbf24', emoji: '🙆' },
  'delt': { color: '#fbbf24', emoji: '🙆' },
  'shrug': { color: '#fbbf24', emoji: '🤷' },
  'ab': { color: '#06b6d4', emoji: '🔄' },
  'crunch': { color: '#06b6d4', emoji: '🔄' },
  'plank': { color: '#06b6d4', emoji: '📏' },
  'cardio': { color: '#22d3ee', emoji: '🏃' },
  'run': { color: '#22d3ee', emoji: '🏃' },
  'muscle up': { color: '#4ade80', emoji: '🧗' },
  'hand stand': { color: '#fbbf24', emoji: '🤸' },
  'l-sit': { color: '#06b6d4', emoji: '🧘' }
}

function getExerciseColor(name) {
  const lower = name.toLowerCase()
  for (const [keyword, data] of Object.entries(exerciseData)) {
    if (lower.includes(keyword)) return data.color
  }
  return '#6b7280'
}

function getExerciseEmoji(name) {
  const lower = name.toLowerCase()
  for (const [keyword, data] of Object.entries(exerciseData)) {
    if (lower.includes(keyword)) return data.emoji
  }
  return '💪'
}

function WorkoutDetail() {
  const { dayId } = useParams()
  const navigate = useNavigate()
  const [workout, setWorkout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedCircuits, setExpandedCircuits] = useState({})
  const [selectedExercise, setSelectedExercise] = useState(null)

  useEffect(() => {
    fetchWorkout()
  }, [dayId])

  const fetchWorkout = async () => {
    try {
      const res = await fetch(`/api/days/${dayId}`)
      const data = await res.json()
      setWorkout(data)
      // Expand all circuits by default
      const expanded = {}
      data.circuits?.forEach((_, idx) => { expanded[idx] = true })
      setExpandedCircuits(expanded)
    } catch (err) {
      console.error('Failed to fetch workout:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleCircuit = (index) => {
    setExpandedCircuits(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const startWorkout = async () => {
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workout_day_id: parseInt(dayId) })
      })
      const session = await res.json()
      navigate(`/workout/${session.id}`)
    } catch (err) {
      console.error('Failed to start workout:', err)
    }
  }

  const getTotalExercises = () => {
    if (!workout?.circuits) return 0
    return workout.circuits.reduce((sum, c) => sum + c.exercises.length, 0)
  }

  const getEstimatedTime = () => {
    const total = getTotalExercises()
    const avgMinutes = total * 3 // ~3 min per exercise
    return `${avgMinutes}-${avgMinutes + 10} min`
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner} />
        <p>Loading workout...</p>
      </div>
    )
  }

  if (!workout) {
    return (
      <div style={styles.errorContainer}>
        <p>Workout not found</p>
        <button onClick={() => navigate('/workouts')} style={styles.backLink}>Back to Workouts</button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/workouts')}>
          <ChevronLeft size={24} />
        </button>
        <div style={styles.headerCenter}>
          <h1 style={styles.title}>{workout.name}</h1>
          {workout.muscle_groups && (
            <p style={styles.muscleGroups}>{workout.muscle_groups}</p>
          )}
        </div>
        <div style={styles.headerRight} />
      </header>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <div style={{...styles.statIcon, background: 'rgba(255, 107, 53, 0.15)'}}>
            <Dumbbell size={16} color="var(--accent-orange)" />
          </div>
          <div style={styles.statText}>
            <span style={styles.statValue}>{getTotalExercises()}</span>
            <span style={styles.statLabel}>Exercises</span>
          </div>
        </div>
        <div style={styles.statItem}>
          <div style={{...styles.statIcon, background: 'rgba(179, 102, 255, 0.15)'}}>
            <Zap size={16} color="var(--accent-purple)" />
          </div>
          <div style={styles.statText}>
            <span style={styles.statValue}>{workout.circuits?.length || 0}</span>
            <span style={styles.statLabel}>Circuits</span>
          </div>
        </div>
        <div style={styles.statItem}>
          <div style={{...styles.statIcon, background: 'rgba(74, 222, 128, 0.15)'}}>
            <Clock size={16} color="var(--accent-green)" />
          </div>
          <div style={styles.statText}>
            <span style={styles.statValue}>{getEstimatedTime()}</span>
            <span style={styles.statLabel}>Est. Time</span>
          </div>
        </div>
      </div>

      {/* Circuits */}
      <div style={styles.circuitsList}>
        {workout.circuits?.map((circuit, index) => (
          <div key={circuit.id} style={styles.circuitCard} className="animate-slide-up">
            <button 
              style={styles.circuitHeader}
              onClick={() => toggleCircuit(index)}
            >
              <div style={styles.circuitHeaderLeft}>
                <span style={styles.circuitNumber}>CIRCUIT {circuit.circuit_number}</span>
                <span style={styles.circuitRounds}>{circuit.rounds} Rounds</span>
              </div>
              {expandedCircuits[index] ? (
                <ChevronUp size={20} color="var(--text-muted)" />
              ) : (
                <ChevronDown size={20} color="var(--text-muted)" />
              )}
            </button>

            {expandedCircuits[index] && (
              <div style={styles.exerciseList}>
                {circuit.exercises.map((exercise, exIndex) => {
                  const color = getExerciseColor(exercise.name)
                  const emoji = getExerciseEmoji(exercise.name)
                  const exerciseInfo = getExerciseInfo(exercise.name)
                  return (
                    <div key={exercise.id} style={styles.exerciseCard}>
                      <div 
                        style={{
                          ...styles.exerciseThumb, 
                          background: exerciseInfo?.image 
                            ? `url(${exerciseInfo.image}) center/cover`
                            : `${color}20`, 
                          borderColor: `${color}40`
                        }}
                        onClick={() => setSelectedExercise({ ...exercise, info: exerciseInfo })}
                      >
                        {!exerciseInfo?.image && <span style={styles.exerciseEmoji}>{emoji}</span>}
                      </div>
                      <div style={styles.exerciseContent}>
                        <h4 style={styles.exerciseName}>{exercise.name}</h4>
                        <div style={styles.exerciseMeta}>
                          <span style={styles.exerciseReps}>
                            {exercise.reps} Reps
                          </span>
                          {exercise.sets && (
                            <span style={styles.exerciseSets}>
                              × {exercise.sets} Sets
                            </span>
                          )}
                        </div>
                        {exerciseInfo?.muscles && (
                          <p style={styles.exerciseMuscles}>{exerciseInfo.muscles}</p>
                        )}
                      </div>
                      <button 
                        style={{...styles.infoBtn, background: `${color}20`, color}}
                        onClick={() => setSelectedExercise({ ...exercise, info: exerciseInfo })}
                      >
                        <BookOpen size={14} />
                      </button>
                    </div>
                  )
                })}
                
                {index < workout.circuits.length - 1 && (
                  <div style={styles.moveToNext}>
                    <ChevronDown size={16} />
                    <span>Move to Next Circuit</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Start Button */}
      <div style={styles.bottomBar}>
        <button style={styles.startButton} onClick={startWorkout}>
          <Play size={22} fill="#fff" />
          <span>START WORKOUT</span>
        </button>
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div style={styles.modal} onClick={() => setSelectedExercise(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setSelectedExercise(null)}>
              <X size={24} />
            </button>
            
            {selectedExercise.info?.image && (
              <div style={styles.modalImage}>
                <img src={selectedExercise.info.image} alt={selectedExercise.name} style={styles.modalImg} />
              </div>
            )}
            
            <div style={styles.modalBody}>
              <h2 style={styles.modalTitle}>{selectedExercise.name}</h2>
              <p style={styles.modalMuscles}>{selectedExercise.info?.muscles}</p>
              
              <div style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>How to Perform</h3>
                <p style={styles.modalDescription}>{selectedExercise.info?.description}</p>
              </div>
              
              <div style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>Key Points</h3>
                <ul style={styles.modalTips}>
                  {selectedExercise.info?.tips?.map((tip, i) => (
                    <li key={i} style={styles.modalTip}>
                      <span style={styles.tipBullet}>•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              
              {selectedExercise.info?.source && (
                <p style={styles.modalSource}>
                  Source: <a href={`https://${selectedExercise.info.source}`} target="_blank" rel="noopener noreferrer" style={styles.sourceLink}>{selectedExercise.info.source}</a>
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
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid var(--bg-elevated)',
    borderTopColor: 'var(--accent-orange)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '16px'
  },
  backLink: {
    color: 'var(--accent-orange)',
    background: 'none',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    paddingTop: 'max(16px, env(safe-area-inset-top))',
    background: 'var(--bg-primary)',
    borderBottom: '1px solid var(--border-subtle)'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    padding: '8px',
    marginLeft: '-8px'
  },
  headerCenter: {
    textAlign: 'center',
    flex: 1
  },
  title: {
    fontSize: '18px',
    fontWeight: 700
  },
  muscleGroups: {
    fontSize: '13px',
    color: 'var(--accent-orange)',
    fontWeight: 500,
    marginTop: '2px'
  },
  headerRight: {
    width: '40px'
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '16px 20px',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-subtle)'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  statIcon: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statText: {
    display: 'flex',
    flexDirection: 'column'
  },
  statValue: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  statLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  circuitsList: {
    padding: '16px 20px'
  },
  circuitCard: {
    marginBottom: '16px',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    border: '1px solid var(--border-subtle)'
  },
  circuitHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '16px',
    background: 'var(--bg-elevated)',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  circuitHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  circuitNumber: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '0.5px'
  },
  circuitRounds: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#fff',
    background: 'var(--accent-orange)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)'
  },
  exerciseList: {
    padding: '8px 16px 16px'
  },
  exerciseCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px 0',
    borderBottom: '1px solid var(--border-subtle)',
    position: 'relative'
  },
  exerciseThumb: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    border: '1px solid',
    cursor: 'pointer'
  },
  exerciseEmoji: {
    fontSize: '24px'
  },
  exerciseMuscles: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '2px'
  },
  infoBtn: {
    border: 'none',
    borderRadius: 'var(--radius-full)',
    padding: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  exerciseContent: {
    flex: 1,
    minWidth: 0
  },
  exerciseName: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '4px'
  },
  exerciseMeta: {
    display: 'flex',
    gap: '8px',
    marginBottom: '4px'
  },
  exerciseReps: {
    fontSize: '13px',
    color: 'var(--accent-orange)',
    fontWeight: 500
  },
  exerciseSets: {
    fontSize: '13px',
    color: 'var(--text-secondary)'
  },
  exerciseWeight: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '4px'
  },
  exerciseNotes: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '4px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '4px',
    fontStyle: 'italic'
  },
  exerciseNumber: {
    width: '24px',
    height: '24px',
    borderRadius: 'var(--radius-full)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 700,
    flexShrink: 0
  },
  moveToNext: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '12px',
    marginTop: '8px',
    color: 'var(--text-muted)',
    fontSize: '12px'
  },
  bottomBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '16px 20px',
    paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
    background: 'var(--accent-orange)',
    zIndex: 100,
    boxShadow: '0 -4px 20px rgba(255, 107, 53, 0.3)'
  },
  startButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    padding: '16px',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 700,
    letterSpacing: '1px',
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
    flexDirection: 'column',
    position: 'relative'
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
    overflow: 'hidden'
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

export default WorkoutDetail
