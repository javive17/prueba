import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateNumber } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')

    const where: any = {}

    if (status) where.status = status
    if (customerId) where.customerId = customerId

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        customer: {
          select: { id: true, customerName: true },
        },
        contract: {
          select: { id: true, contractNumber: true },
        },
        meterReading: {
          select: { id: true, readingNumber: true },
        },
        items: true,
        _count: {
          select: { payments: true },
        },
      },
      orderBy: { invoiceDate: 'desc' },
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Calculate totals
    let subtotal = 0
    const items = data.items?.map((item: any) => {
      const amount = parseFloat(item.quantity) * parseFloat(item.rate)
      subtotal += amount
      return {
        utilityItemId: item.utilityItemId || null,
        description: item.description,
        quantity: parseFloat(item.quantity),
        rate: parseFloat(item.rate),
        amount,
      }
    }) || []

    const taxRate = data.taxRate || 0
    const taxAmount = subtotal * (taxRate / 100)
    const totalAmount = subtotal + taxAmount

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: generateNumber('INV'),
        customerId: data.customerId,
        contractId: data.contractId || null,
        meterReadingId: data.meterReadingId || null,
        invoiceType: data.invoiceType || 'Standard',
        invoiceDate: new Date(data.invoiceDate),
        dueDate: new Date(data.dueDate),
        status: data.status || 'Draft',
        subtotal,
        taxAmount,
        totalAmount,
        paidAmount: 0,
        items: {
          create: items,
        },
      },
      include: {
        customer: true,
        items: true,
      },
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
