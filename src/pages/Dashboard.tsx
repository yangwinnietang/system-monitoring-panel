import React, { useEffect } from 'react'
import { SystemStatus } from '@/components/dashboard/SystemStatus'
import { TaskManagement } from '@/components/dashboard/TaskManagement'
import { AlertSystem } from '@/components/dashboard/AlertSystem'
import { SearchFilter } from '@/components/dashboard/SearchFilter'
import { useDataStream } from '@/hooks/useDataStream'
import styles from './Dashboard.module.scss'

const Dashboard: React.FC = () => {
  const { isDataStreamActive, updateInterval, toggleDataStream, setUpdateInterval, refreshData } = useDataStream()

  useEffect(() => {
    // Auto-start data stream when dashboard mounts
    if (!isDataStreamActive) {
      toggleDataStream()
    }
  }, [isDataStreamActive, toggleDataStream])

  return (
    <div className={styles.dashboard}>
      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Top Section: System Status (30% height) */}
        <div className={styles.topSection}>
          <SystemStatus className={styles.systemStatusPanel} />
        </div>

        {/* Bottom Section: Split area for Task Management and Search/Alerts */}
        <div className={styles.bottomSection}>
          {/* Left Side: Task Management (70% width) */}
          <div className={styles.leftSection}>
            <TaskManagement className={styles.taskPanel} />
          </div>

          {/* Right Side: Split between Search Filter and Alerts */}
          <div className={styles.rightSection}>
            {/* Search Filter (Top 60% of right section) */}
            <div className={styles.searchSection}>
              <SearchFilter className={styles.searchPanel} />
            </div>

            {/* Alert System (Bottom 40% of right section) */}
            <div className={styles.alertSection}>
              <AlertSystem className={styles.alertPanel} />
            </div>
          </div>
        </div>
      </div>

      {/* Data Stream Controls (Fixed position overlay) */}
      <div className={styles.controlsOverlay}>
        <div className={styles.streamControls}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>数据流:</span>
            <button
              className={`${styles.controlButton} ${isDataStreamActive ? styles.active : ''}`}
              onClick={toggleDataStream}
            >
              {isDataStreamActive ? '运行中' : '已停止'}
            </button>
          </div>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>更新间隔:</span>
            <select
              value={updateInterval}
              onChange={(e) => setUpdateInterval(Number(e.target.value))}
              className={styles.intervalSelect}
            >
              <option value={1000}>1秒</option>
              <option value={2000}>2秒</option>
              <option value={5000}>5秒</option>
              <option value={10000}>10秒</option>
              <option value={30000}>30秒</option>
            </select>
          </div>
          <button
            className={styles.refreshButton}
            onClick={refreshData}
          >
            刷新数据
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard