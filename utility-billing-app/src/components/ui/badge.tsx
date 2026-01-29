'use client'

import { HTMLAttributes } from 'react'
import { cn, getStatusColor } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status?: string
}

export function Badge({ className, status, children, ...props }: BadgeProps) {
  const statusClass = status ? getStatusColor(status) : 'bg-gray-100 text-gray-800'

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusClass,
        className
      )}
      {...props}
    >
      {children || status}
    </span>
  )
}
