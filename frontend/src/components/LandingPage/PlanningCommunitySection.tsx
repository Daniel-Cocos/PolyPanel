import { Box, Chip, Container, Typography } from '@mui/material'
import heroImage from '../../assets/pexels-red-zeppelin-4148472.jpg'

const planningPoints = [
  {
    title: 'Keep productivity visible',
    copy: 'Answer food-displacement concerns with sites that are still clearly working for agriculture.',
  },
  {
    title: 'Improve stakeholder conversations',
    copy: 'Create a more constructive discussion with councils, neighbours, and rural stakeholders.',
  },
]

/** Frames the project around UK planning and community realities. */
function PlanningCommunitySection() {
  return (
    <Box
      component="section"
      id="planning"
      sx={{
        position: 'relative',
        py: { xs: 10, md: 14 },
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
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(7, 20, 28, 0.74)',
          backdropFilter: 'blur(2px)',
        }}
      />
      <Container maxWidth={false} sx={{ position: 'relative', zIndex: 1, width: 'min(1200px, calc(100% - 48px))' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' }, gap: { xs: 4, md: 5 } }}>
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
              Built for a stronger planning conversation.
            </Typography>
            <Typography sx={{ color: 'rgba(232,245,249,0.82)', maxWidth: '56ch' }}>
              Energy developers have capital to deploy, but suitable land, public confidence, and planning headroom are
              harder to secure. A dual land-use model helps shift the conversation from land loss to land productivity.
            </Typography>
          </Box>

          <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none', display: 'grid', gap: 1.8 }}>
            {planningPoints.map((point, index) => (
              <Box component="li" key={point.title} sx={{ listStyle: 'none' }}>
                <Box
                  sx={{
                    p: { xs: 2.4, md: 2.8 },
                    borderRadius: '22px',
                    border: '1px solid rgba(255,255,255,0.14)',
                    bgcolor: 'rgba(7,18,27,0.72)',
                    backdropFilter: 'blur(14px)',
                    boxShadow: '0 28px 60px rgba(1, 9, 14, 0.22)',
                  }}
                >
                  <Box sx={{ height: 2, width: 82, bgcolor: 'secondary.main', borderRadius: '999px', mb: 1.8 }} />
                  <Typography sx={{ color: 'rgba(73,200,137,0.95)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.12em', fontSize: '0.72rem' }}>
                    0{index + 1}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.8, mb: 0.6, color: 'common.white' }}>
                    {point.title}
                  </Typography>
                  <Typography sx={{ color: 'rgba(232,245,249,0.78)' }}>{point.copy}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default PlanningCommunitySection
