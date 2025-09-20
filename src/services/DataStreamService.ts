import { monitoringService } from './MonitoringService'
import { taskService } from './TaskService'
import { useAppStore } from '@/store'
import { DATA_STREAM_SETTINGS } from '@/constants'

export interface DataStreamService {
  // Control methods
  start(): void
  stop(): void
  isRunning(): boolean
  setUpdateInterval(interval: number): void

  // Data subscription
  subscribeToMetrics(callback: (metrics: any) => void): () => void
  subscribeToTasks(callback: (tasks: any[]) => void): () => void
  subscribeToAlerts(callback: (alerts: any[]) => void): () => void

  // Force refresh
  refreshAll(): Promise<void>
  refreshMetrics(): Promise<void>
  refreshTasks(): Promise<void>
  refreshAlerts(): Promise<void>
}

class MockDataStreamService implements DataStreamService {
  private isRunningFlag: boolean = false
  private updateInterval: number = DATA_STREAM_SETTINGS.DEFAULT_INTERVAL
  private intervals: Set<NodeJS.Timeout> = new Set()
  private metricsSubscribers: Set<(metrics: any) => void> = new Set()
  private tasksSubscribers: Set<(tasks: any[]) => void> = new Set()
  private alertsSubscribers: Set<(alerts: any[]) => void> = new Set()

  constructor() {
    // Initialize with store data
    this.initializeStore()
  }

  start(): void {
    if (this.isRunningFlag) return

    this.isRunningFlag = true
    console.log('Data stream started')

    // Set up periodic data updates
    this.setupPeriodicUpdates()

    // Subscribe to real-time data
    this.setupRealTimeSubscriptions()
  }

  stop(): void {
    if (!this.isRunningFlag) return

    this.isRunningFlag = false
    console.log('Data stream stopped')

    // Clear all intervals
    this.intervals.forEach(interval => clearInterval(interval))
    this.intervals.clear()

    // Clear subscribers
    this.metricsSubscribers.clear()
    this.tasksSubscribers.clear()
    this.alertsSubscribers.clear()
  }

  isRunning(): boolean {
    return this.isRunningFlag
  }

  setUpdateInterval(interval: number): void {
    const validatedInterval = Math.max(
      DATA_STREAM_SETTINGS.MIN_INTERVAL,
      Math.min(DATA_STREAM_SETTINGS.MAX_INTERVAL, interval)
    )

    this.updateInterval = validatedInterval

    // Restart with new interval if currently running
    if (this.isRunningFlag) {
      this.stop()
      this.start()
    }
  }

  subscribeToMetrics(callback: (metrics: any) => void): () => void {
    this.metricsSubscribers.add(callback)

    // Send current data immediately
    const currentMetrics = useAppStore.getState().monitoring.systemMetrics
    if (currentMetrics) {
      callback(currentMetrics)
    }

    // Return unsubscribe function
    return () => {
      this.metricsSubscribers.delete(callback)
    }
  }

  subscribeToTasks(callback: (tasks: any[]) => void): () => void {
    this.tasksSubscribers.add(callback)

    // Send current data immediately
    const currentTasks = useAppStore.getState().tasks.list
    callback(currentTasks)

    // Return unsubscribe function
    return () => {
      this.tasksSubscribers.delete(callback)
    }
  }

  subscribeToAlerts(callback: (alerts: any[]) => void): () => void {
    this.alertsSubscribers.add(callback)

    // Send current data immediately
    const currentAlerts = useAppStore.getState().monitoring.alerts
    callback(currentAlerts)

    // Return unsubscribe function
    return () => {
      this.alertsSubscribers.delete(callback)
    }
  }

  async refreshAll(): Promise<void> {
    await Promise.all([
      this.refreshMetrics(),
      this.refreshTasks(),
      this.refreshAlerts(),
    ])
  }

  async refreshMetrics(): Promise<void> {
    try {
      const metrics = await monitoringService.getSystemMetrics()

      // Update store
      useAppStore.getState().setSystemMetrics(metrics)
      useAppStore.getState().updateLastUpdateTime()

      // Notify subscribers
      this.metricsSubscribers.forEach(callback => {
        try {
          callback(metrics)
        } catch (error) {
          console.error('Error in metrics subscriber:', error)
        }
      })
    } catch (error) {
      console.error('Error refreshing metrics:', error)
    }
  }

