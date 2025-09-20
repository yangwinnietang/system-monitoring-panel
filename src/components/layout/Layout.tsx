import React, { Suspense, useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { UI_SETTINGS } from '@/constants'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface LayoutProps {
  children?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="app relative">
      {/* Header */}
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-overlay-color z-40 transition-normal"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex" style={{ height: `calc(100vh - ${UI_SETTINGS.LAYOUT.HEADER_HEIGHT}px)` }}>
        {/* Sidebar */}
        <div
          className={`
            ${isMobile ? 'fixed left-0 top-0 h-full z-50 transition-normal transform' : 'relative'}
            ${sidebarOpen ? 'translate-x-0' : isMobile ? '-translate-x-full' : 'translate-x-0'}
          `}
          style={{
            width: isMobile ? 'var(--sidebar-width)' : 'var(--sidebar-width)',
            top: isMobile ? 'var(--header-height)' : '0'
          }}
        >
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden relative">
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default Layout