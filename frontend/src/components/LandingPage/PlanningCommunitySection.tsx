import { Box, Chip, Container, Paper, Stack, Typography } from '@mui/material'
import { FiActivity, FiLayers, FiShield, FiSliders } from 'react-icons/fi'
import planningImage from '../../assets/pexels-stitch-20280054.jpg'

const whyUsCards = [
  {
    title: 'One system, not disconnected tools',
    copy: 'PolyPanel combines design, simulation, planning support, and monitoring in one platform instead of spreading work across separate tools and spreadsheets.',
    icon: FiLayers,
  },
  {
    title: 'Built for planning reality',
    copy: 'The product is designed around dual-use evidence, clearer planning submissions, and better visibility for stakeholders and councils.',
    icon: FiShield,
  },
  {
    title: 'Useful to both sides of the project',
    copy: 'Energy developers get faster site assessment and portfolio visibility, while farmers get infrastructure, protection, and operational insight.',
    icon: FiActivity,
  },
  {
    title: 'Designed for active operation',
    copy: 'The platform is not only for concept design. It stays useful through planning, deployment, and long-term site monitoring.',
    icon: FiSliders,
  },
] as const

/** Explains why the product is useful using the same card structure as the rest of the page. */
function PlanningCommunitySection() {
  return (
    <Box
      component="section"
      id="planning"
      sx={{
        position: 'relative',
        py: { xs: 8, md: 14 },
        color: 'common.white',
        overflow: 'hidden',
        backgroundColor: '#08151d',
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${planningImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: { xs: 'scroll', md: 'fixed' },
          transform: 'scale(1.06)',
          transformOrigin: 'center',
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(7, 20, 28, 0.76)',
          backdropFilter: 'blur(2px)',
        }}
      />
      <Container maxWidth={false} sx={{ position: 'relative', zIndex: 1, width: { xs: 'min(1200px, calc(100% - 24px))', sm: 'min(1200px, calc(100% - 32px))' } }}>
        <Box sx={{ display: 'grid', gap: { xs: 3.2, md: 4.5 } }}>
          <Box sx={{ display: 'grid', gap: 2.1, maxWidth: 760 }}>
            <Chip
              label="Why Use PolyPanel"
              sx={{
                justifySelf: 'start',
                color: 'rgba(255,255,255,0.88)',
                border: '1px solid rgba(255,255,255,0.18)',
                bgcolor: 'rgba(255,255,255,0.06)',
              }}
            />
            <Typography variant="h2" sx={{ color: 'common.white', fontSize: { xs: '1.85rem', md: '3.15rem' }, lineHeight: 1.03, maxWidth: { xs: '14ch', md: '20ch' } }}>
              A better way to move agrivoltaic projects from idea to operation.
            </Typography>
            <Typography sx={{ color: 'rgba(232,245,249,0.82)', maxWidth: { xs: '35ch', md: '58ch' }, lineHeight: { xs: 1.6, md: 1.7 } }}>
              PolyPanel helps turn a difficult land-use conversation into a more practical delivery workflow, with tools built
              for design decisions, planning evidence, and operational visibility.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: { xs: 1.4, md: 2.2 } }}>
            {whyUsCards.map((card) => {
              const CardIcon = card.icon

              return (
                <Paper
                  key={card.title}
                  variant="outlined"
                  sx={{
                    p: { xs: 2.3, md: 2.7 },
                    borderRadius: '3px',
                    borderColor: 'rgba(255,255,255,0.14)',
                    bgcolor: 'rgba(7,18,27,0.42)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Stack direction="row" spacing={0.9} sx={{ alignItems: 'center', mb: 1 }}>
                    <Box sx={{ color: 'secondary.main', display: 'inline-flex' }}>
                      <CardIcon size={15} />
                    </Box>
                    <Typography variant="h6" sx={{ color: 'common.white' }}>
                      {card.title}
                    </Typography>
                  </Stack>
                  <Typography sx={{ color: 'rgba(232,245,249,0.78)', lineHeight: 1.6 }}>{card.copy}</Typography>
                </Paper>
              )
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default PlanningCommunitySection
