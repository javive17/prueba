import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        parent: true,
        children: true,
        features: true,
        customers: {
          include: {
            customer: true,
          },
          where: { status: 'Active' },
        },
        contracts: {
          include: {
            contract: true,
          },
        },
        meterReadings: {
          take: 10,
          orderBy: { readingDate: 'desc' },
        },
      },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' },
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

    // Delete existing features if updating
    if (data.features) {
      await prisma.propertyFeature.deleteMany({
        where: { propertyId: params.id },
      })
    }

    const property = await prisma.property.update({
      where: { id: params.id },
      data: {
        name: data.name,
        propertyType: data.propertyType,
        parentId: data.parentId || null,
        address: data.address,
        area: data.area ? parseFloat(data.area) : null,
        areaUnit: data.areaUnit,
        unitType: data.unitType,
        status: data.status,
        monthlyRent: data.monthlyRent ? parseFloat(data.monthlyRent) : null,
        depositAmount: data.depositAmount ? parseFloat(data.depositAmount) : null,
        features: data.features?.length > 0 ? {
          create: data.features.map((f: any) => ({
            featureName: f.featureName,
            featureType: f.featureType,
            value: f.value,
          })),
        } : undefined,
      },
      include: {
        parent: true,
        features: true,
      },
    })

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.property.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Property deleted successfully' })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}
