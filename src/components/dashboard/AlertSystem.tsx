import React, { useState } from 'react'
import { useAppStore } from '@/store'
import { Alert, AlertSeverity } from '@/types'
import { monitoringService } from '@/services'
import styles from './AlertSystem.module.scss'

interface AlertSystemProps {
  className?: string
}

export const AlertSystem: React.FC<AlertSystemProps> = ({ className = '' }) => {
  const { monitoring } = useAppStore()
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [filters, setFilters] = useState({
    severity: 'all' as AlertSeverity | 'all',
    acknowledged: 'all' as 'all' | 'true' | 'false'
  })

  const filteredAlerts = monitoring.alerts.filter(alert => {
    const severityMatch = filters.severity === 'all' || alert.severity === filters.severity
    const acknowledgedMatch = filters.acknowledged === 'all' ||
      (filters.acknowledged === 'true' && alert.isAcknowledged) ||
      (filters.acknowledged === 'false' && !alert.isAcknowledged)
    return severityMatch && acknowledgedMatch
  })

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical': return styles.critical
      case 'high': return styles.high
      case 'medium': return styles.medium
      case 'low': return styles.low
      default: return styles.low
    }
  }

  const getSeverityText = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical': return '严重'
      case 'high': return '高'
      case 'medium': return '中'
      case 'low': return '低'
      default: return '未知'
    }
  }

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical': return '🚨'
      case 'high': return '⚠️'
      case 'medium': return '📋'
      case 'low': return 'ℹ️'
      default: return '📢'
    }
  }

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await monitoringService.acknowledgeAlert(alertId)
    } catch (error) {
      console.error('Failed to acknowledge alert:', error)
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffMinutes = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}天前`
    if (diffHours > 0) return `${diffHours}小时前`
    if (diffMinutes > 0) return `${diffMinutes}分钟前`
    return '刚刚'
  }

  const unacknowledgedCount = monitoring.alerts.filter(alert => !alert.isAcknowledged).length
  const criticalCount = monitoring.alerts.filter(alert => alert.severity === 'critical' && !alert.isAcknowledged).length

  return (
    <div className={`${styles.alertSystem} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>告警系统</h3>
        <div className={styles.alertStats}>
          <span className={`${styles.stat} ${criticalCount > 0 ? styles.criticalStat : ''}`}>
            未处理: {unacknowledgedCount}
          </span>
          {criticalCount > 0 && (
            <span className={`${styles.stat} ${styles.criticalStat}`}>
              严重: {criticalCount}
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>严重程度:</label>
          <select
            value={filters.severity}
            onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value as AlertSeverity | 'all' }))}
            className={styles.select}
          >
            <option value="all">全部</option>
            <option value="critical">严重</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>处理状态:</label>
          <select
            value={filters.acknowledged}
            onChange={(e) => setFilters(prev => ({ ...prev, acknowledged: e.target.value as 'all' | 'true' | 'false' }))}
            className={styles.select}
          >
            <option value="all">全部</option>
            <option value="false">未处理</option>
            <option value="true">已处理</option>
          </select>
        </div>
      </div>

      {/* Alert List */}
      <div className={styles.alertList}>
        {filteredAlerts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📢</div>
            <p>暂无告警</p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`${styles.alertItem} ${selectedAlert?.id === alert.id ? styles.selected : ''} ${!alert.isAcknowledged ? styles.unacknowledged : ''}`}
              onClick={() => setSelectedAlert(alert)}
            >
              <div className={styles.alertHeader}>
                <div className={styles.alertInfo}>
                  <div className={styles.alertTitle}>
                    <span className={styles.severityIcon}>{getSeverityIcon(alert.severity)}</span>
                    <h4>{alert.title}</h4>
                  </div>
                  <div className={styles.alertMeta}>
                    <span className={`${styles.severityBadge} ${getSeverityColor(alert.severity)}`}>
                      {getSeverityText(alert.severity)}
                    </span>
                    <span className={styles.source}>{alert.source}</span>
                    <span className={styles.time}>{formatTimeAgo(alert.timestamp)}</span>
                  </div>
                </div>
                {!alert.isAcknowledged && (
                  <button
                    className={styles.acknowledgeButton}
                    onClick={(e) => { e.stopPropagation(); handleAcknowledgeAlert(alert.id); }}
                  >
                    处理
                  </button>
                )}
              </div>

              <div className={styles.alertDescription}>
                {alert.description}
              </div>

  
              {alert.isAcknowledged && (
                <div className={styles.acknowledgedInfo}>
                  ✓ 已处理
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <span className={styles.severityIcon}>{getSeverityIcon(selectedAlert.severity)}</span>
                <h3>{selectedAlert.title}</h3>
              </div>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedAlert(null)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.detailRow}>
                <span className={styles.label}>严重程度:</span>
                <span className={`${styles.severityBadge} ${getSeverityColor(selectedAlert.severity)}`}>
                  {getSeverityText(selectedAlert.severity)}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>来源:</span>
                <span>{selectedAlert.source}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>时间:</span>
                <span>{selectedAlert.timestamp.toLocaleString('zh-CN')}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>状态:</span>
                <span className={selectedAlert.isAcknowledged ? styles.acknowledged : styles.unacknowledgedText}>
                  {selectedAlert.isAcknowledged ? '已处理' : '未处理'}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>描述:</span>
                <span>{selectedAlert.description}</span>
              </div>
                {!selectedAlert.isAcknowledged && (
                <div className={styles.modalActions}>
                  <button
                    className={styles.acknowledgeButton}
                    onClick={() => {
                      handleAcknowledgeAlert(selectedAlert.id)
                      setSelectedAlert(null)
                    }}
                  >
                    标记为已处理
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}