import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { AppState, SystemMetrics, Task, Alert, PerformanceData } from '@/types'

interface AppStore extends AppState {
  // Data stream actions
  toggleDataStream: () => void
  refreshData: () => void
  setUpdateInterval: (interval: number) => void
  updateLastUpdateTime: () => void

  // Monitoring actions
  setSystemMetrics: (metrics: SystemMetrics) => void
  addPerformanceData: (data: PerformanceData) => void
  setPerformanceData: (data: PerformanceData[]) => void
  addAlert: (alert: Alert) => void
  setAlerts: (alerts: Alert[]) => void
  acknowledgeAlert: (alertId: string) => void

  // Task actions
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  selectTask: (taskId: string | null) => void
  updateTaskFilters: (filters: Partial<AppState['tasks']['filters']>) => void

  // UI actions
  setTheme: (theme: 'dark' | 'light') => void
  setSearchQuery: (query: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

const initialState: AppState = {
  dataStream: {
    isActive: false,
    updateInterval: 2000,
    lastUpdate: null,
  },
  monitoring: {
    systemMetrics: null,
    performanceData: [],
    alerts: [],
  },
  tasks: {
    list: [],
    selectedTaskId: null,
    filters: {},
  },
  ui: {
    theme: 'dark',
    searchQuery: '',
    loading: false,
    error: null,
  },
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Data stream actions
        toggleDataStream: () => {
          set((state) => ({
            dataStream: {
              ...state.dataStream,
              isActive: !state.dataStream.isActive,
            },
          }))
        },

        refreshData: () => {
          set((state) => ({
            ui: {
              ...state.ui,
              loading: true,
            },
          }))
          // This will trigger data refresh in services
          setTimeout(() => {
            set((state) => ({
              ui: {
                ...state.ui,
                loading: false,
              },
            }))
          }, 500)
        },

        setUpdateInterval: (interval) => {
          set((state) => ({
            dataStream: {
              ...state.dataStream,
              updateInterval: interval,
            },
          }))
        },

        updateLastUpdateTime: () => {
          set((state) => ({
            dataStream: {
              ...state.dataStream,
              lastUpdate: new Date(),
            },
          }))
        },

        // Monitoring actions
        setSystemMetrics: (metrics) => {
          set((state) => ({
            monitoring: {
              ...state.monitoring,
              systemMetrics: metrics,
            },
          }))
        },

        addPerformanceData: (data) => {
          set((state) => {
            const newData = [...state.monitoring.performanceData, data]
            // Keep only last 100 data points to prevent memory issues
            if (newData.length > 100) {
              newData.shift()
            }
            return {
              monitoring: {
                ...state.monitoring,
                performanceData: newData,
              },
            }
          })
        },

        setPerformanceData: (data) => {
          set((state) => ({
            monitoring: {
              ...state.monitoring,
              performanceData: data,
            },
          }))
        },

        addAlert: (alert) => {
          set((state) => ({
            monitoring: {
              ...state.monitoring,
              alerts: [alert, ...state.monitoring.alerts].slice(0, 50), // Keep last 50 alerts
            },
          }))
        },

        setAlerts: (alerts) => {
          set((state) => ({
            monitoring: {
              ...state.monitoring,
              alerts,
            },
          }))
        },

        acknowledgeAlert: (alertId) => {
          set((state) => ({
            monitoring: {
              ...state.monitoring,
              alerts: state.monitoring.alerts.map((alert) =>
                alert.id === alertId ? { ...alert, isAcknowledged: true } : alert
              ),
            },
          }))
        },

        // Task actions
        setTasks: (tasks) => {
          set((state) => ({
            tasks: {
              ...state.tasks,
              list: tasks,
            },
          }))
        },

        addTask: (task) => {
          set((state) => ({
            tasks: {
              ...state.tasks,
              list: [task, ...state.tasks.list],
            },
          }))
        },

        updateTask: (taskId, updates) => {
          set((state) => ({
            tasks: {
              ...state.tasks,
              list: state.tasks.list.map((task) =>
                task.id === taskId ? { ...task, ...updates } : task
              ),
            },
          }))
        },

        selectTask: (taskId) => {
          set((state) => ({
            tasks: {
              ...state.tasks,
              selectedTaskId: taskId,
            },
          }))
        },

        updateTaskFilters: (filters) => {
          set((state) => ({
            tasks: {
              ...state.tasks,
              filters: { ...state.tasks.filters, ...filters },
            },
          }))
        },

        // UI actions
        setTheme: (theme) => {
          set((state) => ({
            ui: {
              ...state.ui,
              theme,
            },
          }))
        },

        setSearchQuery: (query) => {
          set((state) => ({
            ui: {
              ...state.ui,
              searchQuery: query,
            },
          }))
        },

        setLoading: (loading) => {
          set((state) => ({
            ui: {
              ...state.ui,
              loading,
            },
          }))
        },

        setError: (error) => {
          set((state) => ({
            ui: {
              ...state.ui,
              error,
            },
          }))
        },

        clearError: () => {
          set((state) => ({
            ui: {
              ...state.ui,
              error: null,
            },
          }))
        },
      }),
      {
        name: 'system-monitoring-storage',
        partialize: (state) => ({
          ui: {
            theme: state.ui.theme,
          },
        }),
      }
    ),
    {
      name: 'system-monitoring-store',
    }
  )
)