import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    const where: any = {}

    if (status) where.status = status
    if (type) where.propertyType = type
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { address: { contains: search } },
      ]
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        parent: {
          select: { id: true, name: true },
        },
        children: {
          select: { id: true, name: true, status: true, propertyType: true },
        },
        features: true,
        _count: {
          select: {
            customers: { where: { status: 'Active' } },
            contracts: { where: { status: 'Active' } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const property = await prisma.property.create({
      data: {
        name: data.name,
        propertyType: data.propertyType,
        parentId: data.parentId || null,
        address: data.address,
        area: data.area ? parseFloat(data.area) : null,
        areaUnit: data.areaUnit || 'sqft',
        unitType: data.unitType,
        status: data.status || 'Available',
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

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
}
