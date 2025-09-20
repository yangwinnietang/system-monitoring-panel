import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UI_SETTINGS } from '@/constants'
import { useAppStore } from '@/store'
import cn from 'classnames'
import styles from './Sidebar.module.scss'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string
  badge?: number
  description?: string
}

// 使用SVG图标替换emoji
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
)

const TasksIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 11l3 3L22 4"/>
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
  </svg>
)

const AlertsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
  </svg>
)

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: '仪表板',
    icon: <DashboardIcon />,
    path: '/dashboard',
    description: '系统概览和实时监控'
  },
  {
    id: 'tasks',
    label: '任务管理',
    icon: <TasksIcon />,
    path: '/tasks',
    description: '任务调度和执行状态'
  },
  {
    id: 'alerts',
    label: '告警中心',
    icon: <AlertsIcon />,
    path: '/alerts',
    description: '告警信息和处理状态',
    badge: 3,
  },
  {
    id: 'settings',
    label: '系统设置',
    icon: <SettingsIcon />,
    path: '/settings',
    description: '配置和系统管理'
  },
]

const Sidebar: React.FC = () => {
  const location = useLocation()
  const [alertsExpanded, setAlertsExpanded] = useState(true)
  const { alerts } = useAppStore((state) => state.monitoring)

  const unacknowledgedAlerts = alerts.filter(alert => !alert.isAcknowledged).length

  return (
    <aside className={styles.sidebar}>
      {/* Logo Section */}
      <div className={styles.logoSection}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="2"/>
              <path d="M7 7h10v10H7z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div className={styles.logoText}>
            <div className={styles.logoTitle}>系统监控</div>
            <div className={styles.logoSubtitle}>System Monitor</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const badgeCount = item.id === 'alerts' ? unacknowledgedAlerts : item.badge || 0

            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={cn(
                    styles.navItem,
                    isActive && styles.navItemActive
                  )}
                  onClick={() => {
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 768) {
                      const sidebar = document.querySelector('[data-sidebar]')?.closest('.fixed')
                      if (sidebar) {
                        const layout = document.querySelector('.app')
                        layout?.dispatchEvent(new CustomEvent('close-sidebar'))
                      }
                    }
                  }}
                >
                  <div className={styles.navIcon}>
                    {item.icon}
                  </div>
                  <div className={styles.navContent}>
                    <div className={styles.navLabel}>{item.label}</div>
                    <div className={styles.navDescription}>{item.description}</div>
                  </div>
                  {badgeCount > 0 && (
                    <div className={styles.navBadge}>
                      {badgeCount}
                    </div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* System Status Panel */}
      <div className={styles.statusPanel}>
        <div
          className={styles.statusHeader}
          onClick={() => setAlertsExpanded(!alertsExpanded)}
        >
          <div className={styles.statusTitle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
            <span>系统状态</span>
          </div>
          <div className={cn(styles.statusToggle, alertsExpanded && styles.statusToggleExpanded)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>

        {alertsExpanded && (
          <div className={styles.statusContent}>
            <div className={styles.statusItem}>
              <div className={styles.statusInfo}>
                <div className={styles.statusLabel}>运行中任务</div>
                <div className={styles.statusValue}>12</div>
              </div>
              <div className={styles.statusProgress}>
                <div className={styles.statusProgressBar} style={{ width: '75%' }} />
              </div>
            </div>

            <div className={styles.statusItem}>
              <div className={styles.statusInfo}>
                <div className={styles.statusLabel}>系统负载</div>
                <div className={cn(styles.statusValue, styles.statusWarning)}>3.2</div>
              </div>
              <div className={styles.statusProgress}>
                <div className={cn(styles.statusProgressBar, styles.statusProgressBarWarning)} style={{ width: '64%' }} />
              </div>
            </div>

            <div className={styles.statusItem}>
              <div className={styles.statusInfo}>
                <div className={styles.statusLabel}>内存使用</div>
                <div className={styles.statusValue}>68%</div>
              </div>
              <div className={styles.statusProgress}>
                <div className={styles.statusProgressBar} style={{ width: '68%' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar