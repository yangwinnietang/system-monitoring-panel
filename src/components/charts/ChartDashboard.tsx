import React, { useState } from 'react'
import { SystemMetricsChart } from './SystemMetricsChart'
import { TaskProgressChart } from './TaskProgressChart'
import { AlertTrendChart } from './AlertTrendChart'
import { useAppStore } from '@/store'
import styles from './ChartDashboard.module.scss'

interface ChartDashboardProps {
  className?: string
}

export const ChartDashboard: React.FC<ChartDashboardProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'tasks' | 'alerts'>('metrics')
  const { monitoring, tasks } = useAppStore()

  const getUnacknowledgedCount = () => {
    return monitoring.alerts.filter(alert => !alert.isAcknowledged).length
  }

  const getCriticalCount = () => {
    return monitoring.alerts.filter(alert => alert.severity === 'critical' && !alert.isAcknowledged).length
  }

  const getRunningTasksCount = () => {
    return tasks.list.filter(task => task.status === 'running').length
  }

  return (
    <div className={`${styles.chartDashboard} ${className}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>数据可视化</h2>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>CPU</span>
            <span className={styles.statValue}>
              {monitoring.systemMetrics ? monitoring.systemMetrics.cpu.usage.toFixed(1) + '%' : '--'}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>内存</span>
            <span className={styles.statValue}>
              {monitoring.systemMetrics ? monitoring.systemMetrics.memory.usage.toFixed(1) + '%' : '--'}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>运行任务</span>
            <span className={`${styles.statValue} ${styles.running}`}>
              {getRunningTasksCount()}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>未处理告警</span>
            <span className={`${styles.statValue} ${getCriticalCount() > 0 ? styles.critical : ''}`}>
              {getUnacknowledgedCount()}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.tabContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'metrics' ? styles.active : ''}`}
            onClick={() => setActiveTab('metrics')}
          >
            <span className={styles.tabIcon}>📊</span>
            系统指标
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'tasks' ? styles.active : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <span className={styles.tabIcon}>📋</span>
            任务分析
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'alerts' ? styles.active : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            <span className={styles.tabIcon}>🚨</span>
            告警趋势
          </button>
        </div>
      </div>

      <div className={styles.chartContent}>
        {activeTab === 'metrics' && (
          <div className={styles.chartGrid}>
            <div className={styles.chartCard}>
              <SystemMetricsChart className={styles.fullHeightChart} />
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className={styles.chartGrid}>
            <div className={styles.chartCard}>
              <TaskProgressChart className={styles.fullHeightChart} />
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className={styles.chartGrid}>
            <div className={styles.chartCard}>
              <AlertTrendChart className={styles.fullHeightChart} />
            </div>
          </div>
        )}
      </div>

      {/* Quick Info Panel */}
      <div className={styles.infoPanel}>
        <div className={styles.infoSection}>
          <h4 className={styles.infoTitle}>系统状态</h4>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>系统负载</span>
              <span className={styles.infoValue}>
                {monitoring.systemMetrics ? monitoring.systemMetrics.loadAverage.toFixed(2) : '--'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>活跃连接</span>
              <span className={styles.infoValue}>
                {monitoring.systemMetrics?.network.uploadSpeed ? '--' : '--'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>磁盘I/O</span>
              <span className={styles.infoValue}>
                {monitoring.systemMetrics ?
                  (monitoring.systemMetrics.disk.readSpeed + monitoring.systemMetrics.disk.writeSpeed).toFixed(1) + ' MB/s' : '--'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.infoSection}>
          <h4 className={styles.infoTitle}>任务概览</h4>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>队列中</span>
              <span className={styles.infoValue}>
                {tasks.list.filter(t => t.status === 'queued').length}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>运行中</span>
              <span className={`${styles.infoValue} ${styles.running}`}>
                {tasks.list.filter(t => t.status === 'running').length}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>已完成</span>
              <span className={`${styles.infoValue} ${styles.completed}`}>
                {tasks.list.filter(t => t.status === 'completed').length}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.infoSection}>
          <h4 className={styles.infoTitle}>告警概览</h4>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>严重</span>
              <span className={`${styles.infoValue} ${styles.critical}`}>
                {monitoring.alerts.filter(a => a.severity === 'critical').length}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>高</span>
              <span className={`${styles.infoValue} ${styles.high}`}>
                {monitoring.alerts.filter(a => a.severity === 'high').length}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>未处理</span>
              <span className={`${styles.infoValue} ${styles.warning}`}>
                {monitoring.alerts.filter(a => !a.isAcknowledged).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}