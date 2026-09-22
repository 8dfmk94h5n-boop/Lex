import { useEffect, useRef } from 'react'
import { useHlsSource } from '../lib/useHlsSource'
import { gsap } from '../lib/gsap'
import { GradientBorderButton } from './GradientBorderButton'
import { HLS_SRC, socialLinks } from '../data/content'

const MARQUEE_TEXT = Array.from({ length: 10 }, () => 'BUILDING THE FUTURE').join(' • ') + ' • '

export function Contact() {
  const videoRef = useHlsSource(HLS_SRC)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        xPercent: -50,
        duration: 40,
        ease: 'none',
        repeat: -1,
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" className="relative overflow-hidden bg-bg pb-8 pt-16 md:pb-12 md:pt-20">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 scale-y-[-1]">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="min-h-full min-w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex flex-col items-center px-6 py-16 text-center md:py-24">
        <span className="mb-6 text-xs uppercase tracking-[0.3em] text-muted">Get in touch</span>
        <h2 className="mb-10 max-w-2xl font-display text-4xl italic text-text-primary md:text-6xl">
          Let&rsquo;s build something worth remembering.
        </h2>
        <GradientBorderButton
          as="a"
          href="mailto:hello@michaelsmith.com"
          innerClassName="px-7 py-3.5 text-base"
        >
          hello@michaelsmith.com
          <span aria-hidden="true">&rarr;</span>
        </GradientBorderButton>
      </div>

      <div className="relative z-10 overflow-hidden border-y border-white/10 py-4">
        <div ref={trackRef} className="flex w-max whitespace-nowrap">
          <span className="px-4 font-display text-2xl italic text-text-primary/60 md:text-3xl">
            {MARQUEE_TEXT}
          </span>
          <span className="px-4 font-display text-2xl italic text-text-primary/60 md:text-3xl" aria-hidden="true">
            {MARQUEE_TEXT}
          </span>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-8 flex max-w-[1200px] flex-col items-center justify-between gap-6 px-6 sm:flex-row md:px-10 lg:px-16">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          Available for projects
        </div>

        <div className="flex items-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
