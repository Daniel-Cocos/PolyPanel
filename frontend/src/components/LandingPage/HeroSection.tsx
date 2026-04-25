import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Box, Button, Chip, Container, Link, Stack, Typography } from '@mui/material'
import heroImage from '../../assets/pexels-red-zeppelin-4148472.jpg'
import { gsap } from '../../lib/gsap'

const navItems = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Planning', href: '#planning' },
  { label: 'Contact', href: '#contact' },
]

const impactItems = [
  { value: '2x', label: 'land-use story' },
  { value: 'UK', label: 'planning-led approach' },
  { value: '24h', label: 'response on new enquiries' },
]

/** Introduces the company and core value proposition. */
function HeroSection() {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current

    if (!section || shouldReduceMotion) {
      return
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { duration: 0.9, ease: 'power3.out' } })

      timeline
        .fromTo('[data-gsap-hero-overlay]', { autoAlpha: 0.2 }, { autoAlpha: 1, duration: 1.2 }, 0)
        .fromTo('[data-gsap-hero-nav]', { autoAlpha: 0, y: -24 }, { autoAlpha: 1, y: 0 }, 0.1)
        .fromTo('[data-gsap-hero-chip]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0 }, 0.25)
        .fromTo('[data-gsap-hero-title]', { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0 }, 0.35)
        .fromTo('[data-gsap-hero-copy]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0 }, 0.5)
        .fromTo(
          '[data-gsap-hero-actions] > *',
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.75 },
          0.62,
        )
        .fromTo(
          '[data-gsap-hero-stat]',
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.75 },
          0.75,
        )

    }, section)

    return () => {
      context.revert()
    }
  }, [shouldReduceMotion])

  return (
    <Box component="section" id="top" ref={sectionRef} sx={{ position: 'relative', minHeight: '100dvh', overflow: 'hidden', color: 'common.white' }}>
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
        data-gsap-hero-overlay
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(7, 20, 28, 0.58)',
          backdropFilter: 'blur(1px)',
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
          data-gsap-hero-nav
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            px: { xs: 2, md: 2.5 },
            py: 1.5,
            border: '1px solid rgba(255,255,255,0.16)',
            bgcolor: 'rgba(5,16,24,0.2)',
            backdropFilter: 'blur(16px)',
            borderRadius: '20px',
          }}
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

        <Box sx={{ flex: 1, width: '100%', display: 'grid', alignContent: 'center', pt: { xs: 5, md: 7 } }}>
          <Box
            sx={{
              width: '100%',
              maxWidth: 1060,
              mx: 'auto',
              display: 'grid',
              justifyItems: 'center',
              textAlign: 'center',
              gap: 2.75,
            }}
          >
          <Chip
            data-gsap-hero-chip
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
            data-gsap-hero-title
            sx={{
              maxWidth: '11ch',
              fontSize: { xs: 'clamp(2.3rem, 11vw, 3.4rem)', md: 'clamp(3.2rem, 8vw, 6.2rem)' },
              lineHeight: 0.96,
              color: 'common.white',
              fontWeight: 700,
              textShadow: '0 14px 40px rgba(0,0,0,0.26)',
            }}
          >
            Solar on farmland. Built for scale.
          </Typography>

          <Typography data-gsap-hero-copy sx={{ maxWidth: '58ch', fontSize: { xs: '1rem', md: '1.12rem' }, color: 'rgba(255,255,255,0.9)' }}>
            We help energy companies install solar on farmers land without compromising agricultural productivity.
          </Typography>

          <Stack data-gsap-hero-actions direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              variant="contained"
              href="mailto:hello@yourcompany.co.uk?subject=Stacked%20solar%20enquiry"
              sx={{ bgcolor: '#49c889', color: '#042018', '&:hover': { bgcolor: '#35b576' } }}
            >
              Book consultation
            </Button>
            <Button
              variant="outlined"
              href="#pricing"
              sx={{ borderColor: 'rgba(255,255,255,0.32)', color: 'common.white', '&:hover': { borderColor: 'rgba(255,255,255,0.7)' } }}
            >
              View pricing
            </Button>
          </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                gap: 1.5,
                width: '100%',
                maxWidth: 940,
                mt: { xs: 3, md: 4 },
              }}
            >
              {impactItems.map((item) => (
                <Box
                  key={item.label}
                  data-gsap-hero-stat
                  sx={{
                    p: { xs: 2, md: 2.2 },
                    textAlign: 'left',
                    border: '1px solid rgba(255,255,255,0.14)',
                    bgcolor: 'rgba(7,18,27,0.34)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 28px 60px rgba(1, 9, 14, 0.22)',
                    borderRadius: '18px',
                  }}
                >
                  <Typography sx={{ fontSize: { xs: '1.55rem', md: '1.9rem' }, fontWeight: 700, color: 'common.white' }}>
                    {item.value}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.72)' }}>{item.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default HeroSection
