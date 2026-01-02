import { Outlet, NavLink } from 'react-router-dom'
import { Home, Dumbbell, Upload, User } from 'lucide-react'

function Layout() {
  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <Outlet />
      </main>
      
      <nav style={styles.nav}>
        <NavLink to="/" style={({ isActive }) => ({
          ...styles.navItem,
          color: isActive ? 'var(--accent-orange)' : 'var(--text-muted)'
        })}>
          <Home size={24} />
          <span style={styles.navLabel}>Home</span>
        </NavLink>
        
        <NavLink to="/workouts" style={({ isActive }) => ({
          ...styles.navItem,
          color: isActive ? 'var(--accent-orange)' : 'var(--text-muted)'
        })}>
          <Dumbbell size={24} />
          <span style={styles.navLabel}>Workouts</span>
        </NavLink>
        
        <NavLink to="/upload" style={({ isActive }) => ({
          ...styles.navItem,
          color: isActive ? 'var(--accent-orange)' : 'var(--text-muted)'
        })}>
          <Upload size={24} />
          <span style={styles.navLabel}>Upload</span>
        </NavLink>
        
        <NavLink to="/profile" style={({ isActive }) => ({
          ...styles.navItem,
          color: isActive ? 'var(--accent-orange)' : 'var(--text-muted)'
        })}>
          <User size={24} />
          <span style={styles.navLabel}>Profile</span>
        </NavLink>
      </nav>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'var(--bg-primary)'
  },
  main: {
    flex: 1,
    paddingBottom: '80px',
    overflowY: 'auto'
  },
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    background: 'linear-gradient(to top, var(--bg-primary) 0%, rgba(10, 10, 10, 0.98) 100%)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid var(--border-subtle)',
    padding: '12px 0',
    paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
    zIndex: 100
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    cursor: 'pointer'
  },
  navLabel: {
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.3px'
  }
}

export default Layout

