import { motion, useReducedMotion } from 'framer-motion'
import { Box, Chip, Container, Typography } from '@mui/material'
import Reveal from './Reveal'

const planningPoints = [
  {
    title: 'Keep productivity visible',
    copy: 'Answer food-displacement concerns with sites that are still clearly working for agriculture.',
  },
  {
    title: 'Improve stakeholder conversations',
    copy: 'Create a more constructive discussion with councils, neighbours, and rural stakeholders.',
  },
  {
    title: 'Show additive local value',
    copy: 'Build confidence through projects that deliver more than one outcome from the same footprint.',
  },
]

const MotionBox = motion(Box)
const itemEase = [0.22, 1, 0.36, 1] as const

/** Frames the project around UK planning and community realities. */
function PlanningCommunitySection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <Box component="section" id="planning" sx={{ py: { xs: 10, md: 14 }, bgcolor: '#0d2431', color: 'common.white' }}>
      <Container maxWidth={false} sx={{ width: 'min(1200px, calc(100% - 48px))' }}>
        <Reveal sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' }, gap: { xs: 4, md: 5 } }}>
          <Box sx={{ display: 'grid', gap: 2.1, maxWidth: 690 }}>
            <Chip
              label="Planning and community"
              sx={{
                justifySelf: 'start',
                color: 'rgba(255,255,255,0.88)',
                border: '1px solid rgba(255,255,255,0.18)',
                bgcolor: 'rgba(255,255,255,0.06)',
              }}
            />
            <Typography variant="h2" sx={{ color: 'common.white', fontSize: { xs: '2rem', md: '3.15rem' }, lineHeight: 1.03 }}>
              Built for a stronger UK planning conversation.
            </Typography>
            <Typography sx={{ color: 'rgba(232,245,249,0.82)', maxWidth: '56ch' }}>
              Energy developers have capital to deploy, but suitable land, public confidence, and planning headroom are
              harder to secure. A dual land-use model helps shift the conversation from land loss to land productivity.
            </Typography>
          </Box>

          <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none', display: 'grid', gap: 1.8 }}>
            {planningPoints.map((point, index) => (
              <Box component="li" key={point.title} sx={{ listStyle: 'none' }}>
                <MotionBox
                  initial={shouldReduceMotion ? undefined : { opacity: 0, x: 14 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.55 }}
                  transition={shouldReduceMotion ? undefined : { duration: 0.45, delay: index * 0.08, ease: itemEase }}
                  sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}
                >
                  <Typography sx={{ color: 'rgba(73,200,137,0.95)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.12em', fontSize: '0.72rem' }}>
                    0{index + 1}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.8, mb: 0.6, color: 'common.white' }}>
                    {point.title}
                  </Typography>
                  <Typography sx={{ color: 'rgba(232,245,249,0.78)' }}>{point.copy}</Typography>
                </MotionBox>
              </Box>
            ))}
          </Box>
        </Reveal>
      </Container>
    </Box>
  )
}

export default PlanningCommunitySection
