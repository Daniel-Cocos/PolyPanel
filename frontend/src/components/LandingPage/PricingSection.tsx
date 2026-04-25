import { Box, Button, Chip, Container, Paper, Stack, Typography } from '@mui/material'
import heroImage from '../../assets/pexels-red-zeppelin-4148472.jpg'

const pricingTiers = [
  {
    name: 'Land Screen',
    price: 'From GBP 18,000',
    summary: 'Assess farmer-land opportunities before capital is committed.',
    features: ['Site and land-use fit check', 'Grid and access constraints'],
    cta: 'Book screen call',
    featured: false,
  },
  {
    name: 'Planning Package',
    price: 'From GBP 42,000',
    summary: 'Enter council review with a clear dual-use planning case.',
    features: ['Planning narrative pack', 'Council and community briefing materials'],
    cta: 'Book consultation',
    featured: true,
  },
  {
    name: 'Pilot Rollout',
    price: 'From GBP 85,000',
    summary: 'Move priority sites from planning into execution readiness.',
    features: ['Pilot governance and scope', 'Commercial readiness support'],
    cta: 'Book pilot plan',
    featured: false,
  },
] as const

/** Presents pricing packages for energy developers. */
function PricingSection() {
  return (
    <Box
      component="section"
      id="pricing"
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
        <Box sx={{ display: 'grid', gap: 5 }}>
          <Box sx={{ maxWidth: 860, display: 'grid', gap: 2 }}>
            <Chip
              label="Pricing"
              sx={{
                justifySelf: 'start',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,255,255,0.16)',
                bgcolor: 'rgba(255,255,255,0.08)',
              }}
            />
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3.2rem' }, lineHeight: 1.03, maxWidth: '16ch', color: 'common.white' }}>
              Simple pricing. Faster decisions.
            </Typography>
            <Typography sx={{ color: 'rgba(232,245,249,0.82)', maxWidth: '60ch' }}>
              Three stages for energy companies installing solar on farmer land.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '0.9fr 1.28fr 0.9fr' },
              alignItems: { xs: 'stretch', md: 'center' },
              gap: 2.2,
            }}
          >
            {pricingTiers.map((tier) => {
              const isFeatured = tier.featured

              return (
                <Paper
                  key={tier.name}
                  variant="outlined"
                  sx={{
                    p: isFeatured ? 4.4 : 3,
                    borderRadius: '3px',
                    position: 'relative',
                    minHeight: isFeatured ? 580 : 420,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: isFeatured ? 'center' : 'flex-start',
                    borderColor: isFeatured ? 'rgba(73, 200, 137, 0.92)' : 'rgba(255,255,255,0.16)',
                    backgroundColor: isFeatured ? 'rgba(10, 28, 39, 0.9)' : 'rgba(8, 25, 35, 0.72)',
                    backdropFilter: 'blur(18px)',
                    backgroundImage: 'none',
                    boxShadow: isFeatured
                      ? '0 34px 72px rgba(1, 9, 14, 0.42)'
                      : '0 18px 36px rgba(0, 0, 0, 0.22)',
                    transition: 'box-shadow 180ms ease, border-color 180ms ease',
                    willChange: 'auto',
                    '&:hover': {
                      boxShadow: isFeatured
                        ? '0 38px 82px rgba(1, 9, 14, 0.5)'
                        : '0 24px 42px rgba(0, 0, 0, 0.28)',
                    },
                    zIndex: isFeatured ? 3 : 1,
                  }}
                >
                  {isFeatured ? (
                    <Chip
                      label="Recommended"
                      size="small"
                      color="secondary"
                      sx={{ position: 'absolute', top: 14, right: 14, fontWeight: 700, borderRadius: '3px' }}
                    />
                  ) : null}

                  <Typography variant="h5" sx={{ fontSize: isFeatured ? '1.5rem' : '1.35rem', mb: 0.8, color: 'common.white' }}>
                    {tier.name}
                  </Typography>
                  <Box sx={{ height: 3, width: 72, bgcolor: isFeatured ? 'secondary.main' : 'primary.light', borderRadius: '999px', mb: 1.5 }} />
                  <Typography sx={{ color: isFeatured ? 'secondary.light' : 'primary.main', fontWeight: 700, mb: 1.2, fontSize: isFeatured ? '1.7rem' : '1.35rem' }}>
                    {tier.price}
                  </Typography>
                  <Typography sx={{ color: 'rgba(232,245,249,0.82)', mb: 1.6 }}>{tier.summary}</Typography>

                  <Stack component="ul" spacing={0.85} sx={{ m: 0, pl: 2.4, mb: 2.2 }}>
                    {tier.features.map((feature) => (
                      <Typography
                        component="li"
                        key={feature}
                        sx={{
                          color: 'rgba(232,245,249,0.82)',
                          pl: 0.2,
                          '&::marker': {
                            color: isFeatured ? 'primary.main' : 'secondary.light',
                          },
                        }}
                      >
                        {feature}
                      </Typography>
                    ))}
                  </Stack>

                  <Button
                    variant={isFeatured ? 'contained' : 'outlined'}
                    href="#contact"
                    sx={
                      isFeatured
                        ? {
                            mt: 'auto',
                            justifySelf: 'stretch',
                            bgcolor: 'secondary.main',
                            color: '#042018',
                            '&:hover': { bgcolor: 'secondary.light' },
                          }
                        : { mt: 'auto', justifySelf: 'stretch' }
                    }
                  >
                    {tier.cta}
                  </Button>
                </Paper>
              )
            })}
          </Box>

          <Typography sx={{ color: 'rgba(232,245,249,0.7)', fontSize: '0.93rem' }}>
            Final quote depends on site scope and planning complexity.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default PricingSection
