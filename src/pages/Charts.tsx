import React from 'react'
import { ChartDashboard } from '@/components/charts/ChartDashboard'
import styles from './Charts.module.scss'

const Charts: React.FC = () => {
  return (
    <div className={styles.chartsPage}>
      <div className={styles.content}>
        <ChartDashboard className={styles.chartDashboard} />
      </div>
    </div>
  )
}

export default Charts