import React, { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store'
import { dataStreamService } from '@/services'
import * as echarts from 'echarts'
import styles from './AlertTrendChart.module.scss'

interface AlertTrendChartProps {
  className?: string
}

export const AlertTrendChart: React.FC<AlertTrendChartProps> = ({ className = '' }) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const { monitoring, dataStream } = useAppStore()
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h'>('1h')

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

    // Generate time-based alert data
    const generateTimeData = (hours: number) => {
      const intervals = hours * 12 // 5-minute intervals
      const now = new Date()
      const timePoints = Array.from({ length: intervals }, (_, i) => {
        const time = new Date(now.getTime() - (intervals - 1 - i) * 5 * 60 * 1000)
        return time.toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit'
        })
      })

      // Generate sample alert trend data based on current alerts
      const baseCritical = monitoring.alerts.filter(a => a.severity === 'critical').length
      const baseHigh = monitoring.alerts.filter(a => a.severity === 'high').length
      const baseMedium = monitoring.alerts.filter(a => a.severity === 'medium').length
      const baseLow = monitoring.alerts.filter(a => a.severity === 'low').length

      const criticalData = Array.from({ length: intervals }, (_, i) => {
        const variation = Math.sin(i / intervals * Math.PI * 2) * 2 + Math.random() * 3
        return Math.max(0, baseCritical + variation)
      })

      const highData = Array.from({ length: intervals }, (_, i) => {
        const variation = Math.cos(i / intervals * Math.PI * 1.5) * 3 + Math.random() * 4
        return Math.max(0, baseHigh + variation)
      })

      const mediumData = Array.from({ length: intervals }, (_, i) => {
        const variation = Math.sin(i / intervals * Math.PI * 0.8) * 4 + Math.random() * 5
        return Math.max(0, baseMedium + variation)
      })

      const lowData = Array.from({ length: intervals }, (_, i) => {
        const variation = Math.cos(i / intervals * Math.PI * 1.2) * 5 + Math.random() * 6
        return Math.max(0, baseLow + variation)
      })

      return { timePoints, criticalData, highData, mediumData, lowData }
    }

    const hours = timeRange === '1h' ? 1 : timeRange === '6h' ? 6 : 24
    const { timePoints, criticalData, highData, mediumData, lowData } = generateTimeData(hours)

    const option = {
      title: {
        text: '告警趋势分析',
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
                  <span style="font-weight: bold; margin-left: 8px;">${Math.round(item.value)}</span>
                </div>
              `).join('')}
            </div>
          `
        }
      },
      legend: {
        top: '8%',
        data: ['严重', '高', '中', '低'],
        textStyle: {
          color: '#b8c2cc'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '18%',
        containLabel: true
      },
      toolbox: {
        feature: {
          magicType: {
            type: ['line', 'bar'],
            icon: {
              line: 'path://M4,10 L20,10 M4,15 L20,15 M4,20 L20,20',
              bar: 'path://M4,6 L16,6 L16,20 L4,20 Z'
            }
          },
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        },
        iconStyle: {
          color: '#718096'
        },
        emphasis: {
          iconStyle: {
            color: '#00d4ff'
          }
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timePoints,
        axisLine: {
          lineStyle: {
            color: '#3a4153'
          }
        },
        axisLabel: {
          color: '#718096',
          fontSize: 10,
          interval: Math.floor(timePoints.length / 8) // Show fewer labels for longer ranges
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
          name: '严重',
          type: 'line',
          smooth: true,
          data: criticalData,
          itemStyle: {
            color: '#ff4444'
          },
          lineStyle: {
            width: 2
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
                  color: 'rgba(255, 68, 68, 0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(255, 68, 68, 0.05)'
                }
              ]
            }
          },
          markPoint: {
            data: criticalData.map((value, index) => ({
              value: value > criticalData.length * 0.7 ? value : null,
              xAxis: index,
              yAxis: value
            })).filter(item => item.value !== null)
          }
        },
        {
          name: '高',
          type: 'line',
          smooth: true,
          data: highData,
          itemStyle: {
            color: '#ffa500'
          },
          lineStyle: {
            width: 2
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
                  color: 'rgba(255, 165, 0, 0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(255, 165, 0, 0.05)'
                }
              ]
            }
          }
        },
        {
          name: '中',
          type: 'line',
          smooth: true,
          data: mediumData,
          itemStyle: {
            color: '#00d4ff'
          },
          lineStyle: {
            width: 2
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
          }
        },
        {
          name: '低',
          type: 'line',
          smooth: true,
          data: lowData,
          itemStyle: {
            color: '#00ff88'
          },
          lineStyle: {
            width: 2
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
          }
        }
      ]
    }

    chartInstance.current.setOption(option, true)
  }, [monitoring.alerts, timeRange])

  // Subscribe to alert updates
  useEffect(() => {
    if (!dataStream.isActive) return

    const unsubscribe = dataStreamService.subscribeToAlerts(() => {
      // Chart will update automatically through the monitoring.alerts dependency
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
        <h3 className={styles.title}>告警趋势</h3>
        <div className={styles.controls}>
          <div className={styles.timeRangeSelector}>
            {(['1h', '6h', '24h'] as const).map(range => (
              <button
                key={range}
                className={`${styles.timeRangeButton} ${timeRange === range ? styles.active : ''}`}
                onClick={() => setTimeRange(range)}
              >
                {range === '1h' ? '1小时' : range === '6h' ? '6小时' : '24小时'}
              </button>
            ))}
          </div>
          <div className={styles.alertStats}>
            <span className={`${styles.stat} ${styles.critical}`}>
              严重: {monitoring.alerts.filter(a => a.severity === 'critical').length}
            </span>
            <span className={`${styles.stat} ${styles.unacknowledged}`}>
              未处理: {monitoring.alerts.filter(a => !a.isAcknowledged).length}
            </span>
          </div>
        </div>
      </div>
      <div ref={chartRef} className={styles.chart} />
    </div>
  )
}