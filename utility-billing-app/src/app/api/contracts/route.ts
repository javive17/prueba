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

    const contracts = await prisma.contract.findMany({
      where,
      include: {
        customer: {
          select: { id: true, customerName: true },
        },
        serviceRequest: {
          select: { id: true, requestNumber: true },
        },
        adjustmentRule: {
          select: { id: true, ruleName: true },
        },
        properties: {
          include: {
            property: {
              select: { id: true, name: true, propertyType: true },
            },
          },
        },
        _count: {
          select: { invoices: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(contracts)
  } catch (error) {
    console.error('Error fetching contracts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const contract = await prisma.contract.create({
      data: {
        contractNumber: generateNumber('CON'),
        customerId: data.customerId,
        serviceRequestId: data.serviceRequestId || null,
        adjustmentRuleId: data.adjustmentRuleId || null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: data.status || 'Active',
        monthlyRent: data.monthlyRent ? parseFloat(data.monthlyRent) : null,
        depositAmount: data.depositAmount ? parseFloat(data.depositAmount) : null,
        termsAndConditions: data.termsAndConditions,
        properties: data.propertyIds?.length > 0 ? {
          create: data.propertyIds.map((propertyId: string) => ({
            propertyId,
          })),
        } : undefined,
      },
      include: {
        customer: true,
        properties: {
          include: { property: true },
        },
      },
    })

    // Update property status to Occupied
    if (data.propertyIds?.length > 0) {
      await prisma.property.updateMany({
        where: { id: { in: data.propertyIds } },
        data: { status: 'Occupied' },
      })
    }

    return NextResponse.json(contract, { status: 201 })
  } catch (error) {
    console.error('Error creating contract:', error)
    return NextResponse.json(
      { error: 'Failed to create contract' },
      { status: 500 }
    )
  }
}
