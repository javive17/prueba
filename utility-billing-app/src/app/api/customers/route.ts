import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}

    if (status) where.status = status
    if (search) {
      where.OR = [
        { customerName: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ]
    }

    const customers = await prisma.customer.findMany({
      where,
      include: {
        properties: {
          include: {
            property: {
              select: { id: true, name: true, propertyType: true },
            },
          },
          where: { status: 'Active' },
        },
        _count: {
          select: {
            invoices: true,
            contracts: { where: { status: 'Active' } },
            meterReadings: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const customer = await prisma.customer.create({
      data: {
        customerName: data.customerName,
        customerType: data.customerType || 'Individual',
        email: data.email,
        phone: data.phone,
        address: data.address,
        territory: data.territory,
        status: data.status || 'Active',
      },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}
