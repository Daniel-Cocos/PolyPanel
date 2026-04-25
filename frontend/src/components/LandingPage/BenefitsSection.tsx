import { motion, useReducedMotion } from 'framer-motion'
import { Box, Chip, Container, List, ListItem, Typography } from '@mui/material'
import Reveal from './Reveal'

const benefitColumns = [
  {
    title: 'For farmers',
    label: 'Agricultural continuity',
    points: [
      'Retain productive agricultural use instead of surrendering land to single-purpose generation.',
      'Open an additional revenue conversation around infrastructure already tied to growing environments.',
      'Strengthen crop resilience with covered systems familiar to intensive horticulture.',
    ],
  },
  {
    title: 'For energy companies',
    label: 'Development leverage',
    points: [
      'Unlock projects where suitable land and social licence are increasingly constrained.',
      'Present a balanced planning case by pairing generation with active agricultural function.',
      'Work with growers and communities on projects that feel additive rather than extractive.',
    ],
  },
]

const MotionBox = motion(Box)
const itemEase = [0.22, 1, 0.36, 1] as const

/** Splits the commercial and operational upside by audience. */
function BenefitsSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <Box component="section" id="benefits" sx={{ py: { xs: 10, md: 14 }, bgcolor: '#eef4f2' }}>
      <Container maxWidth={false} sx={{ width: 'min(1200px, calc(100% - 48px))' }}>
        <Reveal sx={{ display: 'grid', gap: 5 }}>
          <Box sx={{ display: 'grid', gap: 2, maxWidth: 900 }}>
            <Chip label="Why this matters" sx={{ justifySelf: 'start', fontWeight: 600 }} />
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3.2rem' }, lineHeight: 1.03, maxWidth: '18ch' }}>
              Designed around the two groups that need this model to work.
            </Typography>
            <Typography sx={{ color: 'text.secondary', maxWidth: '58ch' }}>
              This is land efficiency and delivery logic, not abstract sustainability language.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: { xs: 3, md: 4 } }}>
            {benefitColumns.map((column, index) => (
              <MotionBox
                key={column.title}
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={shouldReduceMotion ? undefined : { duration: 0.45, delay: index * 0.1, ease: itemEase }}
                sx={{ borderLeft: '3px solid', borderColor: 'primary.main', pl: 2.5 }}
              >
                <Typography sx={{ color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.72rem', fontWeight: 700 }}>
                  {column.label}
                </Typography>
                <Typography variant="h5" sx={{ mt: 1, mb: 1.5, fontWeight: 700, color: 'text.primary' }}>
                  {column.title}
                </Typography>
                <List disablePadding sx={{ display: 'grid', gap: 1.1 }}>
                  {column.points.map((point) => (
                    <ListItem key={point} disableGutters sx={{ alignItems: 'flex-start', color: 'text.secondary' }}>
                      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'primary.main', mt: '0.62em', mr: 1.25, flexShrink: 0 }} />
                      <Typography component="span">{point}</Typography>
                    </ListItem>
                  ))}
                </List>
              </MotionBox>
            ))}
          </Box>
        </Reveal>
      </Container>
    </Box>
  )
}

export default BenefitsSection
