import React from 'react'
import { useDataStream } from '@/hooks/useDataStream'
import { useTheme } from '@/hooks/useTheme'
import { UI_SETTINGS } from '@/constants'
import { cn } from '@/utils'
import SearchInput from '@/components/ui/SearchInput'
import Button from '@/components/ui/Button'
import styles from './Header.module.scss'

interface HeaderProps {
  onMenuToggle: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { isDataStreamActive, toggleDataStream, refreshData } = useDataStream()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={styles.header}>
      {/* Left Section - Logo and Title */}
      <div className={styles.headerLeft}>
        {/* Mobile Menu Button */}
        <button className={styles.menuButton} onClick={onMenuToggle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="2"/>
              <path d="M7 7h10v10H7z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div className={styles.logoText}>
            <h1 className={styles.logoTitle}>System Monitor</h1>
            <p className={styles.logoSubtitle}>系统监控面板</p>
          </div>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className={styles.headerCenter}>
        <SearchInput
          placeholder="搜索服务器、任务或标签..."
          onSearch={(query) => console.log('Search:', query)}
          className={styles.searchInput}
        />
      </div>

      {/* Right Section - Actions and User */}
      <div className={styles.headerRight}>
        {/* Data Stream Control */}
        <button
          className={cn(
            styles.controlButton,
            isDataStreamActive ? styles.controlButtonActive : styles.controlButtonInactive
          )}
          onClick={toggleDataStream}
          title={isDataStreamActive ? '暂停数据流' : '启动数据流'}
        >
          <div className={styles.controlIcon}>
            {isDataStreamActive ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            )}
          </div>
          <span className={styles.controlText}>
            {isDataStreamActive ? '运行中' : '已停止'}
          </span>
        </button>

        {/* Refresh Button */}
        <button
          className={styles.actionButton}
          onClick={refreshData}
          title="刷新数据"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
        </button>

        {/* Theme Toggle */}
        <button
          className={styles.actionButton}
          onClick={toggleTheme}
          title={theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        {/* User Info */}
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>管理员</div>
            <div className={styles.userRole}>系统管理员</div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header