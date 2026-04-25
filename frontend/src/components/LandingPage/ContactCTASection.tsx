import { useReducedMotion } from 'framer-motion'
import { Box, Button, Chip, Container, Link, Typography } from '@mui/material'
import Reveal from './Reveal'

const emailHref = 'mailto:hello@yourcompany.co.uk?subject=Stacked%20solar%20enquiry'
const phoneHref = 'tel:+442012345678'

/** Creates the standout contact call-to-action section. */
function ContactCTASection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <Box component="section" id="contact" sx={{ py: { xs: 10, md: 14 }, bgcolor: '#08151d' }}>
      <Container maxWidth={false} sx={{ width: 'min(1200px, calc(100% - 48px))' }}>
        <Reveal>
          <Box
            sx={{
              py: { xs: 2, md: 3 },
              color: 'common.white',
              display: 'grid',
              gap: 2,
              textAlign: 'center',
              justifyItems: 'center',
            }}
          >
            <Chip
              label="Contact Us"
              sx={{
                justifySelf: 'center',
                color: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,255,255,0.2)',
                bgcolor: 'rgba(255,255,255,0.06)',
              }}
            />

            <Typography variant="h2" sx={{ color: 'common.white', fontSize: { xs: '1.9rem', md: '2.8rem' }, lineHeight: 1.06, maxWidth: { md: '20ch' }, mx: { md: 'auto' } }}>
              Ready to scope a pilot site or strategic partnership?
            </Typography>

            <Typography sx={{ color: 'rgba(232,245,249,0.82)', maxWidth: { md: '56ch' }, mx: { md: 'auto' } }}>
              Email is the fastest path. We reply within one business day.
            </Typography>

            <Button
              variant="contained"
              href={emailHref}
              data-gsap-cta-button={!shouldReduceMotion ? true : undefined}
              sx={{
                justifySelf: 'center',
                bgcolor: '#49c889',
                color: '#042018',
                px: { xs: 2.5, md: 4 },
                minHeight: 58,
                borderRadius: '3px',
                fontSize: { xs: '1rem', md: '1.18rem' },
                '&:hover': { bgcolor: '#35b576' },
              }}
            >
              hello@yourcompany.co.uk
            </Button>

            <Typography sx={{ color: 'rgba(232,245,249,0.72)' }}>
              Prefer a call?{' '}
              <Link href={phoneHref} underline="hover" sx={{ color: 'common.white', fontWeight: 600 }}>
                +44 (0)20 1234 5678
              </Link>
            </Typography>
          </Box>
        </Reveal>
      </Container>
    </Box>
  )
}

export default ContactCTASection
