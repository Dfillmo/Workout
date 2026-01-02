import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Dumbbell, Filter, Clock, Zap, Trash2 } from 'lucide-react'

function WorkoutList() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState([])
  const [days, setDays] = useState([])
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [plansRes, daysRes] = await Promise.all([
        fetch('/api/plans'),
        fetch('/api/days')
      ])
      const plansData = await plansRes.json()
      const daysData = await daysRes.json()
      setPlans(plansData)
      setDays(daysData)
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePlan = async (planId, e) => {
    e.stopPropagation()
    if (!confirm('Delete this workout plan?')) return
    
    try {
      await fetch(`/api/plans/${planId}`, { method: 'DELETE' })
      setPlans(plans.filter(p => p.id !== planId))
      setDays(days.filter(d => d.plan_id !== planId))
    } catch (err) {
      console.error('Failed to delete plan:', err)
    }
  }

  const filteredDays = days.filter(day => {
    if (selectedPlan) {
      return day.plan_id === selectedPlan
    }
    if (filter === 'all') return true
    
    const muscleGroups = (day.muscle_groups || '').toLowerCase()
    switch (filter) {
      case 'upper': return muscleGroups.includes('chest') || muscleGroups.includes('back') || 
                           muscleGroups.includes('shoulder') || muscleGroups.includes('arm')
      case 'lower': return muscleGroups.includes('leg') || muscleGroups.includes('glute')
      case 'core': return muscleGroups.includes('ab') || muscleGroups.includes('core')
      default: return true
    }
  })

  const muscleGroupColors = {
    'chest': '#ff6b35',
    'back': '#4ade80',
    'arms': '#b366ff',
    'biceps': '#b366ff',
    'triceps': '#b366ff',
    'shoulders': '#fbbf24',
    'legs': '#3b82f6',
    'glutes': '#ec4899',
    'abs': '#06b6d4',
    'core': '#06b6d4'
  }

  const getMuscleColor = (muscleGroups) => {
    if (!muscleGroups) return 'var(--accent-orange)'
    const lower = muscleGroups.toLowerCase()
    for (const [muscle, color] of Object.entries(muscleGroupColors)) {
      if (lower.includes(muscle)) return color
    }
    return 'var(--accent-orange)'
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={styles.title}>Workouts</h1>
        <div style={styles.headerRight}>
          <button style={styles.filterBtn}>
            <Filter size={20} />
          </button>
        </div>
      </header>

      {/* Plan Tabs */}
      {plans.length > 0 && (
        <div style={styles.planTabs}>
          <button
            style={{
              ...styles.planTab,
              ...(selectedPlan === null ? styles.planTabActive : {})
            }}
            onClick={() => setSelectedPlan(null)}
          >
            All
          </button>
          {plans.map(plan => (
            <button
              key={plan.id}
              style={{
                ...styles.planTab,
                ...(selectedPlan === plan.id ? styles.planTabActive : {})
              }}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.name}
            </button>
          ))}
        </div>
      )}

      {/* Filter Pills */}
      <div style={styles.filterPills}>
        {['all', 'upper', 'lower', 'core'].map(f => (
          <button
            key={f}
            style={{
              ...styles.filterPill,
              ...(filter === f ? styles.filterPillActive : {})
            }}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Workout Days */}
      <div style={styles.daysList}>
        {loading ? (
          <div style={styles.loading}>Loading workouts...</div>
        ) : filteredDays.length === 0 ? (
          <div style={styles.empty}>
            <Dumbbell size={48} color="var(--text-muted)" />
            <p>No workouts found</p>
            <button 
              style={styles.uploadBtn}
              onClick={() => navigate('/upload')}
            >
              Upload Workout PDF
            </button>
          </div>
        ) : (
          filteredDays.map((day, index) => (
            <div
              key={day.id}
              style={{
                ...styles.dayCard,
                borderColor: getMuscleColor(day.muscle_groups),
                animationDelay: `${index * 0.05}s`
              }}
              className="animate-slide-up"
              onClick={() => navigate(`/workouts/${day.id}`)}
            >
              <div style={styles.dayCardLeft}>
                <div style={{
                  ...styles.dayIcon,
                  background: `${getMuscleColor(day.muscle_groups)}20`
                }}>
                  <Dumbbell size={22} color={getMuscleColor(day.muscle_groups)} />
                </div>
                <div style={styles.dayInfo}>
                  <h3 style={styles.dayName}>{day.name}</h3>
                  <div style={styles.dayMeta}>
                    <span style={styles.metaItem}>
                      <Zap size={12} />
                      {day.circuit_count} circuits
                    </span>
                    <span style={styles.metaItem}>
                      <Clock size={12} />
                      {day.exercise_count} exercises
                    </span>
                  </div>
                  {day.muscle_groups && (
                    <div style={styles.muscleTag}>
                      {day.muscle_groups}
                    </div>
                  )}
                </div>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </div>
          ))
        )}
      </div>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 'max(16px, env(safe-area-inset-top))',
    marginBottom: '20px'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    padding: '8px',
    marginLeft: '-8px'
  },
  title: {
    fontSize: '20px',
    fontWeight: 700
  },
  headerRight: {
    display: 'flex',
    gap: '8px'
  },
  filterBtn: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    padding: '8px',
    cursor: 'pointer'
  },
  planTabs: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '8px',
    marginBottom: '16px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none'
  },
  planTab: {
    flexShrink: 0,
    padding: '10px 18px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-full)',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease'
  },
  planTabActive: {
    background: 'var(--accent-orange)',
    borderColor: 'var(--accent-orange)',
    color: '#fff'
  },
  filterPills: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px'
  },
  filterPill: {
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-full)',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease'
  },
  filterPillActive: {
    background: 'var(--bg-elevated)',
    borderColor: 'var(--text-secondary)',
    color: 'var(--text-primary)'
  },
  daysList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  dayCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    borderLeft: '3px solid',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  dayCardLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  dayIcon: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dayInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  dayName: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)'
  },
  dayMeta: {
    display: 'flex',
    gap: '12px'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: 'var(--text-secondary)'
  },
  muscleTag: {
    fontSize: '12px',
    color: 'var(--accent-orange)',
    fontWeight: 500,
    marginTop: '2px'
  },
  loading: {
    textAlign: 'center',
    padding: '48px 24px',
    color: 'var(--text-secondary)'
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center',
    gap: '16px'
  },
  uploadBtn: {
    padding: '12px 24px',
    background: 'var(--accent-orange)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit'
  }
}

export default WorkoutList

