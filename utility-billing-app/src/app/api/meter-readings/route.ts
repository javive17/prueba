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

    const meterReadings = await prisma.meterReading.findMany({
      where,
      include: {
        customer: {
          select: { id: true, customerName: true },
        },
        property: {
          select: { id: true, name: true },
        },
        items: {
          include: {
            utilityItem: true,
          },
        },
      },
      orderBy: { readingDate: 'desc' },
    })

    return NextResponse.json(meterReadings)
  } catch (error) {
    console.error('Error fetching meter readings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meter readings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Calculate total amount from items
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

    const meterReading = await prisma.meterReading.create({
      data: {
        readingNumber: generateNumber('MR'),
        customerId: data.customerId,
        propertyId: data.propertyId || null,
        readingDate: new Date(data.readingDate),
        status: data.status || 'Draft',
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

    return NextResponse.json(meterReading, { status: 201 })
  } catch (error) {
    console.error('Error creating meter reading:', error)
    return NextResponse.json(
      { error: 'Failed to create meter reading' },
      { status: 500 }
    )
  }
}
