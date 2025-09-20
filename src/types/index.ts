export interface SystemMetrics {
  timestamp: Date
  cpu: {
    usage: number
    cores: number
    temperature: number
  }
  memory: {
    usage: number
    total: number
    available: number
  }
  disk: {
    usage: number
    total: number
    available: number
    readSpeed: number
    writeSpeed: number
  }
  network: {
    uploadSpeed: number
    downloadSpeed: number
    latency: number
  }
  loadAverage: number
}

export interface Task {
  id: string
  name: string
  targetCluster: string
  status: TaskStatus
  progress: number
  startTime: Date
  endTime?: Date
  tags: string[]
  description?: string
}

export type TaskStatus = 'queued' | 'running' | 'failed' | 'completed'

export interface Alert {
  id: string
  timestamp: Date
  source: string
  severity: AlertSeverity
  title: string
  description: string
  isAcknowledged: boolean
  metadata?: Record<string, any>
}

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical' | 'warning' | 'info'

export interface PerformanceData {
  timestamp: Date
  metricType: MetricType
  value: number
  unit: string
}

export type MetricType = 'cpu' | 'memory' | 'disk' | 'network' | 'load'

export interface TaskFilters {
  status?: TaskStatus
  cluster?: string
  tags?: string[]
  search?: string
}

export interface AlertFilters {
  severity?: AlertSeverity
  source?: string
  acknowledged?: boolean
  timeRange?: {
    start: Date
    end: Date
  }
}

export interface TimeRange {
  start: Date
  end: Date
}

export interface LoadBalancerStatus {
  status: 'healthy' | 'warning' | 'error'
  message: string
  servers: {
    total: number
    active: number
    inactive: number
  }
  traffic: {
    total: number
    distributed: number
  }
}

export interface AppState {
  dataStream: {
    isActive: boolean
    updateInterval: number
    lastUpdate: Date | null
  }
  monitoring: {
    systemMetrics: SystemMetrics | null
    performanceData: PerformanceData[]
    alerts: Alert[]
  }
  tasks: {
    list: Task[]
    selectedTaskId: string | null
    filters: TaskFilters
  }
  ui: {
    theme: 'dark' | 'light'
    searchQuery: string
    loading: boolean
    error: string | null
  }
}