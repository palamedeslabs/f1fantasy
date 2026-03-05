import React, { useState } from 'react'
import { supabase } from './supabaseClient'

export default function AuthPage() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email for a confirmation link!')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }

    setLoading(false)
  }

  const handleGoogle = async () => {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) setError(error.message)
  }

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#15151e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Formula1', 'Titillium Web', Arial, sans-serif",
      padding: '20px',
    },
    card: {
      background: '#1e1e2e',
      borderRadius: '12px',
      padding: '40px 36px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '32px',
      justifyContent: 'center',
    },
    logoBox: {
      background: '#e10600',
      borderRadius: '6px',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 900,
      color: '#fff',
      fontSize: '16px',
      letterSpacing: '-1px',
    },
    logoText: {
      color: '#fff',
      fontWeight: 800,
      fontSize: '18px',
      letterSpacing: '1px',
    },
    logoSub: {
      color: '#888',
      fontSize: '11px',
      letterSpacing: '2px',
      marginTop: '2px',
    },
    title: {
      color: '#fff',
      fontSize: '22px',
      fontWeight: 700,
      marginBottom: '6px',
      textAlign: 'center',
    },
    subtitle: {
      color: '#888',
      fontSize: '13px',
      textAlign: 'center',
      marginBottom: '28px',
    },
    googleBtn: {
      width: '100%',
      padding: '12px',
      background: '#fff',
      border: 'none',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      fontSize: '14px',
      fontWeight: 600,
      color: '#333',
      cursor: 'pointer',
      marginBottom: '20px',
      transition: 'opacity 0.2s',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: '#333',
    },
    dividerText: {
      color: '#666',
      fontSize: '12px',
      whiteSpace: 'nowrap',
    },
    label: {
      display: 'block',
      color: '#aaa',
      fontSize: '12px',
      fontWeight: 600,
      marginBottom: '6px',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
    input: {
      width: '100%',
      padding: '12px 14px',
      background: '#15151e',
      border: '1px solid #333',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box',
      marginBottom: '16px',
      transition: 'border-color 0.2s',
    },
    submitBtn: {
      width: '100%',
      padding: '13px',
      background: '#e10600',
      border: 'none',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '14px',
      fontWeight: 700,
      cursor: 'pointer',
      letterSpacing: '0.5px',
      marginTop: '4px',
      transition: 'opacity 0.2s',
    },
    error: {
      background: 'rgba(225,6,0,0.15)',
      border: '1px solid rgba(225,6,0,0.4)',
      borderRadius: '8px',
      color: '#ff6b6b',
      fontSize: '13px',
      padding: '10px 14px',
      marginBottom: '16px',
    },
    successMsg: {
      background: 'rgba(39,174,96,0.15)',
      border: '1px solid rgba(39,174,96,0.4)',
      borderRadius: '8px',
      color: '#6dda9e',
      fontSize: '13px',
      padding: '10px 14px',
      marginBottom: '16px',
      textAlign: 'center',
    },
    toggle: {
      textAlign: 'center',
      marginTop: '24px',
      color: '#888',
      fontSize: '13px',
    },
    toggleLink: {
      color: '#e10600',
      cursor: 'pointer',
      fontWeight: 600,
      background: 'none',
      border: 'none',
      fontSize: '13px',
      padding: 0,
      marginLeft: '4px',
    },
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoBox}>F1</div>
          <div>
            <div style={styles.logoText}>FANTASY</div>
            <div style={styles.logoSub}>2026 SEASON</div>
          </div>
        </div>

        <div style={styles.title}>
          {mode === 'signin' ? 'Welcome back' : 'Create account'}
        </div>
        <div style={styles.subtitle}>
          {mode === 'signin'
            ? 'Sign in to your fantasy team'
            : 'Join and build your dream F1 team'}
        </div>

        {/* Google */}
        <button style={styles.googleBtn} onClick={handleGoogle}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.548 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or continue with email</span>
          <div style={styles.dividerLine} />
        </div>

        {/* Error / Success */}
        {error && <div style={styles.error}>{error}</div>}
        {message && <div style={styles.successMsg}>{message}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            onFocus={(e) => (e.target.style.borderColor = '#e10600')}
            onBlur={(e) => (e.target.style.borderColor = '#333')}
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Your password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            onFocus={(e) => (e.target.style.borderColor = '#e10600')}
            onBlur={(e) => (e.target.style.borderColor = '#333')}
          />

          <button
            type="submit"
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle */}
        <div style={styles.toggle}>
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
          <button
            style={styles.toggleLink}
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setMessage(null) }}
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
