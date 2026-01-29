import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: {
        properties: {
          include: {
            property: true,
          },
        },
        contracts: {
          include: {
            properties: {
              include: {
                property: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        invoices: {
          take: 20,
          orderBy: { invoiceDate: 'desc' },
        },
        meterReadings: {
          take: 10,
          orderBy: { readingDate: 'desc' },
        },
        serviceRequests: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
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

    const customer = await prisma.customer.update({
      where: { id: params.id },
      data: {
        customerName: data.customerName,
        customerType: data.customerType,
        email: data.email,
        phone: data.phone,
        address: data.address,
        territory: data.territory,
        status: data.status,
      },
    })

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.customer.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    )
  }
}
