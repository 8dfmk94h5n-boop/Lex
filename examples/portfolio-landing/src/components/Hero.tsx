import { useEffect, useRef, useState } from 'react'
import { useHlsSource } from '../lib/useHlsSource'
import { gsap } from '../lib/gsap'
import { heroRoles, HLS_SRC } from '../data/content'

export function Hero() {
  const videoRef = useHlsSource(HLS_SRC)
  const sectionRef = useRef<HTMLElement>(null)
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRoleIndex((i) => (i + 1) % heroRoles.length)
    }, 2000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(
        '.name-reveal',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1 },
      ).fromTo(
        '.blur-in',
        { opacity: 0, filter: 'blur(10px)', y: 20 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1 },
        0.3,
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" ref={sectionRef} className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-bg">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="min-h-full min-w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg to-transparent" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <span className="blur-in mb-8 text-xs uppercase tracking-[0.3em] text-muted">
          Collection &apos;26
        </span>

        <h1 className="name-reveal mb-6 font-display text-6xl italic leading-[0.9] tracking-tight text-text-primary md:text-8xl lg:text-9xl">
          Michael Smith
        </h1>

        <p className="blur-in mb-4 text-lg text-text-primary md:text-xl">
          A{' '}
          <span
            key={roleIndex}
            className="inline-block animate-role-fade-in font-display italic text-text-primary"
          >
            {heroRoles[roleIndex]}
          </span>{' '}
          lives in Chicago.
        </p>

        <p className="blur-in mb-12 max-w-md text-sm text-muted md:text-base">
          Designing seamless digital interactions by focusing on the unique nuances which bring
          systems to life.
        </p>

        <div className="blur-in inline-flex gap-4">
          <button
            type="button"
            onClick={() => scrollTo('work')}
            className="group relative rounded-full text-sm hover:scale-105"
          >
            <span className="accent-gradient absolute -inset-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative block rounded-full bg-text-primary px-7 py-3.5 text-bg transition-colors duration-300 group-hover:bg-bg group-hover:text-text-primary">
              See Works
            </span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('contact')}
            className="group relative rounded-full text-sm hover:scale-105"
          >
            <span className="accent-gradient absolute -inset-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative block rounded-full border-2 border-stroke bg-bg px-7 py-3.5 text-text-primary transition-colors duration-300 group-hover:border-transparent">
              Reach out&hellip;
            </span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-muted">Scroll</span>
        <div className="relative h-10 w-px overflow-hidden bg-stroke">
          <div className="animate-scroll-down absolute inset-x-0 top-0 h-4 bg-text-primary" />
        </div>
      </div>
    </section>
  )
}
