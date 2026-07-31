import * as React from 'react'
import {cn} from '@sica/lib/cn'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

/**
 * Shared button primitive. Site-specific components stay in ui/ for now.
 */
export function Button({
  className,
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 text-left transition-opacity hover:opacity-70',
        variant === 'primary' && 'underline underline-offset-4',
        variant === 'ghost' && 'opacity-80',
        className,
      )}
      {...props}
    />
  )
}
