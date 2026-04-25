import { Box, Container, Link, Stack, Typography } from '@mui/material'

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
    <Box component="footer" sx={{ py: 4, bgcolor: '#49c889', borderTop: '1px solid rgba(4,32,24,0.22)' }}>
      <Container maxWidth={false} sx={{ width: 'min(1200px, calc(100% - 48px))' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' } }}>
          <Box>
            <Typography sx={{ color: '#042018', fontWeight: 700, mb: 0.5 }}>GreenTech</Typography>
            <Typography sx={{ color: 'rgba(4,32,24,0.86)', maxWidth: 640 }}>
              Dual land use for protected agriculture, clean power, and better planning outcomes in the UK.
            </Typography>
            <Typography sx={{ color: 'rgba(4,32,24,0.7)', mt: 0.8, fontSize: '0.9rem' }}>
              {year} GreenTech. All rights reserved.
            </Typography>
          </Box>

          <Stack direction="row" spacing={{ xs: 2, md: 3 }}>
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                underline="none"
                data-gsap-footer-link
                sx={{ color: 'rgba(4,32,24,0.86)', '&:hover': { color: '#02110c' } }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default FooterSection
