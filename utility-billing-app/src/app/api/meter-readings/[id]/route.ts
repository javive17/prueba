import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const meterReading = await prisma.meterReading.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        property: true,
        items: {
          include: {
            utilityItem: true,
          },
        },
        invoices: true,
      },
    })

    if (!meterReading) {
      return NextResponse.json(
        { error: 'Meter reading not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(meterReading)
  } catch (error) {
    console.error('Error fetching meter reading:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meter reading' },
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
    await prisma.meterReadingItem.deleteMany({
      where: { meterReadingId: params.id },
    })

    // Calculate total amount
    let totalAmount = 0
    const items = data.items?.map((item: any) => {
      const consumption = item.currentReading - item.previousReading
      const amount = consumption * item.rate
      totalAmount += amount
      return {
        utilityItemId: item.utilityItemId,
        meterNumber: item.meterNumber,
        previousReading: parseFloat(item.previousReading),
        currentReading: parseFloat(item.currentReading),
        consumption,
        rate: parseFloat(item.rate),
        amount,
      }
    }) || []

    const meterReading = await prisma.meterReading.update({
      where: { id: params.id },
      data: {
        customerId: data.customerId,
        propertyId: data.propertyId || null,
        readingDate: new Date(data.readingDate),
        status: data.status,
        totalAmount,
        items: {
          create: items,
        },
      },
      include: {
        customer: true,
        property: true,
        items: {
          include: {
            utilityItem: true,
          },
        },
      },
    })

    return NextResponse.json(meterReading)
  } catch (error) {
    console.error('Error updating meter reading:', error)
    return NextResponse.json(
      { error: 'Failed to update meter reading' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.meterReading.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Meter reading deleted successfully' })
  } catch (error) {
    console.error('Error deleting meter reading:', error)
    return NextResponse.json(
      { error: 'Failed to delete meter reading' },
      { status: 500 }
    )
  }
}
