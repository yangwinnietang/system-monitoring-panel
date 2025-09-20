import React, { useState } from 'react'
import { useAppStore } from '@/store'
import { Task, TaskStatus } from '@/types'
import { taskService } from '@/services'
import styles from './TaskManagement.module.scss'

interface TaskManagementProps {
  className?: string
}

export const TaskManagement: React.FC<TaskManagementProps> = ({ className = '' }) => {
  const { tasks } = useAppStore()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [filters, setFilters] = useState({
    status: 'all' as TaskStatus | 'all',
    cluster: 'all'
  })

  const filteredTasks = tasks.list.filter(task => {
    const statusMatch = filters.status === 'all' || task.status === filters.status
    const clusterMatch = filters.cluster === 'all' || task.targetCluster === filters.cluster
    return statusMatch && clusterMatch
  })

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'queued': return styles.queued
      case 'running': return styles.running
      case 'completed': return styles.completed
      case 'failed': return styles.failed
      default: return styles.queued
    }
  }

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case 'queued': return '队列中'
      case 'running': return '运行中'
      case 'completed': return '已完成'
      case 'failed': return '失败'
      default: return '未知'
    }
  }

  const handleTaskAction = async (taskId: string, action: string) => {
    try {
      switch (action) {
        case 'start':
          await taskService.startTask(taskId)
          break
        case 'pause':
          await taskService.pauseTask(taskId)
          break
        case 'resume':
          await taskService.resumeTask(taskId)
          break
        case 'complete':
          await taskService.completeTask(taskId)
          break
        case 'fail':
          await taskService.failTask(taskId)
          break
      }
    } catch (error) {
      console.error('Task action failed:', error)
    }
  }

  const clusters = Array.from(new Set(tasks.list.map(task => task.targetCluster)))

  return (
    <div className={`${styles.taskManagement} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>任务管理</h3>
        <div className={styles.taskStats}>
          <span className={styles.stat}>
            总计: {tasks.list.length}
          </span>
          <span className={`${styles.stat} ${styles.runningStat}`}>
            运行中: {tasks.list.filter(t => t.status === 'running').length}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>状态:</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as TaskStatus | 'all' }))}
            className={styles.select}
          >
            <option value="all">全部</option>
            <option value="queued">队列中</option>
            <option value="running">运行中</option>
            <option value="completed">已完成</option>
            <option value="failed">失败</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>集群:</label>
          <select
            value={filters.cluster}
            onChange={(e) => setFilters(prev => ({ ...prev, cluster: e.target.value }))}
            className={styles.select}
          >
            <option value="all">全部</option>
            {clusters.map(cluster => (
              <option key={cluster} value={cluster}>{cluster}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className={styles.taskList}>
        {filteredTasks.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <p>暂无任务</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className={`${styles.taskItem} ${selectedTask?.id === task.id ? styles.selected : ''}`}
              onClick={() => setSelectedTask(task)}
            >
              <div className={styles.taskHeader}>
                <div className={styles.taskInfo}>
                  <h4 className={styles.taskName}>{task.name}</h4>
                  <div className={styles.taskMeta}>
                    <span className={`${styles.statusBadge} ${getStatusColor(task.status)}`}>
                      {getStatusText(task.status)}
                    </span>
                    <span className={styles.cluster}>{task.targetCluster}</span>
                    <span className={styles.duration}>
                      {Math.floor((Date.now() - task.startTime.getTime()) / 60000)}分钟
                    </span>
                  </div>
                </div>
                <div className={styles.taskProgress}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <span className={styles.progressText}>{task.progress.toFixed(0)}%</span>
                </div>
              </div>

              <div className={styles.taskDescription}>
                {task.description}
              </div>

              <div className={styles.taskTags}>
                {task.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>

              <div className={styles.taskActions}>
                {task.status === 'queued' && (
                  <button
                    className={`${styles.actionButton} ${styles.startButton}`}
                    onClick={(e) => { e.stopPropagation(); handleTaskAction(task.id, 'start'); }}
                  >
                    开始
                  </button>
                )}
                {task.status === 'running' && (
                  <>
                    <button
                      className={`${styles.actionButton} ${styles.pauseButton}`}
                      onClick={(e) => { e.stopPropagation(); handleTaskAction(task.id, 'pause'); }}
                    >
                      暂停
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.completeButton}`}
                      onClick={(e) => { e.stopPropagation(); handleTaskAction(task.id, 'complete'); }}
                    >
                      完成
                    </button>
                  </>
                )}
                {task.status === 'queued' && (
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={(e) => { e.stopPropagation(); handleTaskAction(task.id, 'fail'); }}
                  >
                    取消
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{selectedTask.name}</h3>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedTask(null)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.detailRow}>
                <span className={styles.label}>状态:</span>
                <span className={`${styles.statusBadge} ${getStatusColor(selectedTask.status)}`}>
                  {getStatusText(selectedTask.status)}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>集群:</span>
                <span>{selectedTask.targetCluster}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>进度:</span>
                <span>{selectedTask.progress.toFixed(0)}%</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>开始时间:</span>
                <span>{selectedTask.startTime.toLocaleString('zh-CN')}</span>
              </div>
              {selectedTask.endTime && (
                <div className={styles.detailRow}>
                  <span className={styles.label}>结束时间:</span>
                  <span>{selectedTask.endTime.toLocaleString('zh-CN')}</span>
                </div>
              )}
              <div className={styles.detailRow}>
                <span className={styles.label}>描述:</span>
                <span>{selectedTask.description}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>标签:</span>
                <div className={styles.tagList}>
                  {selectedTask.tags.map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}