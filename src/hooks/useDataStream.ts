import { useEffect, useCallback } from 'react'
import { useAppStore } from '@/store'
import { DATA_STREAM_SETTINGS } from '@/constants'
import { dataStreamService } from '@/services'

export const useDataStream = () => {
  const {
    dataStream,
    toggleDataStream: storeToggleDataStream,
    setUpdateInterval: storeSetUpdateInterval,
    updateLastUpdateTime,
    refreshData: storeRefreshData,
  } = useAppStore()

  // const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // const startDataStream = useCallback(() => {
  //   if (!dataStream.isActive && !dataStreamService.isRunning()) {
  //     dataStreamService.start()
  //   }
  // }, [dataStream.isActive])

  // const stopDataStream = useCallback(() => {
  //   if (dataStream.isActive && dataStreamService.isRunning()) {
  //     dataStreamService.stop()
  //   }
  // }, [dataStream.isActive])

  useEffect(() => {
    // Sync data stream service state with store
    if (dataStream.isActive && !dataStreamService.isRunning()) {
      dataStreamService.start()
    } else if (!dataStream.isActive && dataStreamService.isRunning()) {
      dataStreamService.stop()
    }

    return () => {
      // Cleanup on unmount
      if (dataStreamService.isRunning()) {
        dataStreamService.stop()
      }
    }
  }, [dataStream.isActive])

  const handleToggleDataStream = () => {
    storeToggleDataStream()
    // The service will be started/stopped by the effect above
  }

  const handleSetUpdateInterval = useCallback((interval: number) => {
    const validatedInterval = Math.max(
      DATA_STREAM_SETTINGS.MIN_INTERVAL,
      Math.min(DATA_STREAM_SETTINGS.MAX_INTERVAL, interval)
    )
    storeSetUpdateInterval(validatedInterval)
    dataStreamService.setUpdateInterval(validatedInterval)
  }, [storeSetUpdateInterval])

  const handleRefreshData = useCallback(async () => {
    storeRefreshData()
    await dataStreamService.refreshAll()
    updateLastUpdateTime()
  }, [storeRefreshData, updateLastUpdateTime])

  // Subscribe to real-time data updates
  useEffect(() => {
    if (dataStream.isActive) {
      const unsubscribeMetrics = dataStreamService.subscribeToMetrics(() => {
        // Metrics are already updated in the store by the service
      })

      const unsubscribeTasks = dataStreamService.subscribeToTasks(() => {
        // Tasks are already updated in the store by the service
      })

      const unsubscribeAlerts = dataStreamService.subscribeToAlerts(() => {
        // Alerts are already updated in the store by the service
      })

      return () => {
        unsubscribeMetrics()
        unsubscribeTasks()
        unsubscribeAlerts()
      }
    }
  }, [dataStream.isActive])

  return {
    isDataStreamActive: dataStream.isActive,
    updateInterval: dataStream.updateInterval,
    lastUpdate: dataStream.lastUpdate,
    toggleDataStream: handleToggleDataStream,
    setUpdateInterval: handleSetUpdateInterval,
    refreshData: handleRefreshData,
    dataStreamService,
  }
}