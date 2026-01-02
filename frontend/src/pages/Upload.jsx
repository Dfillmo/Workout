import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload as UploadIcon, FileText, Check, X, ChevronLeft, Loader } from 'lucide-react'

function Upload() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  const [file, setFile] = useState(null)
  const [planName, setPlanName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (selectedFile) => {
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file')
      return
    }
    setFile(selectedFile)
    setError(null)
    setResult(null)
  }

  const handleUpload = async () => {
    if (!file) return
    
    setUploading(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('file', file)
    if (planName.trim()) {
      formData.append('plan_name', planName.trim())
    }
    
    try {
      const res = await fetch('/api/plans/upload', {
        method: 'POST',
        body: formData
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setResult(data)
      } else {
        setError(data.detail || 'Upload failed')
      }
    } catch (err) {
      setError('Failed to upload file. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const resetUpload = () => {
    setFile(null)
    setPlanName('')
    setResult(null)
    setError(null)
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={styles.title}>Import Workout</h1>
        <div style={styles.headerRight} />
      </header>

      <div style={styles.content}>
        {/* Success State */}
        {result && (
          <div style={styles.successCard} className="animate-slide-up">
            <div style={styles.successIcon}>
              <Check size={32} color="#4ade80" />
            </div>
            <h2 style={styles.successTitle}>Upload Successful!</h2>
            <p style={styles.successMessage}>{result.message}</p>
            
            <div style={styles.successStats}>
              <div style={styles.successStat}>
                <span style={styles.successStatValue}>{result.workout_days_count}</span>
                <span style={styles.successStatLabel}>Workout Days</span>
              </div>
              <div style={styles.successStat}>
                <span style={styles.successStatValue}>{result.exercises_count}</span>
                <span style={styles.successStatLabel}>Exercises</span>
              </div>
            </div>
            
            <div style={styles.successActions}>
              <button 
                style={styles.primaryBtn}
                onClick={() => navigate('/workouts')}
              >
                View Workouts
              </button>
              <button 
                style={styles.secondaryBtn}
                onClick={resetUpload}
              >
                Upload Another
              </button>
            </div>
          </div>
        )}

        {/* Upload Form */}
        {!result && (
          <>
            <div style={styles.infoCard}>
              <h2 style={styles.infoTitle}>Upload your workout PDF</h2>
              <p style={styles.infoText}>
                We'll extract all exercises, sets, reps, and organize them into circuits
                for easy tracking during your workout.
              </p>
            </div>

            {/* Drop Zone */}
            <div
              style={{
                ...styles.dropZone,
                ...(dragActive ? styles.dropZoneActive : {}),
                ...(file ? styles.dropZoneWithFile : {})
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
              
              {file ? (
                <div style={styles.filePreview}>
                  <FileText size={40} color="var(--accent-orange)" />
                  <div style={styles.fileInfo}>
                    <p style={styles.fileName}>{file.name}</p>
                    <p style={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    style={styles.removeFileBtn}
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <div style={styles.uploadIconWrapper}>
                    <UploadIcon size={32} color="var(--accent-orange)" />
                  </div>
                  <p style={styles.dropText}>
                    Drop your PDF here or <span style={styles.browseText}>browse</span>
                  </p>
                  <p style={styles.dropHint}>Supports workout PDFs with exercises, sets, and reps</p>
                </>
              )}
            </div>

            {/* Plan Name Input */}
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Workout Plan Name (optional)</label>
              <input
                type="text"
                placeholder="e.g., 12 Week Strength Program"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                style={styles.input}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div style={styles.errorCard}>
                <X size={18} color="var(--accent-red)" />
                <p>{error}</p>
              </div>
            )}

            {/* Upload Button */}
            <button
              style={{
                ...styles.uploadBtn,
                ...((!file || uploading) ? styles.uploadBtnDisabled : {})
              }}
              disabled={!file || uploading}
              onClick={handleUpload}
            >
              {uploading ? (
                <>
                  <Loader size={20} className="animate-pulse" />
                  <span>Processing PDF...</span>
                </>
              ) : (
                <>
                  <UploadIcon size={20} />
                  <span>Upload & Parse</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    paddingTop: 'max(16px, env(safe-area-inset-top))'
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
    width: '40px'
  },
  content: {
    padding: '0 20px 40px',
    maxWidth: '500px',
    margin: '0 auto'
  },
  infoCard: {
    marginBottom: '24px'
  },
  infoTitle: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '8px'
  },
  infoText: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    lineHeight: 1.6
  },
  dropZone: {
    border: '2px dashed var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: '40px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '20px'
  },
  dropZoneActive: {
    borderColor: 'var(--accent-orange)',
    background: 'rgba(255, 107, 53, 0.05)'
  },
  dropZoneWithFile: {
    borderStyle: 'solid',
    borderColor: 'var(--accent-orange)',
    padding: '20px 24px'
  },
  uploadIconWrapper: {
    width: '72px',
    height: '72px',
    borderRadius: 'var(--radius-full)',
    background: 'rgba(255, 107, 53, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px'
  },
  dropText: {
    fontSize: '16px',
    color: 'var(--text-primary)',
    marginBottom: '8px'
  },
  browseText: {
    color: 'var(--accent-orange)',
    fontWeight: 600
  },
  dropHint: {
    fontSize: '13px',
    color: 'var(--text-muted)'
  },
  filePreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  fileInfo: {
    flex: 1,
    textAlign: 'left'
  },
  fileName: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '2px'
  },
  fileSize: {
    fontSize: '13px',
    color: 'var(--text-secondary)'
  },
  removeFileBtn: {
    background: 'var(--bg-elevated)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    padding: '8px',
    cursor: 'pointer',
    color: 'var(--text-muted)'
  },
  inputGroup: {
    marginBottom: '24px'
  },
  inputLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '15px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  },
  errorCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: 'var(--radius-md)',
    marginBottom: '20px',
    color: 'var(--accent-red)',
    fontSize: '14px'
  },
  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    padding: '16px',
    background: 'var(--accent-orange)',
    border: 'none',
    borderRadius: 'var(--radius-lg)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease'
  },
  uploadBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  successCard: {
    textAlign: 'center',
    padding: '40px 24px'
  },
  successIcon: {
    width: '72px',
    height: '72px',
    borderRadius: 'var(--radius-full)',
    background: 'rgba(74, 222, 128, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px'
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '8px'
  },
  successMessage: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    marginBottom: '24px'
  },
  successStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    marginBottom: '32px'
  },
  successStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  successStatValue: {
    fontSize: '32px',
    fontWeight: 700,
    color: 'var(--accent-orange)'
  },
  successStatLabel: {
    fontSize: '13px',
    color: 'var(--text-secondary)'
  },
  successActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  primaryBtn: {
    padding: '16px',
    background: 'var(--accent-orange)',
    border: 'none',
    borderRadius: 'var(--radius-lg)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  secondaryBtn: {
    padding: '16px',
    background: 'transparent',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    color: 'var(--text-primary)',
    fontSize: '16px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit'
  }
}

export default Upload

