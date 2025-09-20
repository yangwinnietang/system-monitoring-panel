import React from 'react'
import { useAppStore } from '@/store'
import styles from './SystemStatus.module.scss'

interface SystemStatusProps {
  className?: string
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ className = '' }) => {
  const { monitoring, dataStream } = useAppStore()

  const getStatusColor = (usage: number) => {
    if (usage >= 90) return styles.critical
    if (usage >= 70) return styles.warning
    return styles.normal
  }

  const getStatusText = (usage: number) => {
    if (usage >= 90) return '严重'
    if (usage >= 70) return '警告'
    return '正常'
  }

  if (!monitoring.systemMetrics) {
    return (
      <div className={`${styles.systemStatus} ${styles.loading} ${className}`}>
        <div className={styles.loadingText}>加载系统状态...</div>
      </div>
    )
  }

  const metrics = monitoring.systemMetrics

  return (
    <div className={`${styles.systemStatus} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>系统状态</h3>
        <span className={styles.lastUpdate}>
          {dataStream.lastUpdate?.toLocaleTimeString('zh-CN') || '无更新'}
        </span>
      </div>

      <div className={styles.metricsGrid}>
        {/* CPU Status */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricName}>CPU 使用率</span>
            <span className={`${styles.statusBadge} ${getStatusColor(metrics.cpu.usage)}`}>
              {getStatusText(metrics.cpu.usage)}
            </span>
          </div>
          <div className={styles.metricValue}>
            {metrics.cpu.usage.toFixed(1)}%
          </div>
          <div className={styles.metricDetails}>
            <div className={styles.detailItem}>
              <span>核心数:</span>
              <span>{metrics.cpu.cores}</span>
            </div>
            <div className={styles.detailItem}>
              <span>温度:</span>
              <span>{metrics.cpu.temperature.toFixed(1)}°C</span>
            </div>
          </div>
        </div>

        {/* Memory Status */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricName}>内存使用率</span>
            <span className={`${styles.statusBadge} ${getStatusColor(metrics.memory.usage)}`}>
              {getStatusText(metrics.memory.usage)}
            </span>
          </div>
          <div className={styles.metricValue}>
            {metrics.memory.usage.toFixed(1)}%
          </div>
          <div className={styles.metricDetails}>
            <div className={styles.detailItem}>
              <span>总量:</span>
              <span>{metrics.memory.total.toFixed(1)} GB</span>
            </div>
            <div className={styles.detailItem}>
              <span>可用:</span>
              <span>{metrics.memory.available.toFixed(1)} GB</span>
            </div>
          </div>
        </div>

        {/* Disk Status */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricName}>磁盘使用率</span>
            <span className={`${styles.statusBadge} ${getStatusColor(metrics.disk.usage)}`}>
              {getStatusText(metrics.disk.usage)}
            </span>
          </div>
          <div className={styles.metricValue}>
            {metrics.disk.usage.toFixed(1)}%
          </div>
          <div className={styles.metricDetails}>
            <div className={styles.detailItem}>
              <span>总量:</span>
              <span>{metrics.disk.total.toFixed(0)} GB</span>
            </div>
            <div className={styles.detailItem}>
              <span>读取:</span>
              <span>{(metrics.disk.readSpeed / 1024 / 1024).toFixed(1)} MB/s</span>
            </div>
          </div>
        </div>

        {/* Network Status */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricName}>网络流量</span>
            <span className={`${styles.statusBadge} ${styles.normal}`}>
              正常
            </span>
          </div>
          <div className={styles.metricValue}>
            {(metrics.network.downloadSpeed / 1024 / 1024).toFixed(1)} MB/s
          </div>
          <div className={styles.metricDetails}>
            <div className={styles.detailItem}>
              <span>上行:</span>
              <span>{(metrics.network.uploadSpeed / 1024 / 1024).toFixed(1)} MB/s</span>
            </div>
            <div className={styles.detailItem}>
              <span>下行:</span>
              <span>{(metrics.network.downloadSpeed / 1024 / 1024).toFixed(1)} MB/s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Connections */}
      <div className={styles.connectionInfo}>
        <div className={styles.connectionStat}>
          <span className={styles.statLabel}>延迟</span>
          <span className={styles.statValue}>{metrics.network.latency.toFixed(0)}ms</span>
        </div>
        <div className={styles.connectionStat}>
          <span className={styles.statLabel}>系统负载</span>
          <span className={styles.statValue}>{metrics.loadAverage.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}