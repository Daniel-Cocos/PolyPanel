import type { ReactNode } from 'react'
import type { SxProps, Theme } from '@mui/material/styles'
import { Box } from '@mui/material'
import { motion, useReducedMotion } from 'framer-motion'

type RevealProps = {
  children: ReactNode
  delay?: number
  sx?: SxProps<Theme>
}

const MotionBox = motion(Box)
const revealEase = [0.22, 1, 0.36, 1] as const

/** Reveals content with a small viewport-triggered transition. */
function Reveal({ children, delay = 0, sx }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <Box sx={sx}>{children}</Box>
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: revealEase }}
      sx={sx}
    >
      {children}
    </MotionBox>
  )
}

export default Reveal
