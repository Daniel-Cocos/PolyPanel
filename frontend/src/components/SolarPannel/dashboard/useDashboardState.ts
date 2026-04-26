import { useContext } from 'react'
import DashboardContext from './dashboardContext'

/** Returns the shared dashboard state and actions. */
export function useDashboardState() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboardState must be used inside DashboardProvider')
  }

  return context
}
