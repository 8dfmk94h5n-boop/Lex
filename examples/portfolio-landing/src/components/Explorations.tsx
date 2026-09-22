import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { GradientBorderButton } from './GradientBorderButton'
import { galleryColumnA, galleryColumnB, type GalleryItem } from '../data/content'

function GalleryCard({
  item,
  onOpen,
}: {
  item: GalleryItem
  onOpen: (src: string) => void
}) {
  const [imageOk, setImageOk] = useState(true)

  return (
    <button
      type="button"
      onClick={() => onOpen(item.image)}
      className="aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl border border-stroke bg-surface transition-transform duration-300 hover:scale-[1.03]"
      style={{ transform: `rotate(${item.rotation}deg)` }}
    >
      {imageOk ? (
        <img
          src={item.image}
          alt="Exploration"
          onError={() => setImageOk(false)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-surface to-stroke" />
      )}
    </button>
  )
}

export function Explorations() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const colARef = useRef<HTMLDivElement>(null)
  const colBRef = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: contentRef.current,
        pinSpacing: false,
      })

      gsap.to(colARef.current, {
        y: '-12%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to(colBRef.current, {
        y: '12%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <section ref={sectionRef} className="relative min-h-[150vh] bg-bg md:min-h-[300vh]">
      <div ref={contentRef} className="relative z-10 flex h-screen items-center justify-center">
        <div className="flex max-w-xs flex-col items-center px-6 text-center sm:max-w-none">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-stroke" />
            <span className="text-xs uppercase tracking-[0.3em] text-muted">Explorations</span>
          </div>
          <h2 className="mb-4 text-3xl text-text-primary md:text-5xl">
            Visual <span className="font-display italic">playground</span>
          </h2>
          <p className="mb-8 max-w-md text-sm text-muted md:text-base">
            Personal experiments in motion, color, and form &mdash; scroll to explore.
          </p>
          <GradientBorderButton as="a" href="https://dribbble.com" target="_blank" rel="noreferrer">
            Follow on Dribbble
            <span aria-hidden="true">&rarr;</span>
          </GradientBorderButton>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 mx-auto hidden max-w-[1600px] items-center justify-between px-8 xl:flex xl:px-16">
        <div
          ref={colARef}
          className="pointer-events-auto flex w-[22vw] max-w-[320px] flex-col items-center gap-10"
        >
          {galleryColumnA.map((item, i) => (
            <GalleryCard key={i} item={item} onOpen={setLightbox} />
          ))}
        </div>
        <div
          ref={colBRef}
          className="pointer-events-auto flex w-[22vw] max-w-[320px] flex-col items-center gap-10 pt-40"
        >
          {galleryColumnB.map((item, i) => (
            <GalleryCard key={i} item={item} onOpen={setLightbox} />
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Exploration enlarged"
            className="max-h-full max-w-full rounded-2xl object-contain"
          />
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-6 top-6 text-sm uppercase tracking-[0.2em] text-white/80 hover:text-white"
          >
            Close
          </button>
        </div>
      )}
    </section>
  )
}
