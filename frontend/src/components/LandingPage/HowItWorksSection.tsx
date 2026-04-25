import { motion, useReducedMotion } from 'framer-motion'
import { Box, Chip, Container, Paper, Typography } from '@mui/material'
import { FiLayers, FiShield, FiSun } from 'react-icons/fi'
import Reveal from './Reveal'

const MotionPaper = motion(Paper)

const steps = [
  {
    title: 'Protect the agricultural layer',
    copy: 'Polytunnels continue supporting high-value crops, season extension, and more consistent growing conditions.',
    icon: FiLayers,
  },
  {
    title: 'Introduce solar above existing structure',
    copy: 'Generation is added as an upper layer so the site gains value without becoming single-use infrastructure.',
    icon: FiSun,
  },
  {
    title: 'Carry one joined-up planning story',
    copy: 'Growers, developers, councils, and communities can align around productivity, resilience, and local value.',
    icon: FiShield,
  },
]

const itemEase = [0.22, 1, 0.36, 1] as const

/** Explains the stacked solar model in three steps. */
function HowItWorksSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <Box component="section" id="how-it-works" sx={{ py: { xs: 10, md: 14 }, bgcolor: '#f8fbfa' }}>
      <Container maxWidth={false} sx={{ width: 'min(1200px, calc(100% - 48px))' }}>
        <Reveal sx={{ display: 'grid', gap: 5 }}>
          <Box sx={{ maxWidth: 820, display: 'grid', gap: 2 }}>
            <Chip label="How it works" sx={{ justifySelf: 'start', fontWeight: 600 }} />
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3.2rem' }, lineHeight: 1.03 }}>
              One site. Two productive layers. A practical model for UK deployment.
            </Typography>
            <Typography sx={{ color: 'text.secondary', maxWidth: '62ch' }}>
              The structure is simple enough for boardrooms and credible enough for planning conversations.
            </Typography>
          </Box>

          <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2.5 }}>
            {steps.map((step, index) => {
              const Icon = step.icon

              return (
                <Box component="li" key={step.title} sx={{ listStyle: 'none' }}>
                  <MotionPaper
                    variant="outlined"
                    initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                    whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={shouldReduceMotion ? undefined : { duration: 0.5, delay: index * 0.08, ease: itemEase }}
                    sx={{ p: 3, borderRadius: 3 }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.75 }}>
                      <Chip label={`0${index + 1}`} size="small" variant="outlined" sx={{ minWidth: 46 }} />
                      <Box sx={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid', borderColor: 'divider', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'text.primary' }}>
                        <Icon size={16} />
                      </Box>
                    </Box>
                    <Typography variant="h6" sx={{ fontSize: '1.2rem', mb: 1.25 }}>
                      {step.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{step.copy}</Typography>
                  </MotionPaper>
                </Box>
              )
            })}
          </Box>
        </Reveal>
      </Container>
    </Box>
  )
}

export default HowItWorksSection
