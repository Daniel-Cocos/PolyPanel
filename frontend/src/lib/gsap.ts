import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** Registers shared GSAP plugins for the landing page. */
gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
