import React from 'react'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
  return (
    <div className="flex-center h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted mb-6">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-block bg-accent-blue text-primary px-6 py-2 border-radius hover:bg-opacity-80 transition-normal"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound