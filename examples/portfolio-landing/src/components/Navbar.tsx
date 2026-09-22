import { useEffect, useState, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { navLinks } from '../data/content'
import { GradientBorderButton } from './GradientBorderButton'

function useScrollSpy(sectionIds: string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0])

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sectionIds])

  return activeId
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const activeSection = useScrollSpy(['home', 'work'])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/resume') return location.pathname === '/resume'
    const hash = href.split('#')[1]
    return location.pathname === '/' && activeSection === hash
  }

  const handleNavClick = (event: MouseEvent, href: string) => {
    if (!href.includes('#')) return
    const hash = href.split('#')[1]

    if (location.pathname !== '/') return

    event.preventDefault()
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    navigate(`/#${hash}`, { replace: true })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 md:pt-6">
      <div
        className={`inline-flex items-center rounded-full border border-white/10 bg-surface px-2 py-2 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? 'shadow-md shadow-black/10' : ''
        }`}
      >
        <Link
          to="/"
          className="group relative flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110"
          aria-label="Home"
        >
          <span className="accent-gradient absolute inset-0 rounded-full transition-[background-position] duration-500 group-hover:[background-image:linear-gradient(270deg,#89AACC_0%,#4E85BF_100%)]" />
          <span className="absolute inset-[1.5px] flex items-center justify-center rounded-full bg-bg">
            <span className="font-display text-[13px] italic text-text-primary">JA</span>
          </span>
        </Link>

        <span className="mx-1 hidden h-5 w-px bg-stroke sm:block" />

        {navLinks.map((link) => {
          const active = isActive(link.href)
          return (
            <Link
              key={link.label}
              to={link.href}
              onClick={(event) => handleNavClick(event, link.href)}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors duration-200 sm:px-4 sm:py-2 sm:text-sm ${
                active
                  ? 'bg-stroke/50 text-text-primary'
                  : 'text-muted hover:bg-stroke/50 hover:text-text-primary'
              }`}
            >
              {link.label}
            </Link>
          )
        })}

        <span className="mx-1 h-5 w-px bg-stroke" />

        <GradientBorderButton
          as="a"
          href="mailto:hello@michaelsmith.com"
          className="text-xs sm:text-sm"
          innerClassName="px-3 py-1.5 sm:px-4 sm:py-2"
        >
          Say hi
          <span aria-hidden="true">↗</span>
        </GradientBorderButton>
      </div>
    </nav>
  )
}
