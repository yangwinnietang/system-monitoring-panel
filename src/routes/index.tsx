import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

// Layout
const Layout = lazy(() => import('@/components/layout/Layout'))

// Pages
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Tasks = lazy(() => import('@/pages/Tasks'))
const Alerts = lazy(() => import('@/pages/Alerts'))
const Settings = lazy(() => import('@/pages/Settings'))
const NotFound = lazy(() => import('@/pages/NotFound'))


// Error boundary component
const ErrorBoundary = () => (
  <div className="flex-center h-screen">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
      <p className="text-muted">Please try refreshing the page</p>
    </div>
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Dashboard />
      </Layout>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/dashboard',
    element: (
      <Layout>
        <Dashboard />
      </Layout>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/tasks',
    element: (
      <Layout>
        <Tasks />
      </Layout>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/alerts',
    element: (
      <Layout>
        <Alerts />
      </Layout>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/settings',
    element: (
      <Layout>
        <Settings />
      </Layout>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/404',
    element: <NotFound />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
])