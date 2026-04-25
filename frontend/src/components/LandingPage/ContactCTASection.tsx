import { motion, useReducedMotion } from 'framer-motion'
import { Box, Button, Chip, Container, Link, Paper, Typography } from '@mui/material'
import Reveal from './Reveal'

const emailHref = 'mailto:hello@yourcompany.co.uk?subject=Stacked%20solar%20enquiry'
const phoneHref = 'tel:+442012345678'

const MotionPaper = motion(Paper)
const hoverEase = [0.22, 1, 0.36, 1] as const

/** Creates the standout contact call-to-action section. */
function ContactCTASection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <Box component="section" id="contact" sx={{ py: { xs: 10, md: 14 }, bgcolor: '#08151d' }}>
      <Container maxWidth={false} sx={{ width: 'min(1200px, calc(100% - 48px))' }}>
        <Reveal>
          <MotionPaper
            variant="outlined"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={shouldReduceMotion ? undefined : { duration: 0.55, ease: hoverEase }}
            sx={{
              p: { xs: 3, md: 4.5 },
              borderRadius: 4,
              borderColor: 'rgba(255,255,255,0.14)',
              bgcolor: 'rgba(255,255,255,0.04)',
              color: 'common.white',
              display: 'grid',
              gap: 2,
              textAlign: { xs: 'left', md: 'center' },
            }}
          >
            <Chip
              label="Contact"
              sx={{
                justifySelf: { xs: 'start', md: 'center' },
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
              sx={{
                justifySelf: { xs: 'start', md: 'center' },
                bgcolor: '#49c889',
                color: '#042018',
                px: { xs: 2.5, md: 4 },
                minHeight: 58,
                borderRadius: 3,
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
          </MotionPaper>
        </Reveal>
      </Container>
    </Box>
  )
}

export default ContactCTASection
