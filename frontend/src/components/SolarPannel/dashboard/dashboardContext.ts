import { createContext } from 'react'
import type { DashboardContextValue } from './context'

const DashboardContext = createContext<DashboardContextValue | null>(null)

export default DashboardContext
