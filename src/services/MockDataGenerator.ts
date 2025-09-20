import {
  SystemMetrics,
  Task,
  Alert,
  PerformanceData,
  LoadBalancerStatus,
  TaskStatus,
  AlertSeverity,
  MetricType,
} from '@/types'
import { MOCK_DATA_SETTINGS } from '@/constants'
import { generateId } from '@/utils'

export class MockDataGenerator {
  private serverNames = [
    'server-001', 'server-002', 'server-003', 'server-004', 'server-005',
    'web-server-01', 'web-server-02', 'db-server-01', 'cache-server-01', 'api-server-01'
  ]

  private taskNames = [
    '系统备份', '数据同步', '日志清理', '性能监控', '安全扫描',
    '数据库优化', '缓存刷新', '服务重启', '配置更新', '证书更新'
  ]

  private alertSources = [
    'CPU监控', '内存监控', '磁盘监控', '网络监控', '服务监控',
    '数据库', '缓存服务', 'API网关', '负载均衡器', '安全系统'
  ]

  private alertTitles = [
    'CPU使用率过高', '内存不足', '磁盘空间不足', '网络延迟异常',
    '服务响应超时', '数据库连接失败', '缓存命中率下降', 'API错误率上升',
    '负载不均衡', '安全检测异常', '备份失败', '同步延迟'
  ]

  private clusters = ['生产环境', '测试环境', '开发环境', '预发布环境']
  private tags = ['紧急', '重要', '常规', '计划内', '自动化']

  // Generate system metrics
  generateSystemMetrics(): SystemMetrics {
    const baseCpuUsage = Math.random() * 100
    const baseMemoryUsage = Math.random() * 100
    const baseDiskUsage = Math.random() * 100

    return {
      timestamp: new Date(),
      cpu: {
        usage: Math.max(0, Math.min(100, baseCpuUsage + (Math.random() - 0.5) * 20)),
        cores: 4 + Math.floor(Math.random() * 8),
        temperature: 40 + Math.random() * 40,
      },
      memory: {
        usage: Math.max(0, Math.min(100, baseMemoryUsage + (Math.random() - 0.5) * 15)),
        total: 16 + Math.random() * 48, // 16-64 GB
        available: (16 + Math.random() * 48) * (1 - baseMemoryUsage / 100),
      },
      disk: {
        usage: Math.max(0, Math.min(100, baseDiskUsage + (Math.random() - 0.5) * 10)),
        total: 500 + Math.random() * 1500, // 500-2000 GB
        available: (500 + Math.random() * 1500) * (1 - baseDiskUsage / 100),
        readSpeed: Math.random() * 1000, // MB/s
        writeSpeed: Math.random() * 800,  // MB/s
      },
      network: {
        uploadSpeed: Math.random() * 1000, // Mbps
        downloadSpeed: Math.random() * 2000, // Mbps
        latency: 1 + Math.random() * 50, // ms
      },
      loadAverage: Math.random() * 10,
    }
  }

  // Generate performance data
  generatePerformanceData(metricType: MetricType, timeRange?: { start: Date; end: Date }): PerformanceData[] {
    const data: PerformanceData[] = []
    const now = new Date()
    const start = timeRange?.start || new Date(now.getTime() - 60 * 60 * 1000) // 1 hour ago
    const end = timeRange?.end || now
    const interval = 60000 // 1 minute intervals

    let current = new Date(start)

    while (current <= end) {
      let value: number
      let unit: string

      switch (metricType) {
        case 'cpu':
          value = Math.random() * 100
          unit = '%'
          break
        case 'memory':
          value = Math.random() * 100
          unit = '%'
          break
        case 'disk':
          value = Math.random() * 100
          unit = '%'
          break
        case 'network':
          value = Math.random() * 1000
          unit = 'Mbps'
          break
        case 'load':
          value = Math.random() * 10
          unit = ''
          break
        default:
          value = Math.random() * 100
          unit = '%'
      }

      data.push({
        timestamp: new Date(current),
        metricType,
        value,
        unit,
      })

      current = new Date(current.getTime() + interval)
    }

    return data
  }

