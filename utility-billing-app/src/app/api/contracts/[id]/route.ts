import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contract = await prisma.contract.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        serviceRequest: true,
        adjustmentRule: true,
        properties: {
          include: { property: true },
        },
        invoices: {
          orderBy: { invoiceDate: 'desc' },
        },
      },
    })

    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(contract)
  } catch (error) {
    console.error('Error fetching contract:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contract' },
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

    // Get existing properties
    const existingContract = await prisma.contract.findUnique({
      where: { id: params.id },
      include: { properties: true },
    })

    // Delete existing property links
    await prisma.contractProperty.deleteMany({
      where: { contractId: params.id },
    })

    const contract = await prisma.contract.update({
      where: { id: params.id },
      data: {
        customerId: data.customerId,
        serviceRequestId: data.serviceRequestId || null,
        adjustmentRuleId: data.adjustmentRuleId || null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: data.status,
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

    // Update property statuses based on contract status
    if (existingContract?.properties) {
      const oldPropertyIds = existingContract.properties.map((p) => p.propertyId)
      // Set old properties to Available if not in new list
      const removedPropertyIds = oldPropertyIds.filter(
        (id) => !data.propertyIds?.includes(id)
      )
      if (removedPropertyIds.length > 0) {
        await prisma.property.updateMany({
          where: { id: { in: removedPropertyIds } },
          data: { status: 'Available' },
        })
      }
    }

    // Update new properties based on contract status
    if (data.propertyIds?.length > 0) {
      const newStatus = data.status === 'Active' ? 'Occupied' : 'Available'
      await prisma.property.updateMany({
        where: { id: { in: data.propertyIds } },
        data: { status: newStatus },
      })
    }

    return NextResponse.json(contract)
  } catch (error) {
    console.error('Error updating contract:', error)
    return NextResponse.json(
      { error: 'Failed to update contract' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get contract properties to update their status
    const contract = await prisma.contract.findUnique({
      where: { id: params.id },
      include: { properties: true },
    })

    await prisma.contract.delete({
      where: { id: params.id },
    })

    // Set properties to Available
    if (contract?.properties) {
      const propertyIds = contract.properties.map((p) => p.propertyId)
      await prisma.property.updateMany({
        where: { id: { in: propertyIds } },
        data: { status: 'Available' },
      })
    }

    return NextResponse.json({ message: 'Contract deleted successfully' })
  } catch (error) {
    console.error('Error deleting contract:', error)
    return NextResponse.json(
      { error: 'Failed to delete contract' },
      { status: 500 }
    )
  }
}
