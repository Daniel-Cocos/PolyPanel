import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Box, Button, Chip, Collapse, Container, IconButton, Link, Stack, Typography } from '@mui/material'
import { FiClock, FiMapPin, FiMenu, FiSun, FiX } from 'react-icons/fi'
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
  { value: '2x', label: 'land-use story', icon: FiSun },
  { value: 'UK', label: 'planning-led approach', icon: FiMapPin },
  { value: '24h', label: 'response on new enquiries', icon: FiClock },
]

/** Introduces the company and core value proposition. */
function HeroSection() {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

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
          inset: '-8% 0',
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: { xs: 'scroll', md: 'fixed' },
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
          width: 'min(1200px, calc(100% - 32px))',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          py: { xs: 2.5, md: 4 },
        }}
      >
        <Stack
          data-gsap-hero-nav
          spacing={{ xs: 1.2, md: 2 }}
          sx={{
            px: { xs: 1.4, md: 2.5 },
            py: { xs: 1.2, md: 1.5 },
            border: '1px solid rgba(255,255,255,0.16)',
            bgcolor: 'rgba(5,16,24,0.2)',
            backdropFilter: 'blur(16px)',
            borderRadius: '3px',
          }}
        >
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Link
              href="#top"
              underline="none"
              sx={{
                color: 'common.white',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box
                aria-hidden
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '3px',
                  border: '1px solid rgba(73,200,137,0.9)',
                  bgcolor: 'rgba(73,200,137,0.16)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 3,
                    top: 3,
                    width: 8,
                    height: 8,
                    borderRadius: '2px',
                    backgroundColor: 'rgba(73,200,137,0.86)',
                  },
                }}
              />
              GreenTech
            </Link>

            <IconButton
              aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setIsMobileNavOpen((open) => !open)}
              sx={{
                display: { xs: 'inline-flex', md: 'none' },
                color: 'common.white',
                border: '1px solid rgba(255,255,255,0.16)',
                borderRadius: '3px',
              }}
            >
              {isMobileNavOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </IconButton>
          </Stack>

          <Collapse in={isMobileNavOpen} timeout="auto" sx={{ display: { xs: 'block', md: 'none' } }}>
            <Stack sx={{ pt: 0.2, '& a': { fontSize: '0.98rem' } }}>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  underline="none"
                  onClick={() => setIsMobileNavOpen(false)}
                  sx={{
                    color: 'rgba(255,255,255,0.84)',
                    fontWeight: 500,
                    py: 0.8,
                    '&:hover': { color: 'common.white' },
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Collapse>

          <Stack
            direction="row"
            spacing={{ md: 4 }}
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexWrap: 'wrap',
              rowGap: 0.6,
              '& a': { fontSize: '1rem' },
            }}
          >
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

        <Box sx={{ flex: 1, width: '100%', display: 'grid', alignContent: 'center', pt: { xs: 4, md: 7 } }}>
          <Box
            sx={{
              width: '100%',
              maxWidth: 1060,
              mx: 'auto',
              display: 'grid',
              justifyItems: 'center',
              textAlign: 'center',
               gap: { xs: 2.1, md: 2.75 },
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
               maxWidth: { xs: '12ch', md: '11ch' },
               fontSize: { xs: 'clamp(2rem, 10.4vw, 3rem)', md: 'clamp(3.2rem, 8vw, 6.2rem)' },
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

           <Stack data-gsap-hero-actions direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ width: { xs: '100%', sm: 'auto' }, maxWidth: 420 }}>
            <Button
              variant="contained"
              href="mailto:hello@yourcompany.co.uk?subject=Stacked%20solar%20enquiry"
              sx={{ width: { xs: '100%', sm: 'auto' }, bgcolor: '#49c889', color: '#042018', '&:hover': { bgcolor: '#35b576' } }}
            >
              Book consultation
            </Button>
            <Button
              variant="outlined"
              href="#pricing"
              sx={{ width: { xs: '100%', sm: 'auto' }, borderColor: 'rgba(255,255,255,0.32)', color: 'common.white', '&:hover': { borderColor: 'rgba(255,255,255,0.7)' } }}
            >
              View pricing
            </Button>
          </Stack>

            <Box
              sx={{
                display: 'grid',
                 gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' },
                 gap: { xs: 1, sm: 1.2, md: 1.5 },
                 width: '100%',
                 maxWidth: 940,
                 mt: { xs: 2.2, md: 4 },
               }}
             >
              {impactItems.map((item) => (
                <Box
                  key={item.label}
                  data-gsap-hero-stat
                  sx={{
                     p: { xs: 1.6, md: 2.2 },
                     textAlign: 'left',
                    border: '1px solid rgba(255,255,255,0.14)',
                    bgcolor: 'rgba(7,18,27,0.34)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 28px 60px rgba(1, 9, 14, 0.22)',
                    borderRadius: '3px',
                  }}
                >
                  <Typography sx={{ fontSize: { xs: '1.4rem', md: '1.9rem' }, fontWeight: 700, color: 'common.white' }}>
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
