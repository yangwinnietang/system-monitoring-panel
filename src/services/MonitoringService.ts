import {
  SystemMetrics,
  PerformanceData,
  Alert,
  LoadBalancerStatus,
  MetricType,
  TimeRange,
  AlertFilters,
} from '@/types'
import { mockDataGenerator } from './MockDataGenerator'

export interface MonitoringService {
  // System metrics
  getSystemMetrics(serverName?: string): Promise<SystemMetrics>
  getServerMetrics(): Promise<Record<string, SystemMetrics>>

  // Performance data
  getPerformanceData(metricType: MetricType, timeRange?: TimeRange): Promise<PerformanceData[]>
  getAllPerformanceData(timeRange?: TimeRange): Promise<Record<MetricType, PerformanceData[]>>

  // Alerts
  getAlerts(filters?: AlertFilters): Promise<Alert[]>
  getUnacknowledgedAlerts(): Promise<Alert[]>
  acknowledgeAlert(alertId: string): Promise<void>

  // Load balancer
  getLoadBalancerStatus(): Promise<LoadBalancerStatus>

  // Real-time updates
  subscribeToMetrics(callback: (metrics: SystemMetrics) => void): () => void
  subscribeToAlerts(callback: (alert: Alert) => void): () => void
}

class MockMonitoringService implements MonitoringService {
  private currentMetrics: SystemMetrics = mockDataGenerator.generateSystemMetrics()
  private serverMetrics: Record<string, SystemMetrics> = mockDataGenerator.generateServerMetrics()
  private alerts: Alert[] = mockDataGenerator.generateAlerts()
  private subscribers: Set<(metrics: SystemMetrics) => void> = new Set()
  private alertSubscribers: Set<(alert: Alert) => void> = new Set()
  private updateInterval: NodeJS.Timeout | null = null

  constructor() {
    // Start real-time updates
    this.startRealTimeUpdates()
  }

  async getSystemMetrics(serverName?: string): Promise<SystemMetrics> {
    // Simulate network delay
    await this.delay(100 + Math.random() * 200)

    if (serverName && this.serverMetrics[serverName]) {
      return this.serverMetrics[serverName]
    }

    return this.currentMetrics
  }

  async getServerMetrics(): Promise<Record<string, SystemMetrics>> {
    await this.delay(150 + Math.random() * 150)
    return { ...this.serverMetrics }
  }

  async getPerformanceData(metricType: MetricType, timeRange?: TimeRange): Promise<PerformanceData[]> {
    await this.delay(200 + Math.random() * 300)
    return mockDataGenerator.generatePerformanceData(metricType, timeRange)
  }

  async getAllPerformanceData(timeRange?: TimeRange): Promise<Record<MetricType, PerformanceData[]>> {
    await this.delay(300 + Math.random() * 200)

    const metricTypes: MetricType[] = ['cpu', 'memory', 'disk', 'network', 'load']
    const result: Record<MetricType, PerformanceData[]> = {} as Record<MetricType, PerformanceData[]>

    for (const metricType of metricTypes) {
      result[metricType] = mockDataGenerator.generatePerformanceData(metricType, timeRange)
    }

    return result
  }

  async getAlerts(filters?: AlertFilters): Promise<Alert[]> {
    await this.delay(100 + Math.random() * 100)

    let filteredAlerts = [...this.alerts]

    if (filters) {
      if (filters.severity) {
        filteredAlerts = filteredAlerts.filter(alert => alert.severity === filters.severity)
      }

      if (filters.source) {
        filteredAlerts = filteredAlerts.filter(alert => alert.source === filters.source)
      }

      if (filters.acknowledged !== undefined) {
        filteredAlerts = filteredAlerts.filter(alert => alert.isAcknowledged === filters.acknowledged)
      }

      if (filters.timeRange) {
        filteredAlerts = filteredAlerts.filter(alert =>
          alert.timestamp >= filters.timeRange!.start && alert.timestamp <= filters.timeRange!.end
        )
      }
    }

    return filteredAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  async getUnacknowledgedAlerts(): Promise<Alert[]> {
    return this.getAlerts({ acknowledged: false })
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    await this.delay(50 + Math.random() * 50)

    const alert = this.alerts.find(a => a.id === alertId)
    if (alert && !alert.isAcknowledged) {
      alert.isAcknowledged = true
    }
  }

  async getLoadBalancerStatus(): Promise<LoadBalancerStatus> {
    await this.delay(150 + Math.random() * 150)
    return mockDataGenerator.generateLoadBalancerStatus()
  }

  subscribeToMetrics(callback: (metrics: SystemMetrics) => void): () => void {
    this.subscribers.add(callback)

    // Send current metrics immediately
    callback(this.currentMetrics)

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback)
    }
  }

  subscribeToAlerts(callback: (alert: Alert) => void): () => void {
    this.alertSubscribers.add(callback)

    // Return unsubscribe function
    return () => {
      this.alertSubscribers.delete(callback)
    }
  }

  // Private methods
  private startRealTimeUpdates(): void {
    this.updateInterval = setInterval(() => {
      // Update current metrics
      this.currentMetrics = mockDataGenerator.updateMetrics(this.currentMetrics)

      // Update server metrics
      Object.keys(this.serverMetrics).forEach(serverName => {
        this.serverMetrics[serverName] = mockDataGenerator.updateMetrics(this.serverMetrics[serverName])
      })

      // Notify subscribers
      this.subscribers.forEach(callback => {
        try {
          callback(this.currentMetrics)
        } catch (error) {
          console.error('Error in metrics subscriber:', error)
        }
      })

      // Generate new alerts based on metrics
      const newAlerts = mockDataGenerator.generateAlertsFromMetrics(this.currentMetrics)
      if (newAlerts.length > 0) {
        this.alerts.unshift(...newAlerts)

        // Keep only recent alerts
        if (this.alerts.length > 100) {
          this.alerts = this.alerts.slice(0, 100)
        }

        // Notify alert subscribers
        newAlerts.forEach(alert => {
          this.alertSubscribers.forEach(callback => {
            try {
              callback(alert)
            } catch (error) {
              console.error('Error in alert subscriber:', error)
            }
          })
        })
      }
    }, 2000) // Update every 2 seconds
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Cleanup
  destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
    this.subscribers.clear()
    this.alertSubscribers.clear()
  }
}

// Export singleton instance
export const monitoringService = new MockMonitoringService()