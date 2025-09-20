import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import Charts from '@/pages/Charts'
import Tasks from '@/pages/Tasks'
import Alerts from '@/pages/Alerts'
import Settings from '@/pages/Settings'
import NotFound from '@/pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/charts',
        element: <Charts />,
      },
      {
        path: '/tasks',
        element: <Tasks />,
      },
      {
        path: '/alerts',
        element: <Alerts />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])