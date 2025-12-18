/**
 * 404 Not Found page
 * 
 * Displays when a route doesn't exist
 */

'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '40px',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '72px',
        fontWeight: 700,
        margin: 0,
        color: '#3b82f6'
      }}>
        404
      </h1>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 600,
        marginTop: '16px',
        marginBottom: '8px',
        color: '#1f2937'
      }}>
        Page Not Found
      </h2>
      <p style={{
        fontSize: '16px',
        color: '#6b7280',
        marginBottom: '32px',
        maxWidth: '500px'
      }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#3b82f6',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          fontWeight: 500,
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
      >
        ← Go to Home
      </Link>
    </div>
  )
}

