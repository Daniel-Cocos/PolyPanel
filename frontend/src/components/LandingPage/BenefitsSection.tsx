import { Box, Chip, Container, List, ListItem, Typography } from '@mui/material'
import Reveal from './Reveal'

const benefitColumns = [
  {
    title: 'For farmers',
    label: 'Agricultural continuity',
    points: [
      'Retain productive agricultural use instead of surrendering land to single-purpose generation.',
      'Open additional revenue through infrastructure already tied to growing environments.',
    ],
  },
  {
    title: 'For energy companies',
    label: 'Development leverage',
    points: [
      'Unlock projects where suitable land and social licence are increasingly constrained.',
      'Present a balanced planning case by pairing generation with active agricultural function.',
    ],
  },
]

/** Splits the commercial and operational upside by audience. */
function BenefitsSection() {
  return (
    <Box component="section" id="benefits" sx={{ py: { xs: 10, md: 14 }, bgcolor: '#08151d', color: 'common.white' }}>
      <Container maxWidth={false} sx={{ width: 'min(1200px, calc(100% - 48px))' }}>
        <Reveal sx={{ display: 'grid', gap: 5 }}>
          <Box sx={{ display: 'grid', gap: 2, maxWidth: 900 }}>
            <Chip
              label="Why GreenTech"
              sx={{
                justifySelf: 'start',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,255,255,0.16)',
                bgcolor: 'rgba(255,255,255,0.08)',
              }}
            />
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3.2rem' }, lineHeight: 1.03, maxWidth: '18ch', color: 'common.white' }}>
              Built to deliver practical agrivoltaic projects in the UK.
            </Typography>
            <Typography sx={{ color: 'rgba(232,245,249,0.78)', maxWidth: '58ch' }}>
              We combine food production, clean power, and planning credibility in one disciplined delivery model.
            </Typography>
          </Box>

          <Box data-gsap-card-group sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: { xs: 3, md: 4 } }}>
            {benefitColumns.map((column, index) => (
              <Box
                key={column.title}
                data-gsap-card
                sx={{
                  p: { xs: 2.4, md: 3 },
                  borderRadius: '24px',
                  border: '1px solid rgba(255,255,255,0.14)',
                  bgcolor: 'rgba(7,18,27,0.72)',
                  backdropFilter: 'blur(14px)',
                  boxShadow: '0 28px 60px rgba(1, 9, 14, 0.22)',
                }}
              >
                <Box data-gsap-divider sx={{ height: 3, width: 72, bgcolor: index === 0 ? 'secondary.main' : 'primary.main', borderRadius: '999px', mb: 1.5 }} />
                <Typography sx={{ color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.72rem', fontWeight: 700 }}>
                  {column.label}
                </Typography>
                <Typography variant="h5" sx={{ mt: 1, mb: 1.5, fontWeight: 700, color: 'common.white' }}>
                  {column.title}
                </Typography>
                <List disablePadding sx={{ display: 'grid', gap: 1.1 }}>
                  {column.points.map((point) => (
                    <ListItem key={point} disableGutters sx={{ alignItems: 'flex-start', color: 'rgba(232,245,249,0.78)' }}>
                      <Box sx={{ width: 7, height: 7, borderRadius: '3px', bgcolor: 'primary.main', mt: '0.62em', mr: 1.25, flexShrink: 0 }} />
                      <Typography component="span">{point}</Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Box>
        </Reveal>
      </Container>
    </Box>
  )
}

export default BenefitsSection
