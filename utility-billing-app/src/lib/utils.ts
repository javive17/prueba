import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function generateNumber(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}${random}`
}

export function calculateConsumption(current: number, previous: number): number {
  return Math.max(0, current - previous)
}

export function calculateTieredAmount(
  consumption: number,
  tariffBlocks: { fromUnit: number; toUnit: number | null; rate: number }[]
): number {
  let totalAmount = 0
  let remainingConsumption = consumption

  const sortedBlocks = [...tariffBlocks].sort((a, b) => a.fromUnit - b.fromUnit)

  for (const block of sortedBlocks) {
    if (remainingConsumption <= 0) break

    const blockSize = block.toUnit !== null
      ? block.toUnit - block.fromUnit
      : remainingConsumption

    const unitsInBlock = Math.min(remainingConsumption, blockSize)
    totalAmount += unitsInBlock * block.rate
    remainingConsumption -= unitsInBlock
  }

  return totalAmount
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-gray-100 text-gray-800',
    Available: 'bg-green-100 text-green-800',
    Occupied: 'bg-blue-100 text-blue-800',
    Maintenance: 'bg-yellow-100 text-yellow-800',
    Reserved: 'bg-purple-100 text-purple-800',
    Draft: 'bg-gray-100 text-gray-800',
    Submitted: 'bg-blue-100 text-blue-800',
    Billed: 'bg-green-100 text-green-800',
    Paid: 'bg-green-100 text-green-800',
    Overdue: 'bg-red-100 text-red-800',
    Cancelled: 'bg-red-100 text-red-800',
    Completed: 'bg-green-100 text-green-800',
    'Not Billed': 'bg-gray-100 text-gray-800',
    'Partly Billed': 'bg-yellow-100 text-yellow-800',
    'Fully Billed': 'bg-green-100 text-green-800',
    Expired: 'bg-orange-100 text-orange-800',
    Terminated: 'bg-red-100 text-red-800',
  }
  return statusColors[status] || 'bg-gray-100 text-gray-800'
}
