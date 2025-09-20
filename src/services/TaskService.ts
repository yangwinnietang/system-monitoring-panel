import {
  Task,
  TaskFilters,
  TaskStatus,
} from '@/types'
import { mockDataGenerator } from './MockDataGenerator'

export interface TaskService {
  // Task CRUD operations
  getTasks(filters?: TaskFilters): Promise<Task[]>
  getTaskById(taskId: string): Promise<Task | null>
  createTask(task: Omit<Task, 'id' | 'startTime'>): Promise<Task>
  updateTask(taskId: string, updates: Partial<Task>): Promise<Task>
  deleteTask(taskId: string): Promise<void>

  // Task operations
  startTask(taskId: string): Promise<void>
  pauseTask(taskId: string): Promise<void>
  resumeTask(taskId: string): Promise<void>
  completeTask(taskId: string): Promise<void>
  failTask(taskId: string, reason?: string): Promise<void>

  // Task progress
  updateTaskProgress(taskId: string, progress: number): Promise<void>
  getTasksByStatus(status: TaskStatus): Promise<Task[]>
  getTasksByCluster(cluster: string): Promise<Task[]>

  // Real-time updates
  subscribeToTasks(callback: (tasks: Task[]) => void): () => void
  subscribeToTaskUpdates(callback: (task: Task) => void): () => void
}

class MockTaskService implements TaskService {
  private tasks: Task[] = mockDataGenerator.generateTasks()
  private subscribers: Set<(tasks: Task[]) => void> = new Set()
  private taskUpdateSubscribers: Set<(task: Task) => void> = new Set()
  private progressInterval: NodeJS.Timeout | null = null

  constructor() {
    // Start task progress simulation
    this.startProgressSimulation()
  }

  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    // Simulate network delay
    await this.delay(100 + Math.random() * 200)

    let filteredTasks = [...this.tasks]

