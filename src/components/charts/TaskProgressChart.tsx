import React, { useEffect, useRef } from 'react'
import { useAppStore } from '@/store'
import { dataStreamService } from '@/services'
import * as echarts from 'echarts'
import styles from './TaskProgressChart.module.scss'

interface TaskProgressChartProps {
  className?: string
}

export const TaskProgressChart: React.FC<TaskProgressChartProps> = ({ className = '' }) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const { tasks, dataStream } = useAppStore()

  useEffect(() => {
    if (chartRef.current && !chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)

      chartInstance.current.setOption({
        backgroundColor: 'transparent',
        textStyle: {
          color: '#b8c2cc'
        }
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose()
        chartInstance.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!chartInstance.current) return

    // Group tasks by cluster
    const clusterData = tasks.list.reduce((acc, task) => {
      if (!acc[task.targetCluster]) {
        acc[task.targetCluster] = { queued: 0, running: 0, completed: 0, failed: 0 }
      }
      acc[task.targetCluster][task.status]++
      return acc
    }, {} as Record<string, Record<string, number>>)

    const clusters = Object.keys(clusterData)
    const queuedData = clusters.map(cluster => clusterData[cluster].queued)
    const runningData = clusters.map(cluster => clusterData[cluster].running)
    const completedData = clusters.map(cluster => clusterData[cluster].completed)
    const failedData = clusters.map(cluster => clusterData[cluster].failed)

    const option = {
      title: {
        text: '任务分布统计',
        left: 'center',
        textStyle: {
          color: '#ffffff',
          fontSize: 16,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        backgroundColor: 'rgba(10, 14, 39, 0.9)',
        borderColor: '#00d4ff',
        textStyle: {
          color: '#ffffff'
        }
      },
      legend: {
        top: '8%',
        data: ['队列中', '运行中', '已完成', '失败'],
        textStyle: {
          color: '#b8c2cc'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '18%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: clusters,
        axisLine: {
          lineStyle: {
            color: '#3a4153'
          }
        },
        axisLabel: {
          color: '#718096',
          fontSize: 11,
          interval: 0,
          rotate: clusters.length > 3 ? 45 : 0
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#3a4153'
          }
        },
        axisLabel: {
          color: '#718096'
        },
        splitLine: {
          lineStyle: {
            color: '#2a2f42'
          }
        }
      },
      series: [
        {
          name: '队列中',
          type: 'bar',
          stack: 'total',
          data: queuedData,
          itemStyle: {
            color: '#808080'
          },
          emphasis: {
            itemStyle: {
              color: '#999999'
            }
          }
        },
        {
          name: '运行中',
          type: 'bar',
          stack: 'total',
          data: runningData,
          itemStyle: {
            color: '#00d4ff'
          },
          emphasis: {
            itemStyle: {
              color: '#66e6ff'
            }
          }
        },
        {
          name: '已完成',
          type: 'bar',
          stack: 'total',
          data: completedData,
          itemStyle: {
            color: '#00ff88'
          },
          emphasis: {
            itemStyle: {
              color: '#66ffb3'
            }
          }
        },
        {
          name: '失败',
          type: 'bar',
          stack: 'total',
          data: failedData,
          itemStyle: {
            color: '#ff6b6b'
          },
          emphasis: {
            itemStyle: {
              color: '#ff9999'
            }
          }
        }
      ]
    }

    chartInstance.current.setOption(option, true)
  }, [tasks.list])

  // Subscribe to task updates
  useEffect(() => {
    if (!dataStream.isActive) return

    const unsubscribe = dataStreamService.subscribeToTasks(() => {
      // Chart will update automatically through the tasks.list dependency
    })

    return unsubscribe
  }, [dataStream.isActive])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={`${styles.chartContainer} ${className}`}>
      <div className={styles.chartHeader}>
        <h3 className={styles.title}>任务进度分析</h3>
        <div className={styles.stats}>
          <span className={styles.stat}>
            总计: {tasks.list.length}
          </span>
          <span className={`${styles.stat} ${styles.running}`}>
            运行: {tasks.list.filter(t => t.status === 'running').length}
          </span>
        </div>
      </div>
      <div ref={chartRef} className={styles.chart} />
    </div>
  )
}