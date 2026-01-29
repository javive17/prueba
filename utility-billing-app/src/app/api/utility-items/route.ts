import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const utilityItems = await prisma.utilityItem.findMany({
      include: {
        category: true,
        tariffBlocks: {
          orderBy: { fromUnit: 'asc' },
        },
      },
      orderBy: { itemName: 'asc' },
    })

    return NextResponse.json(utilityItems)
  } catch (error) {
    console.error('Error fetching utility items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch utility items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const utilityItem = await prisma.utilityItem.create({
      data: {
        itemCode: data.itemCode,
        itemName: data.itemName,
        categoryId: data.categoryId || null,
        unit: data.unit,
        baseRate: parseFloat(data.baseRate),
        tariffBlocks: data.tariffBlocks?.length > 0 ? {
          create: data.tariffBlocks.map((t: any) => ({
            fromUnit: parseFloat(t.fromUnit),
            toUnit: t.toUnit ? parseFloat(t.toUnit) : null,
            rate: parseFloat(t.rate),
            description: t.description,
          })),
        } : undefined,
      },
      include: {
        category: true,
        tariffBlocks: true,
      },
    })

    return NextResponse.json(utilityItem, { status: 201 })
  } catch (error) {
    console.error('Error creating utility item:', error)
    return NextResponse.json(
      { error: 'Failed to create utility item' },
      { status: 500 }
    )
  }
}
