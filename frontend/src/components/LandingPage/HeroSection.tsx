import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  Box,
  Button,
  Collapse,
  Container,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { FiClock, FiGrid, FiMapPin, FiMenu, FiSun, FiX } from "react-icons/fi";
import heroImage from "../../assets/pexels-red-zeppelin-4148472.jpg";
import { gsap } from "../../lib/gsap";

const navItems = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Benefits", href: "#benefits" },
  { label: "Planning", href: "#planning" },
  { label: "Contact", href: "#contact" },
];

const impactItems = [
  { value: "2x", label: "land-use story", icon: FiSun },
  { value: "UK", label: "planning-led approach", icon: FiMapPin },
  { value: "24h", label: "response on new enquiries", icon: FiClock },
];

/** Introduces the company and core value proposition. */
function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || shouldReduceMotion) {
      return;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { duration: 0.9, ease: "power3.out" } });

      timeline
        .fromTo("[data-gsap-hero-overlay]", { autoAlpha: 0.2 }, { autoAlpha: 1, duration: 1.2 }, 0)
        .fromTo("[data-gsap-hero-nav]", { autoAlpha: 0, y: -24 }, { autoAlpha: 1, y: 0 }, 0.1)
        .fromTo("[data-gsap-hero-chip]", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0 }, 0.25)
        .fromTo("[data-gsap-hero-title]", { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0 }, 0.35)
        .fromTo("[data-gsap-hero-copy]", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0 }, 0.5)
        .fromTo(
          "[data-gsap-hero-actions] > *",
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.75 },
          0.62,
        )
        .fromTo(
          "[data-gsap-hero-stat]",
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.75 },
          0.75,
        );
    }, section);

    return () => {
      context.revert();
    };
  }, [shouldReduceMotion]);

  return (
    <Box
      component="section"
      id="top"
      ref={sectionRef}
      sx={{ position: "relative", minHeight: "100dvh", overflow: "hidden", color: "common.white" }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: { xs: "scroll", md: "fixed" },
          transform: 'scale(1.06)',
          transformOrigin: 'center',
        }}
      />
      <Box
        data-gsap-hero-overlay
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(7, 20, 28, 0.58)",
          backdropFilter: "blur(1px)",
        }}
      />

      <Container
        maxWidth={false}
        sx={{
          position: "relative",
          zIndex: 1,
          width: { xs: "min(1200px, calc(100% - 24px))", sm: "min(1200px, calc(100% - 32px))" },
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          py: { xs: 2, md: 4 },
        }}
      >
        <Stack
          data-gsap-hero-nav
          spacing={{ xs: 1, md: 1.7 }}
          sx={{
            px: { xs: 1.1, sm: 1.5, md: 2.4 },
            py: { xs: 1, md: 1.3 },
            border: "1px solid rgba(255,255,255,0.16)",
            bgcolor: "rgba(5,16,24,0.2)",
            backdropFilter: "blur(16px)",
            borderRadius: "3px",
          }}
        >
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              minHeight: { xs: 40, md: "auto" },
            }}
          >
            <Link
              href="#top"
              underline="none"
              sx={{
                color: "common.white",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                minHeight: { xs: 40, md: "auto" },
                lineHeight: 1,
              }}
            >
              PolyPanel
            </Link>

            <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
              <Button
                component={RouterLink}
                to="/dashboard"
                size="medium"
                startIcon={<FiGrid size={14} />}
                sx={{
                  display: { xs: "none", md: "inline-flex" },
                  minHeight: 38,
                  px: 1.5,
                  color: "common.white",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  textTransform: "none",
                  border: "none",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  "& .MuiButton-startIcon": {
                    mr: 0.8,
                    color: "common.white",
                    opacity: 0.95,
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.18)",
                  },
                }}
              >
                Dashboard
              </Button>

              <IconButton
                aria-label={isMobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
                onClick={() => setIsMobileNavOpen((open) => !open)}
                sx={{
                  display: { xs: "inline-flex", md: "none" },
                  color: "common.white",
                  width: 40,
                  height: 40,
                  p: 0,
                  border: "none",
                  borderRadius: 0,
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                {isMobileNavOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              </IconButton>
            </Stack>
          </Stack>

          <Collapse
            in={isMobileNavOpen}
            timeout="auto"
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <Stack
              sx={{
                pt: 0.35,
                pb: 0.15,
                borderTop: "1px solid rgba(255,255,255,0.14)",
                "& a": { fontSize: "0.97rem" },
              }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  underline="none"
                  onClick={() => setIsMobileNavOpen(false)}
                  sx={{
                    color: "rgba(255,255,255,0.84)",
                    fontWeight: 500,
                    px: 0.55,
                    py: 0.95,
                    lineHeight: 1.3,
                    borderRadius: "2px",
                    "&:hover": {
                      color: "common.white",
                      backgroundColor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  {item.label}
                </Link>
              ))}

              <Button
                component={RouterLink}
                to="/dashboard"
                onClick={() => setIsMobileNavOpen(false)}
                startIcon={<FiGrid size={14} />}
                sx={{
                  mt: 0.45,
                  justifyContent: "flex-start",
                  textTransform: "none",
                  fontWeight: 600,
                  color: "common.white",
                  px: 0.55,
                  py: 0.9,
                  borderTop: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: 0,
                  "& .MuiButton-startIcon": {
                    mr: 0.8,
                    color: "common.white",
                    opacity: 0.95,
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Dashboard
              </Button>
            </Stack>
          </Collapse>

          <Stack
            direction="row"
            spacing={{ md: 4 }}
            sx={{
              display: { xs: "none", md: "flex" },
              flexWrap: "wrap",
              rowGap: 0.8,
              "& a": { fontSize: "0.98rem" },
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                underline="none"
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: 500,
                  py: 0.25,
                  "&:hover": { color: "common.white" },
                }}
              >
                {item.label}
              </Link>
            ))}
          </Stack>
        </Stack>

        <Box
          sx={{
            flex: 1,
            width: "100%",
            display: "grid",
            alignContent: "center",
            pt: { xs: 4, md: 7 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 1060,
              mx: "auto",
              display: "grid",
              justifyItems: "center",
              textAlign: "center",
              gap: { xs: 2.1, md: 2.75 },
            }}
          >
            <Typography
              variant="h1"
              data-gsap-hero-title
              sx={{
                maxWidth: { xs: "13ch", md: "13ch" },
                fontSize: { xs: "clamp(2rem, 9.5vw, 2.7rem)", md: "clamp(3.2rem, 8vw, 6.2rem)" },
                lineHeight: 0.96,
                color: "common.white",
                fontWeight: 700,
                textShadow: "0 14px 40px rgba(0,0,0,0.26)",
              }}
            >
              A practical route to solar on working farmland.
            </Typography>

            <Typography
              data-gsap-hero-copy
              sx={{
                maxWidth: { xs: "34ch", md: "58ch" },
                fontSize: { xs: "0.98rem", md: "1.12rem" },
                lineHeight: { xs: 1.6, md: 1.7 },
                color: "rgba(255,255,255,0.9)",
              }}
            >
              We help energy companies create dual land use by installing solar on farmers’ land
              without compromising agricultural productivity.
            </Typography>

            <Stack
              data-gsap-hero-actions
              direction={{ xs: "column", sm: "row" }}
              spacing={1.2}
              sx={{
                width: { xs: "100%", sm: "auto" },
                maxWidth: 420,
                justifySelf: "center",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                href="mailto:hello@yourcompany.co.uk?subject=Stacked%20solar%20enquiry"
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  bgcolor: "#49c889",
                  color: "#042018",
                  minHeight: 46,
                  "&:hover": { bgcolor: "#35b576" },
                }}
              >
                Book consultation
              </Button>
              <Button
                variant="outlined"
                href="#pricing"
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  minHeight: 46,
                  borderColor: "rgba(255,255,255,0.32)",
                  color: "common.white",
                  "&:hover": { borderColor: "rgba(255,255,255,0.7)" },
                }}
              >
                View pricing
              </Button>
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3, minmax(0, 1fr))",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                 gap: { xs: 0.9, sm: 1.2, md: 1.5 },
                 width: "100%",
                 maxWidth: 940,
                 mt: { xs: 1.8, md: 4 },
               }}
             >
              {impactItems.map((item) => (
                <Box
                  key={item.label}
                  data-gsap-hero-stat
                  sx={{
                    p: { xs: 1.6, md: 2.2 },
                    textAlign: "left",
                    border: "1px solid rgba(255,255,255,0.14)",
                    bgcolor: "rgba(7,18,27,0.34)",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 28px 60px rgba(1, 9, 14, 0.22)",
                    borderRadius: "3px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "1.4rem", md: "1.9rem" },
                      fontWeight: 700,
                      color: "common.white",
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.72)" }}>{item.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default HeroSection;
