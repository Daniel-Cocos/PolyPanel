import { useEffect } from 'react'
import type { RefObject } from 'react'
import { useReducedMotion } from 'framer-motion'
import { gsap } from '../../lib/gsap'

/** Attaches GSAP scroll timelines to landing page sections. */
function useLandingPageGsap(rootRef: RefObject<HTMLElement | null>) {
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current

    if (!root || shouldReduceMotion) {
      return
    }

    const context = gsap.context(() => {
      const cardGroups = gsap.utils.toArray<HTMLElement>('[data-gsap-card-group]')

      cardGroups.forEach((group) => {
        const cards = group.querySelectorAll<HTMLElement>('[data-gsap-card]')

        if (!cards.length) {
          return
        }

        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: group,
              start: 'top 78%',
              once: true,
            },
          },
        )
      })

      const dividers = gsap.utils.toArray<HTMLElement>('[data-gsap-divider]')

      dividers.forEach((divider) => {
        gsap.fromTo(
          divider,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: divider,
              start: 'top 82%',
              once: true,
            },
          },
        )
      })

      const buttons = gsap.utils.toArray<HTMLElement>('[data-gsap-cta-button]')

      buttons.forEach((button) => {
        gsap.fromTo(
          button,
          { autoAlpha: 0, y: 18, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: button,
              start: 'top 88%',
              once: true,
            },
          },
        )
      })

      const footerLinks = gsap.utils.toArray<HTMLElement>('[data-gsap-footer-link]')

      if (footerLinks.length) {
        gsap.fromTo(
          footerLinks,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: footerLinks[0].closest('footer'),
              start: 'top bottom',
              once: true,
            },
          },
        )
      }
    }, root)

    return () => {
      context.revert()
    }
  }, [rootRef, shouldReduceMotion])
}

export default useLandingPageGsap
