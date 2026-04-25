import { Box, Container, Link, Stack, Typography } from '@mui/material'
import { FiArrowUpRight } from 'react-icons/fi'

const footerLinks = [
  { label: 'Top', href: '#top' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Contact', href: '#contact' },
]

/** Renders the landing page footer. */
function FooterSection() {
  const year = new Date().getFullYear()

  return (
    <Box component="footer" sx={{ py: { xs: 3.5, md: 4.5 }, bgcolor: '#49c889', borderTop: '1px solid rgba(4,32,24,0.22)' }}>
      <Container maxWidth={false} sx={{ width: 'min(1200px, calc(100% - 32px))' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2.5, md: 4 }} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
          <Box sx={{ display: 'grid', gap: 0.8 }}>
            <Typography sx={{ color: '#042018', fontWeight: 800, letterSpacing: '0.01em', fontSize: '1.42rem', lineHeight: 1.1 }}>PolyPannel</Typography>
            <Typography sx={{ color: 'rgba(4,32,24,0.86)', maxWidth: '56ch', lineHeight: 1.45, fontSize: { xs: '1rem', md: '1.08rem' } }}>
              Dual land use for protected agriculture, clean power, and better planning outcomes in the UK.
            </Typography>
            <Typography sx={{ color: 'rgba(4,32,24,0.72)', mt: 0.35, fontSize: '0.92rem', letterSpacing: '0.01em' }}>
              {year} PolyPannel. All rights reserved.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gap: 0.75 }}>
            <Typography sx={{ color: 'rgba(4,32,24,0.72)', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Navigate</Typography>
            <Stack direction="row" spacing={{ xs: 1.1, md: 2.5 }} sx={{ flexWrap: 'wrap', rowGap: 0.6 }}>
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                underline="none"
                data-gsap-footer-link
                sx={{
                  color: 'rgba(4,32,24,0.86)',
                  fontWeight: 600,
                  fontSize: { xs: '0.94rem', md: '1rem' },
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.55,
                  '&:hover': { color: '#02110c' },
                }}
              >
                {link.label}
                <FiArrowUpRight size={14} />
              </Link>
            ))}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default FooterSection