    if (filters) {
      if (filters.status) {
        filteredTasks = filteredTasks.filter(task => task.status === filters.status)
      }

      if (filters.cluster) {
        filteredTasks = filteredTasks.filter(task => task.targetCluster === filters.cluster)
      }

      if (filters.tags && filters.tags.length > 0) {
        filteredTasks = filteredTasks.filter(task =>
          filters.tags!.some(tag => task.tags.includes(tag))
        )
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredTasks = filteredTasks.filter(task =>
          task.name.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower) ||
          task.targetCluster.toLowerCase().includes(searchLower)
        )
      }
    }

    return filteredTasks.sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    await this.delay(50 + Math.random() * 100)
    return this.tasks.find(task => task.id === taskId) || null
  }

  async createTask(taskData: Omit<Task, 'id' | 'startTime'>): Promise<Task> {
    await this.delay(200 + Math.random() * 200)

    const newTask: Task = {
      ...taskData,
      id: this.generateId(),
      startTime: new Date(),
    }

    this.tasks.unshift(newTask)
    this.notifyTaskUpdate(newTask)
    this.notifyTasksChanged()

    return newTask
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    await this.delay(150 + Math.random() * 150)

    const taskIndex = this.tasks.findIndex(task => task.id === taskId)
    if (taskIndex === -1) {
      throw new Error(`Task with id ${taskId} not found`)
    }

    const updatedTask = { ...this.tasks[taskIndex], ...updates }
    this.tasks[taskIndex] = updatedTask

    this.notifyTaskUpdate(updatedTask)
    this.notifyTasksChanged()

    return updatedTask
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.delay(100 + Math.random() * 100)

    const taskIndex = this.tasks.findIndex(task => task.id === taskId)
    if (taskIndex === -1) {
      throw new Error(`Task with id ${taskId} not found`)
    }

    this.tasks.splice(taskIndex, 1)
    this.notifyTasksChanged()
  }

  async startTask(taskId: string): Promise<void> {
    await this.updateTask(taskId, { status: 'running' })
  }

  async pauseTask(taskId: string): Promise<void> {
    const task = await this.getTaskById(taskId)
    if (!task) {
      throw new Error(`Task with id ${taskId} not found`)
    }

    if (task.status === 'running') {
      await this.updateTask(taskId, { status: 'queued' })
    }
  }

  async resumeTask(taskId: string): Promise<void> {
    const task = await this.getTaskById(taskId)
    if (!task) {
      throw new Error(`Task with id ${taskId} not found`)
    }

    if (task.status === 'queued') {
      await this.updateTask(taskId, { status: 'running' })
    }
  }

  async completeTask(taskId: string): Promise<void> {
    await this.updateTask(taskId, {
      status: 'completed',
      progress: 100,
      endTime: new Date(),
    })
  }

  async failTask(taskId: string): Promise<void> {
    await this.updateTask(taskId, {
      status: 'failed',
      endTime: new Date(),
    })
  }

  async updateTaskProgress(taskId: string, progress: number): Promise<void> {
    await this.updateTask(taskId, { progress: Math.max(0, Math.min(100, progress)) })
  }

  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    return this.getTasks({ status })
  }

  async getTasksByCluster(cluster: string): Promise<Task[]> {
    return this.getTasks({ cluster })
  }

  subscribeToTasks(callback: (tasks: Task[]) => void): () => void {
    this.subscribers.add(callback)

    // Send current tasks immediately
    callback([...this.tasks])

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback)
    }
  }

  subscribeToTaskUpdates(callback: (task: Task) => void): () => void {
    this.taskUpdateSubscribers.add(callback)

    // Return unsubscribe function
    return () => {
      this.taskUpdateSubscribers.delete(callback)
    }
  }

  // Private methods
  private startProgressSimulation(): void {
    this.progressInterval = setInterval(() => {
      const runningTasks = this.tasks.filter(task => task.status === 'running')

      runningTasks.forEach(task => {
        // Simulate progress increase
        const progressIncrease = Math.random() * 5 // 0-5% progress per update
        const newProgress = Math.min(100, task.progress + progressIncrease)

        if (newProgress !== task.progress) {
          const updatedTask = { ...task, progress: newProgress }

          // Update task in array
          const taskIndex = this.tasks.findIndex(t => t.id === task.id)
          if (taskIndex !== -1) {
            this.tasks[taskIndex] = updatedTask
          }

          // Auto-complete task if progress reaches 100%
          if (newProgress >= 100) {
            updatedTask.status = 'completed'
            updatedTask.endTime = new Date()
            this.tasks[taskIndex] = updatedTask
          }

          this.notifyTaskUpdate(updatedTask)
        }
      })

      // Randomly start some queued tasks
      const queuedTasks = this.tasks.filter(task => task.status === 'queued')
      if (queuedTasks.length > 0 && Math.random() > 0.7) {
        const taskToStart = queuedTasks[Math.floor(Math.random() * queuedTasks.length)]
        this.startTask(taskToStart.id).catch(console.error)
      }

      // Randomly generate new tasks
      if (Math.random() > 0.8 && this.tasks.length < 50) {
        const newTaskData = {
          name: mockDataGenerator['taskNames'][Math.floor(Math.random() * mockDataGenerator['taskNames'].length)],
          targetCluster: mockDataGenerator['clusters'][Math.floor(Math.random() * mockDataGenerator['clusters'].length)],
          status: 'queued' as TaskStatus,
          progress: 0,
          tags: mockDataGenerator['getRandomTags'](),
          description: `自动生成的${mockDataGenerator['taskNames'][Math.floor(Math.random() * mockDataGenerator['taskNames'].length)]}任务`,
        }
        this.createTask(newTaskData).catch(console.error)
      }
    }, 3000) // Update every 3 seconds
  }

  private notifyTasksChanged(): void {
    this.subscribers.forEach(callback => {
      try {
        callback([...this.tasks])
      } catch (error) {
        console.error('Error in tasks subscriber:', error)
      }
    })
  }

  private notifyTaskUpdate(task: Task): void {
    this.taskUpdateSubscribers.forEach(callback => {
      try {
        callback(task)
      } catch (error) {
        console.error('Error in task update subscriber:', error)
      }
    })
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  // Cleanup
  destroy(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval)
      this.progressInterval = null
    }
    this.subscribers.clear()
    this.taskUpdateSubscribers.clear()
  }

  // Get task statistics
  getTaskStats(): {
    total: number
    byStatus: Record<TaskStatus, number>
    byCluster: Record<string, number>
    averageProgress: number
  } {
    const byStatus: Record<TaskStatus, number> = {
      queued: 0,
      running: 0,
      failed: 0,
      completed: 0,
    }

    const byCluster: Record<string, number> = {}

    let totalProgress = 0

    this.tasks.forEach(task => {
      byStatus[task.status]++
      byCluster[task.targetCluster] = (byCluster[task.targetCluster] || 0) + 1
      totalProgress += task.progress
    })

    return {
      total: this.tasks.length,
      byStatus,
      byCluster,
      averageProgress: this.tasks.length > 0 ? totalProgress / this.tasks.length : 0,
    }
  }
}

// Export singleton instance
export const taskService = new MockTaskService()