  async refreshTasks(): Promise<void> {
    try {
      const tasks = await taskService.getTasks()

      // Update store
      useAppStore.getState().setTasks(tasks)
      useAppStore.getState().updateLastUpdateTime()

      // Notify subscribers
      this.tasksSubscribers.forEach(callback => {
        try {
          callback(tasks)
        } catch (error) {
          console.error('Error in tasks subscriber:', error)
        }
      })
    } catch (error) {
      console.error('Error refreshing tasks:', error)
    }
  }

  async refreshAlerts(): Promise<void> {
    try {
      const alerts = await monitoringService.getAlerts()

      // Update store
      useAppStore.getState().setAlerts(alerts)
      useAppStore.getState().updateLastUpdateTime()

      // Notify subscribers
      this.alertsSubscribers.forEach(callback => {
        try {
          callback(alerts)
        } catch (error) {
          console.error('Error in alerts subscriber:', error)
        }
      })
    } catch (error) {
      console.error('Error refreshing alerts:', error)
    }
  }

  // Private methods
  private initializeStore(): void {
    // Initialize store with some data
    this.refreshAll().catch(console.error)
  }

  private setupPeriodicUpdates(): void {
    // Set up periodic refresh based on update interval
    const metricsInterval = setInterval(() => {
      this.refreshMetrics().catch(console.error)
    }, this.updateInterval)

    const tasksInterval = setInterval(() => {
      this.refreshTasks().catch(console.error)
    }, this.updateInterval * 2) // Tasks update less frequently

    const alertsInterval = setInterval(() => {
      this.refreshAlerts().catch(console.error)
    }, this.updateInterval * 3) // Alerts update even less frequently

    this.intervals.add(metricsInterval)
    this.intervals.add(tasksInterval)
    this.intervals.add(alertsInterval)
  }

  private setupRealTimeSubscriptions(): void {
    // Subscribe to real-time metrics updates
    monitoringService.subscribeToMetrics((metrics) => {
      if (this.isRunningFlag) {
        useAppStore.getState().setSystemMetrics(metrics)

        this.metricsSubscribers.forEach(callback => {
          try {
            callback(metrics)
          } catch (error) {
            console.error('Error in metrics subscriber:', error)
          }
        })
      }
    })

    // Subscribe to real-time task updates
    taskService.subscribeToTasks((tasks) => {
      if (this.isRunningFlag) {
        useAppStore.getState().setTasks(tasks)

        this.tasksSubscribers.forEach(callback => {
          try {
            callback(tasks)
          } catch (error) {
            console.error('Error in tasks subscriber:', error)
          }
        })
      }
    })

    // Subscribe to individual task updates
    taskService.subscribeToTaskUpdates((task) => {
      if (this.isRunningFlag) {
        // Update task in store
        const currentTasks = useAppStore.getState().tasks.list
        const updatedTasks = currentTasks.map(t => t.id === task.id ? task : t)
        useAppStore.getState().setTasks(updatedTasks)

        this.tasksSubscribers.forEach(callback => {
          try {
            callback(updatedTasks)
          } catch (error) {
            console.error('Error in tasks subscriber:', error)
          }
        })
      }
    })

    // Subscribe to real-time alert updates
    monitoringService.subscribeToAlerts((alert) => {
      if (this.isRunningFlag) {
        // Add new alert to store
        const currentAlerts = useAppStore.getState().monitoring.alerts
        useAppStore.getState().addAlert(alert)

        this.alertsSubscribers.forEach(callback => {
          try {
            callback([alert, ...currentAlerts])
          } catch (error) {
            console.error('Error in alerts subscriber:', error)
          }
        })
      }
    })
  }

  // Get service status
  getStatus(): {
    isRunning: boolean
    updateInterval: number
    subscriberCount: {
      metrics: number
      tasks: number
      alerts: number
    }
    lastUpdate: Date | null
  } {
    return {
      isRunning: this.isRunningFlag,
      updateInterval: this.updateInterval,
      subscriberCount: {
        metrics: this.metricsSubscribers.size,
        tasks: this.tasksSubscribers.size,
        alerts: this.alertsSubscribers.size,
      },
      lastUpdate: useAppStore.getState().dataStream.lastUpdate,
    }
  }

  // Cleanup
  destroy(): void {
    this.stop()
  }
}

// Export singleton instance
export const dataStreamService = new MockDataStreamService()