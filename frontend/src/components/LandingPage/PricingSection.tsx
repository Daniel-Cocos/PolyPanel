import { useState } from "react";
import { Box, Button, Chip, Collapse, Container, Paper, Stack, Typography } from "@mui/material";
import {
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiClipboard,
  FiMap,
  FiSettings,
  FiX,
} from "react-icons/fi";
import pricingImage from "../../assets/pexels-kindelmedia-9799742.jpg";

const pricingFeatures = [
  "Farm map view",
  "Live sensor dashboard",
  "Weather alerts",
  "Crop monitoring",
  "Satellite farm design tool",
  "Annual yield simulation (up to 5 farms)",
  "Basic planning report export",
  "Grid price optimisation dashboard",
  "Unlimited farm simulations",
  "Automated council planning PDF export",
  "Biodiversity Net Gain calculator",
  "Multi-farm portfolio management",
  "API access",
  "Dedicated support",
] as const;

type PricingFeature = (typeof pricingFeatures)[number];

type PricingTier = {
  name: string;
  price: string;
  summary: string;
  highlights: readonly string[];
  includedFeatures: readonly PricingFeature[];
  typicalCosts?: readonly string[];
  cta: string;
  featured: boolean;
  icon: typeof FiMap;
};

const pricingTiers: readonly PricingTier[] = [
  {
    name: "Free",
    price: "Free",
    summary: "For farmers using PolyPanel on active land.",
    highlights: ["Farm map view", "Live sensor dashboard", "Weather alerts", "Crop monitoring"],
    includedFeatures: [
      "Farm map view",
      "Live sensor dashboard",
      "Weather alerts",
      "Crop monitoring",
    ],
    cta: "Get farmer access",
    featured: true,
    icon: FiMap,
  },
  {
    name: "Professional",
    price: "£499/month",
    summary: "For small energy developers.",
    highlights: [
      "Satellite farm design tool",
      "Annual yield simulation for up to 5 farms",
      "Basic planning report export",
      "Grid price optimisation dashboard",
    ],
    includedFeatures: [
      "Farm map view",
      "Live sensor dashboard",
      "Weather alerts",
      "Crop monitoring",
      "Satellite farm design tool",
      "Annual yield simulation (up to 5 farms)",
      "Basic planning report export",
      "Grid price optimisation dashboard",
    ],
    cta: "Start professional",
    featured: false,
    icon: FiClipboard,
  },
  {
    name: "Enterprise",
    price: "£1,500/month",
    summary: "For large energy developers.",
    highlights: [
      "Unlimited farm simulations",
      "Automated council planning PDF export",
      "Biodiversity Net Gain calculator",
      "Multi-farm portfolio management",
    ],
    includedFeatures: [
      "Farm map view",
      "Live sensor dashboard",
      "Weather alerts",
      "Crop monitoring",
      "Satellite farm design tool",
      "Annual yield simulation (up to 5 farms)",
      "Basic planning report export",
      "Grid price optimisation dashboard",
      "Unlimited farm simulations",
      "Automated council planning PDF export",
      "Biodiversity Net Gain calculator",
      "Multi-farm portfolio management",
      "API access",
      "Dedicated support",
    ],
    cta: "Talk to enterprise",
    featured: false,
    icon: FiSettings,
  },
] as const;

