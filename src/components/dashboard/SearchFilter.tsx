import React, { useState, useEffect } from 'react'
import { useAppStore } from '@/store'
import { Task, Alert } from '@/types'
import styles from './SearchFilter.module.scss'

interface SearchFilterProps {
  className?: string
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ className = '' }) => {
  const { tasks, monitoring } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'tasks' | 'alerts'>('all')
  const [filteredResults, setFilteredResults] = useState<{
    tasks: Task[]
    alerts: Alert[]
  }>({ tasks: [], alerts: [] })

  const searchTasks = (term: string): Task[] => {
    if (!term.trim()) return []

    const searchLower = term.toLowerCase()
    return tasks.list.filter(task =>
      task.name.toLowerCase().includes(searchLower) ||
      task.description?.toLowerCase().includes(searchLower) ||
      task.targetCluster.toLowerCase().includes(searchLower) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  const searchAlerts = (term: string): Alert[] => {
    if (!term.trim()) return []

    const searchLower = term.toLowerCase()
    return monitoring.alerts.filter(alert =>
      alert.title.toLowerCase().includes(searchLower) ||
      alert.description.toLowerCase().includes(searchLower) ||
      alert.source.toLowerCase().includes(searchLower)
    )
  }

  useEffect(() => {
    if (searchTerm.trim()) {
      const tasks = searchTasks(searchTerm)
      const alerts = searchAlerts(searchTerm)
      setFilteredResults({ tasks, alerts })
    } else {
      setFilteredResults({ tasks: [], alerts: [] })
    }
  }, [searchTerm, tasks.list, monitoring.alerts])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  const getResultCount = () => {
    if (activeTab === 'all') {
      return filteredResults.tasks.length + filteredResults.alerts.length
    } else if (activeTab === 'tasks') {
      return filteredResults.tasks.length
    } else {
      return filteredResults.alerts.length
    }
  }

  const getDisplayResults = () => {
    if (activeTab === 'tasks') {
      return { tasks: filteredResults.tasks, alerts: [] }
    } else if (activeTab === 'alerts') {
      return { tasks: [], alerts: filteredResults.alerts }
    } else {
      return filteredResults
    }
  }

  const displayResults = getDisplayResults()

  return (
    <div className={`${styles.searchFilter} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>搜索过滤</h3>
      </div>

      {/* Search Input */}
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="搜索任务、告警..."
            className={styles.searchInput}
          />
          {searchTerm && (
            <button
              className={styles.clearButton}
              onClick={clearSearch}
            >
              ×
            </button>
          )}
        </div>
        <div className={styles.searchIcon}>🔍</div>
      </div>

      {/* Search Tabs */}
      {searchTerm && (
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
            onClick={() => setActiveTab('all')}
          >
            全部 ({filteredResults.tasks.length + filteredResults.alerts.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'tasks' ? styles.active : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            任务 ({filteredResults.tasks.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'alerts' ? styles.active : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            告警 ({filteredResults.alerts.length})
          </button>
        </div>
      )}

      {/* Search Results */}
      {searchTerm && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <span>搜索结果</span>
            <span className={styles.resultCount}>{getResultCount()}</span>
          </div>

          {displayResults.tasks.length > 0 && (
            <div className={styles.resultSection}>
              <h4 className={styles.sectionTitle}>任务</h4>
              {displayResults.tasks.map(task => (
                <div key={task.id} className={styles.resultItem}>
                  <div className={styles.resultHeader}>
                    <span className={styles.resultName}>{task.name}</span>
                    <span className={`${styles.statusBadge} ${styles[task.status]}`}>
                      {task.status === 'queued' ? '队列中' :
                       task.status === 'running' ? '运行中' :
                       task.status === 'completed' ? '已完成' : '失败'}
                    </span>
                  </div>
                  <div className={styles.resultMeta}>
                    <span className={styles.cluster}>{task.targetCluster}</span>
                    <span className={styles.progress}>{task.progress.toFixed(0)}%</span>
                  </div>
                  {task.description && (
                    <div className={styles.resultDescription}>
                      {task.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {displayResults.alerts.length > 0 && (
            <div className={styles.resultSection}>
              <h4 className={styles.sectionTitle}>告警</h4>
              {displayResults.alerts.map(alert => (
                <div key={alert.id} className={styles.resultItem}>
                  <div className={styles.resultHeader}>
                    <span className={styles.resultName}>{alert.title}</span>
                    <span className={`${styles.severityBadge} ${styles[alert.severity]}`}>
                      {alert.severity === 'critical' ? '严重' :
                       alert.severity === 'high' ? '高' :
                       alert.severity === 'medium' ? '中' : '低'}
                    </span>
                  </div>
                  <div className={styles.resultMeta}>
                    <span className={styles.source}>{alert.source}</span>
                    <span className={styles.time}>
                      {Math.floor((Date.now() - alert.timestamp.getTime()) / 60000)}分钟前
                    </span>
                  </div>
                  <div className={styles.resultDescription}>
                    {alert.description}
                  </div>
                </div>
              ))}
            </div>
          )}

          {getResultCount() === 0 && (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🔍</div>
              <p>未找到匹配的结果</p>
              <p className={styles.noResultsHint}>尝试使用不同的关键词</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Filters */}
      {!searchTerm && (
        <div className={styles.quickFilters}>
          <h4 className={styles.sectionTitle}>快速筛选</h4>
          <div className={styles.filterGroups}>
            {/* Task Filters */}
            <div className={styles.filterGroup}>
              <h5>任务状态</h5>
              <div className={styles.filterChips}>
                <button
                  className={styles.filterChip}
                  onClick={() => {
                    const runningTasks = tasks.list.filter(t => t.status === 'running')
                    console.log('运行中任务:', runningTasks.length)
                  }}
                >
                  运行中 ({tasks.list.filter(t => t.status === 'running').length})
                </button>
                <button
                  className={styles.filterChip}
                  onClick={() => {
                    const queuedTasks = tasks.list.filter(t => t.status === 'queued')
                    console.log('队列中任务:', queuedTasks.length)
                  }}
                >
                  队列中 ({tasks.list.filter(t => t.status === 'queued').length})
                </button>
                <button
                  className={styles.filterChip}
                  onClick={() => {
                    const failedTasks = tasks.list.filter(t => t.status === 'failed')
                    console.log('失败任务:', failedTasks.length)
                  }}
                >
                  失败 ({tasks.list.filter(t => t.status === 'failed').length})
                </button>
              </div>
            </div>

            {/* Alert Filters */}
            <div className={styles.filterGroup}>
              <h5>告警级别</h5>
              <div className={styles.filterChips}>
                <button
                  className={`${styles.filterChip} ${styles.critical}`}
                  onClick={() => {
                    const criticalAlerts = monitoring.alerts.filter(a => a.severity === 'critical' && !a.isAcknowledged)
                    console.log('严重告警:', criticalAlerts.length)
                  }}
                >
                  严重 ({monitoring.alerts.filter(a => a.severity === 'critical' && !a.isAcknowledged).length})
                </button>
                <button
                  className={`${styles.filterChip} ${styles.warning}`}
                  onClick={() => {
                    const warningAlerts = monitoring.alerts.filter(a => a.severity === 'warning' && !a.isAcknowledged)
                    console.log('警告告警:', warningAlerts.length)
                  }}
                >
                  警告 ({monitoring.alerts.filter(a => a.severity === 'warning' && !a.isAcknowledged).length})
                </button>
                <button
                  className={styles.filterChip}
                  onClick={() => {
                    const unacknowledgedAlerts = monitoring.alerts.filter(a => !a.isAcknowledged)
                    console.log('未处理告警:', unacknowledgedAlerts.length)
                  }}
                >
                  未处理 ({monitoring.alerts.filter(a => !a.isAcknowledged).length})
                </button>
              </div>
            </div>

            {/* Cluster Filters */}
            <div className={styles.filterGroup}>
              <h5>集群分布</h5>
              <div className={styles.filterChips}>
                {Array.from(new Set(tasks.list.map(t => t.targetCluster))).map(cluster => (
                  <button
                    key={cluster}
                    className={styles.filterChip}
                    onClick={() => {
                      const clusterTasks = tasks.list.filter(t => t.targetCluster === cluster)
                      console.log(`${cluster}任务:`, clusterTasks.length)
                    }}
                  >
                    {cluster} ({tasks.list.filter(t => t.targetCluster === cluster).length})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}