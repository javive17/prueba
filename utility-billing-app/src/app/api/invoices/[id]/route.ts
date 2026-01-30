import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        contract: true,
        meterReading: {
          include: {
            items: {
              include: {
                utilityItem: true,
              },
            },
          },
        },
        items: {
          include: {
            utilityItem: true,
          },
        },
        payments: {
          orderBy: { paymentDate: 'desc' },
        },
      },
    })

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()

    // Delete existing items
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: params.id },
    })

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

    const invoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        customerId: data.customerId,
        contractId: data.contractId || null,
        meterReadingId: data.meterReadingId || null,
        invoiceType: data.invoiceType,
        invoiceDate: new Date(data.invoiceDate),
        dueDate: new Date(data.dueDate),
        status: data.status,
        subtotal,
        taxAmount,
        totalAmount,
        items: {
          create: items,
        },
      },
      include: {
        customer: true,
        items: true,
      },
    })

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.invoice.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Invoice deleted successfully' })
  } catch (error) {
    console.error('Error deleting invoice:', error)
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    )
  }
}
