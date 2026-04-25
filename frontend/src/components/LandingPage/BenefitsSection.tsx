import { Box, Chip, Container, List, ListItem, Paper, Stack, Typography } from '@mui/material'
import { FiCheck, FiGrid, FiZap } from 'react-icons/fi'
import Reveal from './Reveal'

const benefitColumns = [
  {
    title: 'For farmers',
    label: 'Agricultural continuity',
    icon: FiGrid,
    points: [
      'Retain productive agricultural use instead of surrendering land to single-purpose generation.',
      'Open additional revenue through infrastructure already tied to growing environments.',
    ],
  },
  {
    title: 'For energy companies',
    label: 'Development leverage',
    icon: FiZap,
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
      <Container maxWidth={false} sx={{ width: 'min(1200px, calc(100% - 32px))' }}>
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

          <Stack
            spacing={{ xs: 2.2, md: 0 }}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              gap: { xs: 2.2, md: 3.2 },
            }}
          >
            {benefitColumns.map((column, index) => (
              (() => {
                const ColumnIcon = column.icon

                return (
              <Paper
                component="article"
                key={column.title}
                variant="outlined"
                sx={{
                  p: { xs: 2.3, md: 2.8 },
                  borderRadius: '3px',
                  borderColor: 'rgba(255,255,255,0.14)',
                  borderTopWidth: '2px',
                  borderTopColor: index === 0 ? 'secondary.main' : 'primary.main',
                  bgcolor: 'rgba(7,18,27,0.42)',
                  backdropFilter: 'blur(8px)',
                  '&:hover': { transform: { xs: 'none', md: 'translateY(-2px)' } },
                  transition: 'transform 180ms ease',
                }}
              >
                <Typography sx={{ color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.72rem', fontWeight: 700 }}>
                  {column.label}
                </Typography>
                <Stack direction="row" spacing={0.9} sx={{ alignItems: 'center', mt: 1, mb: 1.5 }}>
                  <Box sx={{ color: index === 0 ? 'secondary.main' : 'primary.main', display: 'inline-flex' }}>
                    <ColumnIcon size={16} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'common.white' }}>
                    {column.title}
                  </Typography>
                </Stack>
                <List disablePadding sx={{ display: 'grid', gap: 1.1 }}>
                  {column.points.map((point) => (
                    <ListItem key={point} disableGutters sx={{ alignItems: 'flex-start', color: 'rgba(232,245,249,0.8)', py: 0.15 }}>
                      <FiCheck size={16} color={index === 0 ? '#6fdaa2' : '#2d6a88'} style={{ marginTop: 4, marginRight: 10, flexShrink: 0 }} />
                      <Typography component="span">{point}</Typography>
                    </ListItem>
                  ))}
                </List>
              </Paper>
                )
              })()
            ))}
          </Stack>
        </Reveal>
      </Container>
    </Box>
  )
}

export default BenefitsSection
