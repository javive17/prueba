import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        billStructure: {
          include: { items: true },
        },
        properties: {
          include: {
            property: true,
            adjustmentRule: true,
          },
        },
        items: true,
        contracts: true,
      },
    })

    if (!serviceRequest) {
      return NextResponse.json(
        { error: 'Service request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(serviceRequest)
  } catch (error) {
    console.error('Error fetching service request:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service request' },
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

    // Delete existing items and properties
    await prisma.serviceRequestItem.deleteMany({
      where: { serviceRequestId: params.id },
    })
    await prisma.serviceRequestProperty.deleteMany({
      where: { serviceRequestId: params.id },
    })

    // Calculate total
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

    const serviceRequest = await prisma.serviceRequest.update({
      where: { id: params.id },
      data: {
        customerId: data.customerId || null,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        requestType: data.requestType,
        status: data.status,
        billStructureId: data.billStructureId || null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        contractMonths: data.contractMonths ? parseInt(data.contractMonths) : null,
        totalAmount,
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

    return NextResponse.json(serviceRequest)
  } catch (error) {
    console.error('Error updating service request:', error)
    return NextResponse.json(
      { error: 'Failed to update service request' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.serviceRequest.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Service request deleted successfully' })
  } catch (error) {
    console.error('Error deleting service request:', error)
    return NextResponse.json(
      { error: 'Failed to delete service request' },
      { status: 500 }
    )
  }
}
