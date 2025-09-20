// App Constants

// Data stream settings
export const DATA_STREAM_SETTINGS = {
  DEFAULT_INTERVAL: 2000, // 2 seconds
  MIN_INTERVAL: 1000, // 1 second
  MAX_INTERVAL: 10000, // 10 seconds
  MAX_DATA_POINTS: 100, // Maximum data points to keep in memory
  MAX_ALERTS: 50, // Maximum alerts to keep in memory
} as const

// Chart settings
export const CHART_SETTINGS = {
  DEFAULT_HEIGHT: 300,
  DEFAULT_WIDTH: '100%',
  ANIMATION_DURATION: 1000,
  REFRESH_INTERVAL: 2000,
  THEME: 'dark',
} as const

// Alert settings
export const ALERT_SETTINGS = {
  SEVERITY_LEVELS: ['low', 'medium', 'high', 'critical'] as const,
  DEFAULT_SOUND_ENABLED: false,
  AUTO_DISMISS_TIMEOUT: 5000, // 5 seconds
  MAX_VISIBLE_ALERTS: 5,
} as const

// Task settings
export const TASK_SETTINGS = {
  STATUSES: ['queued', 'running', 'failed', 'completed'] as const,
  MAX_TASKS: 100,
  PROGRESS_INTERVAL: 1000, // 1 second
  AUTO_REFRESH_INTERVAL: 5000, // 5 seconds
} as const

// UI settings
export const UI_SETTINGS = {
  THEMES: ['dark', 'light'] as const,
  DEFAULT_THEME: 'dark',
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1280,
  },
  LAYOUT: {
    HEADER_HEIGHT: 60,
    SIDEBAR_WIDTH: 300,
    STATUS_HEIGHT_PERCENTAGE: 30,
  },
} as const

// API endpoints (for future expansion)
export const API_ENDPOINTS = {
  MONITORING: '/api/monitoring',
  TASKS: '/api/tasks',
  ALERTS: '/api/alerts',
  SYSTEM: '/api/system',
} as const

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'system-monitoring-theme',
  USER_PREFERENCES: 'system-monitoring-preferences',
  DATA_STREAM_SETTINGS: 'system-monitoring-datastream',
} as const

// Event types
export const EVENT_TYPES = {
  DATA_UPDATED: 'data:updated',
  ALERT_CREATED: 'alert:created',
  TASK_UPDATED: 'task:updated',
  THEME_CHANGED: 'theme:changed',
  ERROR_OCCURRED: 'error:occurred',
} as const

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  TOGGLE_THEME: { key: 't', ctrl: true, alt: false },
  TOGGLE_DATA_STREAM: { key: 'space', ctrl: false, alt: false },
  REFRESH_DATA: { key: 'r', ctrl: true, alt: false },
  SEARCH: { key: '/', ctrl: false, alt: false },
  ESCAPE: { key: 'Escape', ctrl: false, alt: false },
} as const

// Chart types
export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  GAUGE: 'gauge',
  AREA: 'area',
} as const

// Metric types
export const METRIC_TYPES = {
  CPU: 'cpu',
  MEMORY: 'memory',
  DISK: 'disk',
  NETWORK: 'network',
  LOAD: 'load',
} as const

// Default chart colors
export const CHART_COLORS = {
  CPU: '#00d4ff',
  MEMORY: '#00ff88',
  DISK: '#ffb800',
  NETWORK: '#ff4757',
  LOAD: '#a855f7',
  SUCCESS: '#00ff88',
  WARNING: '#ffb800',
  ERROR: '#ff4757',
  INFO: '#00d4ff',
} as const

// Mock data generation settings
export const MOCK_DATA_SETTINGS = {
  SERVER_COUNT: 5,
  TASK_COUNT: 20,
  ALERT_COUNT: 15,
  METRICS_RANGE: {
    CPU: { min: 0, max: 100 },
    MEMORY: { min: 0, max: 100 },
    DISK: { min: 0, max: 100 },
    NETWORK: { min: 0, max: 1000 },
    LOAD: { min: 0, max: 10 },
  },
  UPDATE_INTERVAL: 2000,
} as const

// Performance monitoring settings
export const PERFORMANCE_SETTINGS = {
  ENABLED: true,
  SAMPLE_INTERVAL: 5000, // 5 seconds
  MAX_SAMPLES: 100,
  THRESHOLDS: {
    CPU: 80, // 80%
    MEMORY: 85, // 85%
    DISK: 90, // 90%
    LOAD: 5, // 5.0
  },
} as const

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_SOUND_NOTIFICATIONS: false,
  ENABLE_DESKTOP_NOTIFICATIONS: false,
  ENABLE_DATA_EXPORT: true,
  ENABLE_REAL_TIME_CHARTS: true,
  ENABLE_TASK_SCHEDULING: false,
  ENABLE_USER_MANAGEMENT: false,
} as const