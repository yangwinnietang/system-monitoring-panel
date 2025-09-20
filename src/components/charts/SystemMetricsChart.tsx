import React, { useEffect, useRef } from 'react'
import { useAppStore } from '@/store'
import { dataStreamService } from '@/services'
import * as echarts from 'echarts'
import styles from './SystemMetricsChart.module.scss'

interface SystemMetricsChartProps {
  className?: string
}

export const SystemMetricsChart: React.FC<SystemMetricsChartProps> = ({ className = '' }) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const { monitoring, dataStream } = useAppStore()
  const historicalData = useRef({
    cpu: Array.from({ length: 60 }, () => Math.random() * 30 + 20),
    memory: Array.from({ length: 60 }, () => Math.random() * 40 + 30),
    disk: Array.from({ length: 60 }, () => Math.random() * 25 + 15),
    timestamps: Array.from({ length: 60 }, (_, i) => {
      const time = new Date()
      time.setSeconds(time.getSeconds() - (59 - i))
      return time.toLocaleTimeString('zh-CN')
    })
  })

  useEffect(() => {
    if (!chartInstance.current || !monitoring.systemMetrics) return

    // Update historical data with current metrics
    const updateHistoricalData = () => {
      if (dataStream.isActive && monitoring.systemMetrics) {
        // Add new data point
        historicalData.current.cpu.shift()
        historicalData.current.cpu.push(monitoring.systemMetrics.cpu.usage)

        historicalData.current.memory.shift()
        historicalData.current.memory.push(monitoring.systemMetrics.memory.usage)

        historicalData.current.disk.shift()
        historicalData.current.disk.push(monitoring.systemMetrics.disk.usage)

        historicalData.current.timestamps.shift()
        historicalData.current.timestamps.push(new Date().toLocaleTimeString('zh-CN'))
      }
    }

    updateHistoricalData()

    const option = {
      backgroundColor: 'transparent',
      title: {
        text: '系统资源使用率',
        left: 'center',
        textStyle: {
          color: '#ffffff',
          fontSize: 16,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(10, 14, 39, 0.9)',
        borderColor: '#00d4ff',
        textStyle: {
          color: '#ffffff'
        },
        formatter: (params: any) => {
          const time = params[0].axisValue
          return `
            <div style="padding: 8px;">
              <div style="margin-bottom: 8px; font-weight: bold;">${time}</div>
              ${params.map((item: any) => `
                <div style="display: flex; align-items: center; margin-bottom: 4px;">
                  <span style="display: inline-block; width: 12px; height: 12px; background: ${item.color}; margin-right: 8px; border-radius: 2px;"></span>
                  <span style="flex: 1;">${item.seriesName}:</span>
                  <span style="font-weight: bold; margin-left: 8px;">${item.value.toFixed(1)}%</span>
                </div>
              `).join('')}
            </div>
          `
        }
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
            title: {
              zoom: '区域缩放',
              back: '缩放还原'
            }
          },
          restore: {
            title: '还原'
          },
          saveAsImage: {
            title: '保存为图片'
          }
        },
        iconStyle: {
          borderColor: '#718096'
        },
        emphasis: {
          iconStyle: {
            borderColor: '#00d4ff'
          }
        }
      },
      legend: {
        top: '8%',
        data: ['CPU', '内存', '磁盘'],
        textStyle: {
          color: '#b8c2cc'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        top: '18%',
        containLabel: true
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
          zoomLock: false
        },
        {
          start: 0,
          end: 100,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#3a4153',
            borderColor: '#00d4ff'
          },
          textStyle: {
            color: '#718096'
          }
        }
      ],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: historicalData.current.timestamps,
        axisLine: {
          lineStyle: {
            color: '#3a4153'
          }
        },
        axisLabel: {
          color: '#718096',
          fontSize: 10,
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLine: {
          lineStyle: {
            color: '#3a4153'
          }
        },
        axisLabel: {
          color: '#718096',
          formatter: '{value}%'
        },
        splitLine: {
          lineStyle: {
            color: '#2a2f42'
          }
        }
      },
      series: [
        {
          name: 'CPU',
          type: 'line',
          smooth: true,
          data: historicalData.current.cpu,
          itemStyle: {
            color: '#00d4ff'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(0, 212, 255, 0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(0, 212, 255, 0.05)'
                }
              ]
            }
          },
          emphasis: {
            focus: 'series'
          },
          animation: true,
          animationDuration: 300,
          animationEasing: 'cubicOut'
        },
        {
          name: '内存',
          type: 'line',
          smooth: true,
          data: historicalData.current.memory,
          itemStyle: {
            color: '#00ff88'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(0, 255, 136, 0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(0, 255, 136, 0.05)'
                }
              ]
            }
          },
          emphasis: {
            focus: 'series'
          },
          animation: true,
          animationDuration: 300,
          animationEasing: 'cubicOut'
        },
        {
          name: '磁盘',
          type: 'line',
          smooth: true,
          data: historicalData.current.disk,
          itemStyle: {
            color: '#ff6b6b'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(255, 107, 107, 0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(255, 107, 107, 0.05)'
                }
              ]
            }
          },
          emphasis: {
            focus: 'series'
          },
          animation: true,
          animationDuration: 300,
          animationEasing: 'cubicOut'
        }
      ],
      animation: true,
      animationDurationUpdate: 300,
      animationEasingUpdate: 'cubicOut' as const
    }

    chartInstance.current.setOption(option, true)
  }, [monitoring.systemMetrics])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!dataStream.isActive) return

    const unsubscribe = dataStreamService.subscribeToMetrics(() => {
      // Chart will update automatically through the monitoring.systemMetrics dependency
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
        <h3 className={styles.title}>系统性能趋势</h3>
        <span className={styles.updateTime}>
          {dataStream.lastUpdate?.toLocaleTimeString('zh-CN') || '无数据'}
        </span>
      </div>
      <div ref={chartRef} className={styles.chart} />
    </div>
  )
}