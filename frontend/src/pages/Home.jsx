import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Flame, Clock, Trophy, ChevronRight, Dumbbell, Sparkles, 
  FileText, Calendar, ChevronDown, Trash2, Check, Circle,
  Play, X, ChevronUp
} from 'lucide-react'

function Home({ stats, onStatsUpdate }) {
  const navigate = useNavigate()
  const [plans, setPlans] = useState([])
  const [recentDays, setRecentDays] = useState([])
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('')
  const [showPlanSelector, setShowPlanSelector] = useState(false)
  
  // Today's workout state
  const [todaysWorkout, setTodaysWorkout] = useState(null)
  const [todaysWorkoutDetails, setTodaysWorkoutDetails] = useState(null)
  const [completedExercises, setCompletedExercises] = useState({})
  const [showTodayPicker, setShowTodayPicker] = useState(false)
  const [expandedToday, setExpandedToday] = useState(true)

  const handleDeletePlan = async (planId, e) => {
    e.stopPropagation()
    if (!confirm('Delete this program? You can re-upload it later.')) return
    
    try {
      await fetch(`/api/plans/${planId}`, { method: 'DELETE' })
      const newPlans = plans.filter(p => p.id !== planId)
      setPlans(newPlans)
      setRecentDays(recentDays.filter(d => d.plan_id !== planId))
      if (selectedPlan?.id === planId) {
        setSelectedPlan(newPlans[0] || null)
      }
      if (todaysWorkout?.plan_id === planId) {
        setTodaysWorkout(null)
        setTodaysWorkoutDetails(null)
        localStorage.removeItem('todaysWorkout')
      }
    } catch (err) {
      console.error('Failed to delete plan:', err)
    }
  }

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    // Load today's workout from localStorage
    const saved = localStorage.getItem('todaysWorkout')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Check if it's still today
      const savedDate = new Date(parsed.date).toDateString()
      const today = new Date().toDateString()
      if (savedDate === today) {
        setTodaysWorkout(parsed.workout)
        setCompletedExercises(parsed.completed || {})
      } else {
        // New day, clear it
        localStorage.removeItem('todaysWorkout')
      }
    }

    fetchData()
  }, [])

  // Fetch workout details when today's workout is set
  useEffect(() => {
    if (todaysWorkout?.id) {
      fetchTodaysWorkoutDetails(todaysWorkout.id)
    }
  }, [todaysWorkout?.id])

  const fetchData = async () => {
    try {
      const [plansRes, daysRes] = await Promise.all([
        fetch('/api/plans'),
        fetch('/api/days')
      ])
      const plansData = await plansRes.json()
      const daysData = await daysRes.json()
      setPlans(plansData)
      setRecentDays(daysData)
      
      // Select first plan by default
      if (plansData.length > 0 && !selectedPlan) {
        setSelectedPlan(plansData[0])
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTodaysWorkoutDetails = async (dayId) => {
    try {
      const res = await fetch(`/api/days/${dayId}`)
      const data = await res.json()
      setTodaysWorkoutDetails(data)
    } catch (err) {
      console.error('Failed to fetch workout details:', err)
    }
  }

  const setAsToday = (day) => {
    setTodaysWorkout(day)
    setCompletedExercises({})
    setShowTodayPicker(false)
    localStorage.setItem('todaysWorkout', JSON.stringify({
      date: new Date().toISOString(),
      workout: day,
      completed: {}
    }))
  }

  const clearTodaysWorkout = () => {
    setTodaysWorkout(null)
    setTodaysWorkoutDetails(null)
    setCompletedExercises({})
    localStorage.removeItem('todaysWorkout')
  }

  const toggleExercise = (exerciseId) => {
    const newCompleted = {
      ...completedExercises,
      [exerciseId]: !completedExercises[exerciseId]
    }
    setCompletedExercises(newCompleted)
    
    // Save to localStorage
    localStorage.setItem('todaysWorkout', JSON.stringify({
      date: new Date().toISOString(),
      workout: todaysWorkout,
      completed: newCompleted
    }))
  }

  const getTotalExercises = () => {
    if (!todaysWorkoutDetails?.circuits) return 0
    return todaysWorkoutDetails.circuits.reduce((sum, c) => sum + c.exercises.length, 0)
  }

  const getCompletedCount = () => {
    return Object.values(completedExercises).filter(Boolean).length
  }

  const getProgress = () => {
    const total = getTotalExercises()
    if (total === 0) return 0
    return Math.round((getCompletedCount() / total) * 100)
  }

  const filteredDays = selectedPlan 
    ? recentDays.filter(d => d.plan_id === selectedPlan.id || !d.plan_id)
    : recentDays

  const formatStreak = (streak) => {
    if (!streak) return "Start your fitness journey today"
    if (streak === 1) return "1 day streak! Keep it up!"
    if (streak < 7) return `${streak}-day streak! You're on fire!`
    if (streak < 30) return `${streak}-day streak! Incredible!`
    return `${streak}-day streak! You're a legend!`
  }

  const startTodaysWorkout = async () => {
    if (!todaysWorkout) return
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workout_day_id: todaysWorkout.id })
      })
      const session = await res.json()
      navigate(`/workout/${session.id}`)
    } catch (err) {
      console.error('Failed to start session:', err)
    }
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.greetingSection}>
          <p style={styles.greeting}>{greeting} 💪</p>
          <h1 style={styles.title}>Ready to train?</h1>
          <p style={styles.subtitle}>{formatStreak(stats?.current_streak)}</p>
        </div>
      </header>

      {/* Stats Cards */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <div style={{...styles.statCard, background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)'}}>
            <div style={styles.statIcon}>
              <Trophy size={20} />
            </div>
            <span style={styles.statValue}>{stats?.total_workouts || 0}</span>
            <span style={styles.statLabel}>Workouts</span>
          </div>
          
          <div style={{...styles.statCard, background: 'linear-gradient(135deg, #b366ff 0%, #d399ff 100%)'}}>
            <div style={styles.statIcon}>
              <Clock size={20} />
            </div>
            <span style={styles.statValue}>{stats?.total_workout_minutes || 0}</span>
            <span style={styles.statLabel}>Minutes</span>
          </div>
          
          <div style={{...styles.statCard, background: 'linear-gradient(135deg, #4ade80 0%, #86efac 100%)'}}>
            <div style={styles.statIcon}>
              <Flame size={20} />
            </div>
            <span style={styles.statValue}>{stats?.current_streak || 0}</span>
            <span style={styles.statLabel}>Day Streak</span>
          </div>
        </div>
      </section>

      {/* Today's Workout Section */}
      <section style={styles.todaySection}>
        <div style={styles.todayHeader}>
          <div style={styles.todayTitleRow}>
            <h2 style={styles.todaySectionTitle}>
              <Calendar size={20} color="var(--accent-orange)" />
              Today's Workout
            </h2>
            <button 
              style={styles.expandBtn}
              onClick={() => setExpandedToday(!expandedToday)}
            >
              {expandedToday ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          
          {todaysWorkout && (
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}>
                <div style={{...styles.progressFill, width: `${getProgress()}%`}} />
              </div>
              <span style={styles.progressText}>
                {getCompletedCount()}/{getTotalExercises()} exercises
              </span>
            </div>
          )}
        </div>

        {expandedToday && (
          <>
            {!todaysWorkout ? (
              <div style={styles.selectTodayCard}>
                <p style={styles.selectTodayText}>Select today's workout to track your exercises</p>
                <button 
                  style={styles.selectTodayBtn}
                  onClick={() => setShowTodayPicker(true)}
                >
                  <Dumbbell size={18} />
                  Choose Workout
                </button>
              </div>
            ) : (
              <div style={styles.todayCard}>
                <div style={styles.todayCardHeader}>
                  <div style={styles.todayCardInfo}>
                    <span style={styles.todayDayBadge}>Day {todaysWorkout.day_number}</span>
                    <h3 style={styles.todayCardTitle}>{todaysWorkout.name}</h3>
                    {todaysWorkout.muscle_groups && (
                      <span style={styles.todayMuscles}>{todaysWorkout.muscle_groups}</span>
                    )}
                  </div>
                  <button style={styles.clearTodayBtn} onClick={clearTodaysWorkout}>
                    <X size={18} />
                  </button>
                </div>

                {/* Exercise Checklist */}
                {todaysWorkoutDetails?.circuits?.map((circuit, ci) => (
                  <div key={circuit.id} style={styles.circuitSection}>
                    <div style={styles.circuitHeader}>
                      <span style={styles.circuitName}>{circuit.name || `Circuit ${ci + 1}`}</span>
                      <span style={styles.circuitRounds}>{circuit.rounds} rounds</span>
                    </div>
                    
                    <div style={styles.exerciseChecklist}>
                      {circuit.exercises.map((exercise) => {
                        const isCompleted = completedExercises[exercise.id]
                        return (
                          <button
                            key={exercise.id}
                            style={{
                              ...styles.exerciseCheckItem,
                              ...(isCompleted ? styles.exerciseCheckItemCompleted : {})
                            }}
                            onClick={() => toggleExercise(exercise.id)}
                          >
                            <div style={{
                              ...styles.checkbox,
                              ...(isCompleted ? styles.checkboxCompleted : {})
                            }}>
                              {isCompleted ? <Check size={14} /> : null}
                            </div>
                            <div style={styles.exerciseCheckInfo}>
                              <span style={{
                                ...styles.exerciseCheckName,
                                ...(isCompleted ? styles.exerciseCheckNameCompleted : {})
                              }}>
                                {exercise.name}
                              </span>
                              <span style={styles.exerciseCheckMeta}>
                                {exercise.sets} sets × {exercise.reps} reps
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {/* Start Workout Button */}
                <button style={styles.startWorkoutBtn} onClick={startTodaysWorkout}>
                  <Play size={20} />
                  Start Guided Workout
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Workout Picker Modal */}
      {showTodayPicker && (
        <div style={styles.modal} onClick={() => setShowTodayPicker(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Select Today's Workout</h3>
              <button style={styles.modalClose} onClick={() => setShowTodayPicker(false)}>
                <X size={24} />
              </button>
            </div>
            <div style={styles.modalList}>
              {recentDays.map(day => (
                <button
                  key={day.id}
                  style={styles.modalItem}
                  onClick={() => setAsToday(day)}
                >
                  <div style={styles.modalItemInfo}>
                    <span style={styles.modalItemBadge}>Day {day.day_number}</span>
                    <span style={styles.modalItemName}>{day.name}</span>
                    <span style={styles.modalItemMeta}>
                      {day.exercise_count} exercises • {day.circuit_count} circuits
                    </span>
                  </div>
                  <ChevronRight size={20} color="var(--text-muted)" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Program Selector */}
      {plans.length > 0 && (
        <section style={styles.section}>
          <div style={styles.programSelector}>
            <button 
              style={styles.programBtn}
              onClick={() => setShowPlanSelector(!showPlanSelector)}
            >
              <div style={styles.programBtnLeft}>
                <FileText size={18} color="var(--accent-orange)" />
                <div>
                  <p style={styles.programLabel}>ACTIVE PROGRAM</p>
                  <p style={styles.programName}>{selectedPlan?.name || 'Select a program'}</p>
                </div>
              </div>
              <ChevronDown 
                size={20} 
                color="var(--text-muted)"
                style={{ transform: showPlanSelector ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
              />
            </button>
            
            {showPlanSelector && (
              <div style={styles.programDropdown}>
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    style={{
                      ...styles.programOption,
                      ...(selectedPlan?.id === plan.id ? styles.programOptionActive : {})
                    }}
                    onClick={() => {
                      setSelectedPlan(plan)
                      setShowPlanSelector(false)
                    }}
                  >
                    <div style={styles.programOptionInfo}>
                      <span style={styles.programOptionName}>{plan.name}</span>
                      <span style={styles.programOptionMeta}>{plan.day_count} workout days</span>
                    </div>
                    <div style={styles.programOptionActions}>
                      {selectedPlan?.id === plan.id && (
                        <div style={styles.activeIndicator} />
                      )}
                      <button 
                        style={styles.deleteBtn}
                        onClick={(e) => handleDeletePlan(plan.id, e)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Quick Start</h2>
        <div style={styles.quickActions}>
          <button 
            style={styles.primaryAction}
            onClick={() => navigate('/workouts')}
          >
            <Dumbbell size={24} />
            <span>Browse Workouts</span>
            <ChevronRight size={20} />
          </button>
          
          <button 
            style={styles.secondaryAction}
            onClick={() => navigate('/upload')}
          >
            <Sparkles size={24} />
            <span>Import New Program</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* Today's Workouts / Suggested */}
      {filteredDays.length > 0 && (
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>All Workouts</h2>
            <button 
              style={styles.viewAllBtn}
              onClick={() => navigate('/workouts')}
            >
              View All
            </button>
          </div>
          
          <div style={styles.workoutList}>
            {filteredDays.slice(0, 4).map((day, index) => (
              <div 
                key={day.id} 
                style={{
                  ...styles.workoutCard,
                  animationDelay: `${index * 0.05}s`
                }}
                className="animate-slide-up"
                onClick={() => navigate(`/workouts/${day.id}`)}
              >
                <div style={styles.workoutCardContent}>
                  <div style={styles.workoutDayBadge}>
                    <Calendar size={12} />
                    <span>Day {day.day_number}</span>
                  </div>
                  <div style={styles.workoutInfo}>
                    <h3 style={styles.workoutName}>{day.name}</h3>
                    <p style={styles.workoutMeta}>
                      {day.circuit_count} circuits • {day.exercise_count} exercises
                    </p>
                    {day.muscle_groups && (
                      <p style={styles.muscleGroups}>{day.muscle_groups}</p>
                    )}
                  </div>
                </div>
                <div style={styles.workoutActions}>
                  <button 
                    style={styles.setTodayMiniBtn}
                    onClick={(e) => {
                      e.stopPropagation()
                      setAsToday(day)
                    }}
                  >
                    Set as Today
                  </button>
                  <ChevronRight size={20} color="var(--text-muted)" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && plans.length === 0 && (
        <section style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <Dumbbell size={48} color="var(--text-muted)" />
          </div>
          <h3 style={styles.emptyTitle}>No programs yet</h3>
          <p style={styles.emptyText}>
            Upload a workout PDF to get started with your training program.
          </p>
          <button 
            style={styles.emptyAction}
            onClick={() => navigate('/upload')}
          >
            Import Workout PDF
          </button>
        </section>
      )}

      {/* Multiple Programs Info */}
      {plans.length > 1 && (
        <section style={styles.multiProgramInfo}>
          <div style={styles.infoBadge}>
            <FileText size={14} />
            <span>You have {plans.length} programs loaded</span>
          </div>
        </section>
      )}
    </div>
  )
}

const styles = {
  container: {
    padding: '0 20px 20px',
    maxWidth: '500px',
    margin: '0 auto'
  },
  header: {
    paddingTop: 'max(20px, env(safe-area-inset-top))',
    marginBottom: '24px'
  },
  greetingSection: {
    marginBottom: '8px'
  },
  greeting: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginBottom: '4px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    marginBottom: '4px',
    background: 'linear-gradient(135deg, #ffffff 0%, #9ca3af 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--accent-orange)'
  },
  statsSection: {
    marginBottom: '24px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px'
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 12px',
    borderRadius: 'var(--radius-lg)',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden'
  },
  statIcon: {
    marginBottom: '8px',
    opacity: 0.9
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: 1
  },
  statLabel: {
    fontSize: '11px',
    fontWeight: 500,
    opacity: 0.9,
    marginTop: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  
  // Today's Workout Section
  todaySection: {
    marginBottom: '24px',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--accent-orange)',
    overflow: 'hidden'
  },
  todayHeader: {
    padding: '16px',
    borderBottom: '1px solid var(--border-subtle)'
  },
  todayTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  todaySectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '16px',
    fontWeight: 700
  },
  expandBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px'
  },
  progressContainer: {
    marginTop: '12px'
  },
  progressBar: {
    height: '6px',
    background: 'var(--bg-elevated)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    marginBottom: '6px'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent-orange) 0%, var(--accent-green) 100%)',
    borderRadius: 'var(--radius-full)',
    transition: 'width 0.3s ease'
  },
  progressText: {
    fontSize: '12px',
    color: 'var(--text-secondary)'
  },
  selectTodayCard: {
    padding: '24px 16px',
    textAlign: 'center'
  },
  selectTodayText: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginBottom: '16px'
  },
  selectTodayBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'var(--accent-orange)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  todayCard: {
    padding: '16px'
  },
  todayCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  todayCardInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  todayDayBadge: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--accent-purple)',
    background: 'rgba(179, 102, 255, 0.15)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    width: 'fit-content'
  },
  todayCardTitle: {
    fontSize: '18px',
    fontWeight: 700,
    marginTop: '4px'
  },
  todayMuscles: {
    fontSize: '13px',
    color: 'var(--accent-orange)'
  },
  clearTodayBtn: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    padding: '8px',
    color: 'var(--text-muted)',
    cursor: 'pointer'
  },
  circuitSection: {
    marginBottom: '16px'
  },
  circuitHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
    paddingBottom: '8px',
    borderBottom: '1px solid var(--border-subtle)'
  },
  circuitName: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  circuitRounds: {
    fontSize: '12px',
    color: 'var(--accent-cyan)',
    background: 'rgba(34, 211, 238, 0.1)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)'
  },
  exerciseChecklist: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  exerciseCheckItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'left',
    transition: 'all 0.2s ease'
  },
  exerciseCheckItemCompleted: {
    background: 'rgba(74, 222, 128, 0.1)',
    borderColor: 'var(--accent-green)'
  },
  checkbox: {
    width: '24px',
    height: '24px',
    borderRadius: 'var(--radius-sm)',
    border: '2px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s ease'
  },
  checkboxCompleted: {
    background: 'var(--accent-green)',
    borderColor: 'var(--accent-green)',
    color: '#fff'
  },
  exerciseCheckInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  exerciseCheckName: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)'
  },
  exerciseCheckNameCompleted: {
    textDecoration: 'line-through',
    color: 'var(--text-muted)'
  },
  exerciseCheckMeta: {
    fontSize: '12px',
    color: 'var(--text-muted)'
  },
  startWorkoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    padding: '14px',
    background: 'var(--accent-orange)',
    border: 'none',
    borderRadius: 'var(--radius-lg)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginTop: '16px'
  },
  
  // Modal
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 200,
    padding: '20px'
  },
  modalContent: {
    width: '100%',
    maxWidth: '500px',
    maxHeight: '70vh',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border-subtle)'
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 700
  },
  modalClose: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px'
  },
  modalList: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px'
  },
  modalItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '14px',
    background: 'var(--bg-elevated)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'left',
    marginBottom: '8px'
  },
  modalItemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  modalItemBadge: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--accent-purple)'
  },
  modalItemName: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--text-primary)'
  },
  modalItemMeta: {
    fontSize: '12px',
    color: 'var(--text-muted)'
  },
  
  section: {
    marginBottom: '24px'
  },
  programSelector: {
    position: 'relative'
  },
  programBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '14px 16px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  programBtnLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  programLabel: {
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    letterSpacing: '0.5px',
    textAlign: 'left',
    marginBottom: '2px'
  },
  programName: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    textAlign: 'left'
  },
  programDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '8px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    zIndex: 50,
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
  },
  programOption: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '14px 16px',
    background: 'none',
    borderBottom: '1px solid var(--border-subtle)',
    cursor: 'pointer',
    textAlign: 'left'
  },
  programOptionActive: {
    background: 'rgba(255, 107, 53, 0.1)'
  },
  programOptionInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  programOptionName: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)'
  },
  programOptionMeta: {
    fontSize: '12px',
    color: 'var(--text-muted)'
  },
  programOptionActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  activeIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--accent-orange)'
  },
  deleteBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '6px',
    color: 'var(--accent-red)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--text-primary)'
  },
  viewAllBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent-orange)',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer'
  },
  quickActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  primaryAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '18px 20px',
    background: 'var(--accent-orange)',
    border: 'none',
    borderRadius: 'var(--radius-lg)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit'
  },
  secondaryAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '18px 20px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    color: 'var(--text-primary)',
    fontSize: '16px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit'
  },
  workoutList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  workoutCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  workoutCardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1
  },
  workoutActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  setTodayMiniBtn: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--accent-orange)',
    background: 'rgba(255, 107, 53, 0.1)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    padding: '6px 12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap'
  },
  workoutDayBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--accent-purple)',
    background: 'rgba(179, 102, 255, 0.15)',
    padding: '4px 8px',
    borderRadius: 'var(--radius-full)',
    width: 'fit-content'
  },
  workoutInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  workoutName: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--text-primary)'
  },
  workoutMeta: {
    fontSize: '13px',
    color: 'var(--text-secondary)'
  },
  muscleGroups: {
    fontSize: '12px',
    color: 'var(--accent-orange)',
    fontWeight: 500
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center'
  },
  emptyIcon: {
    marginBottom: '16px',
    opacity: 0.5
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '8px'
  },
  emptyText: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginBottom: '24px',
    maxWidth: '280px'
  },
  emptyAction: {
    padding: '14px 28px',
    background: 'var(--accent-orange)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  multiProgramInfo: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '8px'
  },
  infoBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: 'var(--text-muted)',
    background: 'var(--bg-card)',
    padding: '8px 14px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--border-subtle)'
  }
}

export default Home
