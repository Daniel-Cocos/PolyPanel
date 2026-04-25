import { motion, useReducedMotion } from 'framer-motion'
import { Box, Button, Chip, Container, Link, Stack, Typography } from '@mui/material'
import heroImage from '../../assets/pexels-red-zeppelin-4148472.jpg'

const navItems = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Planning', href: '#planning' },
  { label: 'Contact', href: '#contact' },
]

const heroEase = [0.22, 1, 0.36, 1] as const

/** Introduces the company and core value proposition. */
function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <Box component="section" id="top" sx={{ position: 'relative', minHeight: '100dvh', overflow: 'hidden', color: 'common.white' }}>
      <Box
        component="img"
        src={heroImage}
        alt=""
        loading="eager"
        fetchPriority="high"
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(2, 10, 16, 0.24) 0%, rgba(2, 10, 16, 0.6) 100%), linear-gradient(90deg, rgba(2, 10, 16, 0.24) 0%, rgba(2, 10, 16, 0.14) 40%, rgba(2, 10, 16, 0.24) 100%)',
        }}
      />

      <Container
        maxWidth={false}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: 'min(1200px, calc(100% - 48px))',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          py: { xs: 3, md: 4 },
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' } }}
        >
          <Link href="#top" underline="none" sx={{ color: 'common.white', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            GreenTech
          </Link>

          <Stack direction="row" spacing={{ xs: 2, md: 4 }} sx={{ flexWrap: 'wrap' }}>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                underline="none"
                sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, '&:hover': { color: 'common.white' } }}
              >
                {item.label}
              </Link>
            ))}
          </Stack>
        </Stack>

        <Box
          component={motion.div}
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? undefined : { duration: 0.7, ease: heroEase }}
          sx={{
            flex: 1,
            width: '100%',
            maxWidth: 980,
            mx: 'auto',
            display: 'grid',
            alignContent: 'center',
            justifyItems: 'center',
            textAlign: 'center',
            gap: 2.75,
            pt: { xs: 5, md: 7 },
          }}
        >
          <Chip
            label="Dual land use for a sustainable future"
            sx={{
              borderColor: 'rgba(255,255,255,0.24)',
              borderWidth: 1,
              borderStyle: 'solid',
              bgcolor: 'rgba(2,10,16,0.22)',
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 600,
              px: 1,
            }}
          />

          <Typography
            variant="h1"
            sx={{
              maxWidth: '11ch',
              fontSize: { xs: 'clamp(2.3rem, 11vw, 3.4rem)', md: 'clamp(3.2rem, 8vw, 6.2rem)' },
              lineHeight: 0.96,
              color: 'common.white',
              fontWeight: 700,
            }}
          >
            Innovating at the intersection of energy and agriculture.
          </Typography>

          <Typography sx={{ maxWidth: '58ch', fontSize: { xs: '1rem', md: '1.12rem' }, color: 'rgba(255,255,255,0.9)' }}>
            We empower landowners to generate clean energy with advanced solar solutions, without compromising
            agricultural productivity.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              variant="contained"
              href="mailto:hello@yourcompany.co.uk?subject=Stacked%20solar%20enquiry"
              sx={{ bgcolor: '#49c889', color: '#042018', '&:hover': { bgcolor: '#35b576' } }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              href="#how-it-works"
              sx={{ borderColor: 'rgba(255,255,255,0.32)', color: 'common.white', '&:hover': { borderColor: 'rgba(255,255,255,0.7)' } }}
            >
              Learn More
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}

export default HeroSection
