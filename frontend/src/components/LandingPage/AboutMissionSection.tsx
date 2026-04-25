import { motion, useReducedMotion } from 'framer-motion'
import { Box, Chip, Container, Typography } from '@mui/material'
import Reveal from './Reveal'

const principles = [
  {
    title: 'Disciplined site selection',
    copy: 'Prioritize projects where agricultural logic, infrastructure fit, and stakeholder positioning align.',
  },
  {
    title: 'Partner alignment',
    copy: 'Bring growers, developers, and delivery partners into the same discussion early.',
  },
  {
    title: 'Commercial credibility',
    copy: 'Frame each project as practical, investable, and legible to non-technical decision-makers.',
  },
]

const MotionBox = motion(Box)
const itemEase = [0.22, 1, 0.36, 1] as const

/** States the wider company mission behind the landing page. */
function AboutMissionSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <Box component="section" sx={{ py: { xs: 10, md: 14 }, bgcolor: '#f1f7f4' }}>
      <Container maxWidth={false} sx={{ width: 'min(1200px, calc(100% - 48px))' }}>
        <Reveal sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' }, gap: { xs: 4, md: 5 } }}>
          <Box sx={{ display: 'grid', gap: 2.1 }}>
            <Chip label="Mission" sx={{ justifySelf: 'start', fontWeight: 600 }} />
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3.1rem' }, lineHeight: 1.04, maxWidth: '17ch' }}>
              Bring new solar capacity online without treating farmland as disposable.
            </Typography>
            <Typography sx={{ color: 'text.secondary', maxWidth: '58ch' }}>
              The next generation of UK energy projects needs a better relationship with the countryside. Stacked solar
              above polytunnels combines food production, clean power, and local legitimacy on the same footprint.
            </Typography>
          </Box>

          <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none', display: 'grid', gap: 1.7 }}>
            {principles.map((principle, index) => (
              <Box component="li" key={principle.title} sx={{ listStyle: 'none' }}>
                <MotionBox
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={shouldReduceMotion ? undefined : { duration: 0.45, delay: index * 0.08, ease: itemEase }}
                  sx={{ pt: 1.8, borderTop: '1px solid', borderColor: 'divider' }}
                >
                  <Typography sx={{ color: 'primary.main', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.72rem' }}>
                    0{index + 1}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.6, mb: 0.6, fontSize: '1.2rem' }}>
                    {principle.title}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{principle.copy}</Typography>
                </MotionBox>
              </Box>
            ))}
          </Box>
        </Reveal>
      </Container>
    </Box>
  )
}

export default AboutMissionSection