  // Generate tasks
  generateTasks(count: number = MOCK_DATA_SETTINGS.TASK_COUNT): Task[] {
    const tasks: Task[] = []
    const statuses: TaskStatus[] = ['queued', 'running', 'failed', 'completed']

    for (let i = 0; i < count; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const progress = status === 'completed' ? 100 :
                     status === 'failed' ? Math.random() * 50 :
                     status === 'running' ? 20 + Math.random() * 60 : 0

      const startTime = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) // Within last 24 hours
      const endTime = status === 'completed' || status === 'failed' ?
                     new Date(startTime.getTime() + Math.random() * 4 * 60 * 60 * 1000) : // Within 4 hours
                     undefined

      tasks.push({
        id: generateId(),
        name: this.taskNames[Math.floor(Math.random() * this.taskNames.length)],
        targetCluster: this.clusters[Math.floor(Math.random() * this.clusters.length)],
        status,
        progress: Math.round(progress),
        startTime,
        endTime,
        tags: this.getRandomTags(),
        description: `执行${this.taskNames[Math.floor(Math.random() * this.taskNames.length)]}任务`,
      })
    }

    return tasks.sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
  }

  // Generate alerts
  generateAlerts(count: number = MOCK_DATA_SETTINGS.ALERT_COUNT): Alert[] {
    const alerts: Alert[] = []
    const severities: AlertSeverity[] = ['low', 'medium', 'high', 'critical']

    for (let i = 0; i < count; i++) {
      const severity = severities[Math.floor(Math.random() * severities.length)]
      const isAcknowledged = Math.random() > 0.7 // 30% chance of being acknowledged

      alerts.push({
        id: generateId(),
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Within last 24 hours
        source: this.alertSources[Math.floor(Math.random() * this.alertSources.length)],
        severity,
        title: this.alertTitles[Math.floor(Math.random() * this.alertTitles.length)],
        description: `检测到${this.alertTitles[Math.floor(Math.random() * this.alertTitles.length)]}，请及时处理`,
        isAcknowledged,
      })
    }

    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // Generate load balancer status
  generateLoadBalancerStatus(): LoadBalancerStatus {
    const health = Math.random()
    let status: 'healthy' | 'warning' | 'error'

    if (health > 0.8) {
      status = 'healthy'
    } else if (health > 0.5) {
      status = 'warning'
    } else {
      status = 'error'
    }

    const totalServers = 5 + Math.floor(Math.random() * 10)
    const activeServers = Math.floor(totalServers * (0.6 + Math.random() * 0.4))

    return {
      status,
      message: status === 'healthy' ? '负载均衡运行正常' :
               status === 'warning' ? '部分服务器负载过高' :
               '负载异常，需要立即处理',
      servers: {
        total: totalServers,
        active: activeServers,
        inactive: totalServers - activeServers,
      },
      traffic: {
        total: Math.floor(Math.random() * 10000),
        distributed: Math.floor(activeServers / totalServers * 10000),
      },
    }
  }

  // Update metrics with realistic changes
  updateMetrics(current: SystemMetrics): SystemMetrics {
    return {
      timestamp: new Date(),
      cpu: {
        usage: Math.max(0, Math.min(100, current.cpu.usage + (Math.random() - 0.5) * 10)),
        cores: current.cpu.cores,
        temperature: Math.max(20, Math.min(85, current.cpu.temperature + (Math.random() - 0.5) * 5)),
      },
      memory: {
        usage: Math.max(0, Math.min(100, current.memory.usage + (Math.random() - 0.5) * 8)),
        total: current.memory.total,
        available: current.memory.total * (1 - Math.max(0, Math.min(100, current.memory.usage + (Math.random() - 0.5) * 8)) / 100),
      },
      disk: {
        usage: Math.max(0, Math.min(100, current.disk.usage + (Math.random() - 0.5) * 3)),
        total: current.disk.total,
        available: current.disk.total * (1 - Math.max(0, Math.min(100, current.disk.usage + (Math.random() - 0.5) * 3)) / 100),
        readSpeed: Math.max(0, Math.min(2000, current.disk.readSpeed + (Math.random() - 0.5) * 200)),
        writeSpeed: Math.max(0, Math.min(1500, current.disk.writeSpeed + (Math.random() - 0.5) * 150)),
      },
      network: {
        uploadSpeed: Math.max(0, Math.min(2000, current.network.uploadSpeed + (Math.random() - 0.5) * 200)),
        downloadSpeed: Math.max(0, Math.min(3000, current.network.downloadSpeed + (Math.random() - 0.5) * 300)),
        latency: Math.max(0.1, Math.min(200, current.network.latency + (Math.random() - 0.5) * 20)),
      },
      loadAverage: Math.max(0, Math.min(20, current.loadAverage + (Math.random() - 0.5) * 2)),
    }
  }

  // Generate random alerts based on metrics
  generateAlertsFromMetrics(metrics: SystemMetrics): Alert[] {
    const alerts: Alert[] = []

    if (metrics.cpu.usage > 80) {
      alerts.push({
        id: generateId(),
        timestamp: new Date(),
        source: 'CPU监控',
        severity: metrics.cpu.usage > 90 ? 'critical' : 'high',
        title: 'CPU使用率过高',
        description: `CPU使用率达到${metrics.cpu.usage.toFixed(1)}%，超过阈值`,
        isAcknowledged: false,
      })
    }

    if (metrics.memory.usage > 85) {
      alerts.push({
        id: generateId(),
        timestamp: new Date(),
        source: '内存监控',
        severity: metrics.memory.usage > 95 ? 'critical' : 'high',
        title: '内存使用率过高',
        description: `内存使用率达到${metrics.memory.usage.toFixed(1)}%，超过阈值`,
        isAcknowledged: false,
      })
    }

    if (metrics.disk.usage > 90) {
      alerts.push({
        id: generateId(),
        timestamp: new Date(),
        source: '磁盘监控',
        severity: metrics.disk.usage > 95 ? 'critical' : 'high',
        title: '磁盘空间不足',
        description: `磁盘使用率达到${metrics.disk.usage.toFixed(1)}%，空间不足`,
        isAcknowledged: false,
      })
    }

    if (metrics.network.latency > 100) {
      alerts.push({
        id: generateId(),
        timestamp: new Date(),
        source: '网络监控',
        severity: metrics.network.latency > 200 ? 'high' : 'medium',
        title: '网络延迟异常',
        description: `网络延迟达到${metrics.network.latency.toFixed(1)}ms，响应缓慢`,
        isAcknowledged: false,
      })
    }

    return alerts
  }

  // Helper methods
  private getRandomTags(): string[] {
    const selectedTags: string[] = []
    const numTags = Math.floor(Math.random() * 3) + 1 // 1-3 tags

    for (let i = 0; i < numTags; i++) {
      const tag = this.tags[Math.floor(Math.random() * this.tags.length)]
      if (!selectedTags.includes(tag)) {
        selectedTags.push(tag)
      }
    }

    return selectedTags
  }

  // Generate server-specific metrics
  generateServerMetrics(serverCount: number = MOCK_DATA_SETTINGS.SERVER_COUNT): Record<string, SystemMetrics> {
    const metrics: Record<string, SystemMetrics> = {}

    for (let i = 0; i < serverCount; i++) {
      const serverName = this.serverNames[i % this.serverNames.length] + (i >= this.serverNames.length ? `-${Math.floor(i / this.serverNames.length) + 1}` : '')
      metrics[serverName] = this.generateSystemMetrics()
    }

    return metrics
  }
}

// Export singleton instance
export const mockDataGenerator = new MockDataGenerator()