/** Presents simplified pricing cards with optional detailed comparison. */
function PricingSection() {
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  return (
    <Box
      component="section"
      id="pricing"
      sx={{
        position: "relative",
        py: { xs: 8, md: 14 },
        color: "common.white",
        overflow: "hidden",
        backgroundColor: "#08151d",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${pricingImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: { xs: "scroll", md: "fixed" },
          transform: 'scale(1.06)',
          transformOrigin: 'center',
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(7,20,28,0.76) 0%, rgba(7,20,28,0.88) 100%)",
          backdropFilter: "blur(3px)",
        }}
      />
      <Container
        maxWidth={false}
        sx={{ position: "relative", zIndex: 1, width: { xs: "min(1200px, calc(100% - 24px))", sm: "min(1200px, calc(100% - 32px))" } }}
      >
        <Stack spacing={4}>
          <Stack spacing={2} sx={{ maxWidth: 760 }}>
            <Chip
              label="Pricing"
              sx={{
                alignSelf: "flex-start",
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(255,255,255,0.16)",
                bgcolor: "rgba(255,255,255,0.08)",
              }}
            />
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: "1.85rem", md: "3rem" }, lineHeight: 1.03, maxWidth: { xs: "14ch", md: "20ch" } }}
            >
              Pricing for farmers and energy developers.
            </Typography>
            <Typography sx={{ color: "rgba(232,245,249,0.82)", maxWidth: { xs: "35ch", md: "60ch" }, lineHeight: { xs: 1.6, md: 1.7 } }}>
              Farmers receive access once a project is installed, using the sensors provided by the
              PolyPanel infrastructure. Paid plans give energy developers the modelling, reporting,
              and portfolio tools needed to plan and manage sites.
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
              gap: { xs: 2, md: 2.5 },
            }}
          >
            {pricingTiers.map((tier) => {
              const TierIcon = tier.icon;

              return (
                <Paper
                  key={tier.name}
                  variant="outlined"
                  sx={{
                    p: { xs: 2.2, md: 2.6 },
                    borderRadius: "3px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.7,
                    minHeight: "100%",
                    borderColor: tier.featured
                      ? "rgba(73, 200, 137, 0.92)"
                      : "rgba(255,255,255,0.14)",
                    background: tier.featured
                      ? "linear-gradient(180deg, rgba(8, 29, 36, 0.96) 0%, rgba(9, 35, 45, 0.92) 100%)"
                      : "linear-gradient(180deg, rgba(9, 27, 37, 0.86) 0%, rgba(8, 22, 31, 0.82) 100%)",
                    backdropFilter: "blur(16px)",
                    boxShadow: tier.featured
                      ? "0 24px 56px rgba(1, 11, 16, 0.38)"
                      : "0 18px 40px rgba(1, 11, 16, 0.26)",
                  }}
                >
                  <Stack spacing={1.25}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "3px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: tier.featured ? "#042018" : "secondary.main",
                          bgcolor: tier.featured ? "secondary.main" : "rgba(73, 200, 137, 0.12)",
                        }}
                      >
                        <TierIcon size={16} />
                      </Box>
                      <Typography variant="h5" sx={{ fontSize: { xs: "1.25rem", md: "1.35rem" }, color: "common.white" }}>
                        {tier.name}
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{
                        color: tier.featured ? "secondary.light" : "primary.light",
                        fontWeight: 700,
                        fontSize: { xs: "1.6rem", md: "1.85rem" },
                      }}
                    >
                      {tier.price}
                    </Typography>
                    <Typography sx={{ color: "rgba(232,245,249,0.82)", lineHeight: 1.55 }}>
                      {tier.summary}
                    </Typography>
                  </Stack>

                  <Stack component="ul" spacing={1} sx={{ m: 0, p: 0, listStyle: "none" }}>
                    {tier.highlights.map((feature) => (
                      <Stack
                        component="li"
                        key={feature}
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "baseline" }}
                      >
                        <Box
                          sx={{
                            color: "secondary.main",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transform: "translateY(1px)",
                          }}
                        >
                          <FiCheckCircle size={14} />
                        </Box>
                          <Typography sx={{ color: "rgba(232,245,249,0.82)", lineHeight: 1.45, minWidth: 0 }}>
                            {feature}
                          </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Button
                    variant={tier.featured ? "contained" : "outlined"}
                    href="#contact"
                    sx={
                      tier.featured
                        ? {
                            mt: "auto",
                            width: "100%",
                            bgcolor: "secondary.main",
                            color: "#042018",
                            "&:hover": { bgcolor: "secondary.light" },
                          }
                        : { mt: "auto", width: "100%" }
                    }
                  >
                    {tier.cta}
                  </Button>
                </Paper>
              );
            })}
          </Box>

          <Paper
            variant="outlined"
            sx={{
              borderRadius: "3px",
              borderColor: "rgba(255,255,255,0.12)",
              bgcolor: "rgba(8, 22, 31, 0.76)",
              backdropFilter: "blur(14px)",
              overflow: "hidden",
              transition: "box-shadow 180ms ease",
              boxShadow: isComparisonOpen ? "0 18px 36px rgba(1, 11, 16, 0.24)" : "none",
            }}
          >
            <Box
              component="button"
              type="button"
              aria-expanded={isComparisonOpen}
              onClick={() => setIsComparisonOpen((open) => !open)}
              sx={{
                width: "100%",
                display: "flex",
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 2,
                p: { xs: 2, md: 2.4 },
                cursor: "pointer",
                textAlign: "left",
                color: "inherit",
                background: "transparent",
                border: 0,
                font: "inherit",
              }}
            >
              <Stack spacing={0.5}>
                <Typography sx={{ color: "common.white", fontWeight: 700 }}>
                  Compare all features
                </Typography>
                <Typography sx={{ color: "rgba(232,245,249,0.68)" }}>
                  See how each plan compares across planning, monitoring, and delivery tools.
                </Typography>
              </Stack>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "3px",
                  color: "common.white",
                  bgcolor: isComparisonOpen ? "secondary.main" : "rgba(255,255,255,0.08)",
                  boxShadow: isComparisonOpen
                    ? "0 0 0 1px rgba(73, 200, 137, 0.35)"
                    : "inset 0 0 0 1px rgba(255,255,255,0.12)",
                  transform: isComparisonOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition:
                    "transform 220ms ease, background-color 180ms ease, box-shadow 180ms ease",
                }}
              >
                <FiChevronDown size={20} />
              </Box>
            </Box>

            <Collapse in={isComparisonOpen} timeout={260} unmountOnExit>
              <Box sx={{ px: { xs: 1.1, md: 2.4 }, pb: { xs: 1.4, md: 2.2 } }}>
                <Box sx={{ overflowX: "auto", WebkitOverflowScrolling: "touch", mx: { xs: -0.2, md: 0 } }}>
                <Box
                  sx={{
                    display: "grid",
                    minWidth: { xs: 620, md: 0 },
                    gridTemplateColumns: {
                      xs: "minmax(180px, 1.6fr) repeat(3, minmax(64px, 1fr))",
                      md: "minmax(260px, 1.8fr) repeat(3, minmax(90px, 1fr))",
                    },
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    borderLeft: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Box
                    sx={{
                      p: 1.2,
                      borderRight: "1px solid rgba(255,255,255,0.08)",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                  />
                  {pricingTiers.map((tier) => (
                    <Box
                      key={tier.name}
                      sx={{
                        p: 1.2,
                        textAlign: "center",
                        borderRight: "1px solid rgba(255,255,255,0.08)",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <Typography sx={{ color: "common.white", fontWeight: 700 }}>
                        {tier.name}
                      </Typography>
                    </Box>
                  ))}

                  {pricingFeatures.map((feature) => (
                    <Box key={feature} sx={{ display: "contents" }}>
                      <Box
                        sx={{
                          p: 1.2,
                          borderRight: "1px solid rgba(255,255,255,0.08)",
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <Typography sx={{ color: "rgba(232,245,249,0.76)", lineHeight: 1.4 }}>
                          {feature}
                        </Typography>
                      </Box>
                      {pricingTiers.map((tier) => {
                        const included = tier.includedFeatures.includes(feature);

                        return (
                          <Box
                            key={`${feature}-${tier.name}`}
                            sx={{
                              p: 1.2,
                              display: "grid",
                              placeItems: "center",
                              borderRight: "1px solid rgba(255,255,255,0.08)",
                              borderBottom: "1px solid rgba(255,255,255,0.08)",
                              color: included ? "secondary.main" : "rgba(242,109,120,0.92)",
                            }}
                          >
                            {included ? <FiCheck size={16} /> : <FiX size={16} />}
                          </Box>
                        );
                      })}
                    </Box>
                  ))}
                </Box>
                </Box>
              </Box>
            </Collapse>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}

export default PricingSection;
