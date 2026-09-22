import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

interface SharedProps {
  children: ReactNode
  className?: string
  innerClassName?: string
}

type LinkProps = SharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' }
type ButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' }

/** Pill with a gradient border that fades in on hover, wrapping an opaque inner surface. */
export function GradientBorderButton({
  children,
  className = '',
  innerClassName = '',
  as = 'button',
  ...rest
}: LinkProps | ButtonProps) {
  const inner = (
    <span
      className={`relative flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-text-primary backdrop-blur-md ${innerClassName}`}
    >
      {children}
    </span>
  )

  const wrapperClass = `group relative inline-flex rounded-full text-sm ${className}`
  const border = (
    <span className="accent-gradient absolute -inset-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
  )

  if (as === 'a') {
    return (
      <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={wrapperClass}>
        {border}
        {inner}
      </a>
    )
  }

  return (
    <button {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} className={wrapperClass}>
      {border}
      {inner}
    </button>
  )
}
