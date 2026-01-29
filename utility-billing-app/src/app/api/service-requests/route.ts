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

    const serviceRequests = await prisma.serviceRequest.findMany({
      where,
      include: {
        customer: {
          select: { id: true, customerName: true },
        },
        billStructure: {
          select: { id: true, name: true },
        },
        properties: {
          include: {
            property: {
              select: { id: true, name: true, propertyType: true },
            },
          },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(serviceRequests)
  } catch (error) {
    console.error('Error fetching service requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Calculate total from items
    let totalAmount = 0
    const items = data.items?.map((item: any) => {
      const amount = parseFloat(item.quantity) * parseFloat(item.rate)
      totalAmount += amount
      return {
        itemDescription: item.itemDescription,
        quantity: parseFloat(item.quantity),
        rate: parseFloat(item.rate),
        amount,
      }
    }) || []

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        requestNumber: generateNumber('SR'),
        customerId: data.customerId || null,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        requestType: data.requestType,
        status: data.status || 'Draft',
        billStructureId: data.billStructureId || null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        contractMonths: data.contractMonths ? parseInt(data.contractMonths) : null,
        billingStatus: 'Not Billed',
        totalAmount,
        billedAmount: 0,
        notes: data.notes,
        properties: data.propertyIds?.length > 0 ? {
          create: data.propertyIds.map((propertyId: string) => ({
            propertyId,
          })),
        } : undefined,
        items: items.length > 0 ? {
          create: items,
        } : undefined,
      },
      include: {
        customer: true,
        properties: {
          include: { property: true },
        },
        items: true,
      },
    })

    return NextResponse.json(serviceRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating service request:', error)
    return NextResponse.json(
      { error: 'Failed to create service request' },
      { status: 500 }
    )
  }
}
