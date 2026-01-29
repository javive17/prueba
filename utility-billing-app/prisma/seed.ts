import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const hashedPassword = await hash('password123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    },
  })
  console.log('Created admin user:', adminUser.email)

  // Create utility categories
  const electricityCategory = await prisma.utilityCategory.create({
    data: {
      name: 'Electricity',
      description: 'Electrical utility services',
    },
  })

  const waterCategory = await prisma.utilityCategory.create({
    data: {
      name: 'Water',
      description: 'Water utility services',
    },
  })

  const gasCategory = await prisma.utilityCategory.create({
    data: {
      name: 'Gas',
      description: 'Natural gas utility services',
    },
  })

  // Create utility items
  const electricity = await prisma.utilityItem.create({
    data: {
      itemCode: 'ELEC-001',
      itemName: 'Electricity',
      categoryId: electricityCategory.id,
      unit: 'kWh',
      baseRate: 0.12,
      tariffBlocks: {
        create: [
          { fromUnit: 0, toUnit: 100, rate: 0.10, description: 'First 100 kWh' },
          { fromUnit: 100, toUnit: 500, rate: 0.12, description: '101-500 kWh' },
          { fromUnit: 500, toUnit: null, rate: 0.15, description: 'Above 500 kWh' },
        ],
      },
    },
  })

  const water = await prisma.utilityItem.create({
    data: {
      itemCode: 'WATER-001',
      itemName: 'Water',
      categoryId: waterCategory.id,
      unit: 'Gallons',
      baseRate: 0.005,
      tariffBlocks: {
        create: [
          { fromUnit: 0, toUnit: 1000, rate: 0.004, description: 'First 1000 gallons' },
          { fromUnit: 1000, toUnit: 5000, rate: 0.005, description: '1001-5000 gallons' },
          { fromUnit: 5000, toUnit: null, rate: 0.007, description: 'Above 5000 gallons' },
        ],
      },
    },
  })

  const gas = await prisma.utilityItem.create({
    data: {
      itemCode: 'GAS-001',
      itemName: 'Natural Gas',
      categoryId: gasCategory.id,
      unit: 'Cubic Feet',
      baseRate: 0.02,
    },
  })

  console.log('Created utility items')

  // Create sample properties
  const mainBuilding = await prisma.property.create({
    data: {
      name: 'Sunrise Tower',
      propertyType: 'Building',
      address: '123 Main Street, Downtown',
      status: 'Occupied',
    },
  })

  const units = await Promise.all([
    prisma.property.create({
      data: {
        name: 'Unit 101',
        propertyType: 'Unit',
        parentId: mainBuilding.id,
        address: '123 Main Street, Unit 101',
        area: 850,
        areaUnit: 'sqft',
        unitType: '1BR',
        status: 'Available',
        monthlyRent: 1200,
        depositAmount: 2400,
        features: {
          create: [
            { featureName: 'Air Conditioning', featureType: 'Amenity' },
            { featureName: 'Balcony', featureType: 'Amenity' },
          ],
        },
      },
    }),
    prisma.property.create({
      data: {
        name: 'Unit 102',
        propertyType: 'Unit',
        parentId: mainBuilding.id,
        address: '123 Main Street, Unit 102',
        area: 1100,
        areaUnit: 'sqft',
        unitType: '2BR',
        status: 'Occupied',
        monthlyRent: 1600,
        depositAmount: 3200,
        features: {
          create: [
            { featureName: 'Air Conditioning', featureType: 'Amenity' },
            { featureName: 'Parking Space', featureType: 'Amenity' },
          ],
        },
      },
    }),
    prisma.property.create({
      data: {
        name: 'Unit 201',
        propertyType: 'Unit',
        parentId: mainBuilding.id,
        address: '123 Main Street, Unit 201',
        area: 950,
        areaUnit: 'sqft',
        unitType: '2BR',
        status: 'Available',
        monthlyRent: 1450,
        depositAmount: 2900,
      },
    }),
    prisma.property.create({
      data: {
        name: 'Unit 202',
        propertyType: 'Unit',
        parentId: mainBuilding.id,
        address: '123 Main Street, Unit 202',
        area: 750,
        areaUnit: 'sqft',
        unitType: 'Studio',
        status: 'Maintenance',
        monthlyRent: 950,
        depositAmount: 1900,
      },
    }),
  ])

  console.log('Created properties')

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        customerName: 'John Smith',
        customerType: 'Individual',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        address: '456 Oak Avenue, Suburb',
        territory: 'North District',
        status: 'Active',
      },
    }),
    prisma.customer.create({
      data: {
        customerName: 'Acme Corporation',
        customerType: 'Company',
        email: 'billing@acme.com',
        phone: '+1 (555) 987-6543',
        address: '789 Business Park, Commerce City',
        territory: 'Business District',
        status: 'Active',
      },
    }),
    prisma.customer.create({
      data: {
        customerName: 'Sarah Johnson',
        customerType: 'Individual',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 456-7890',
        address: '321 Maple Drive, Eastside',
        territory: 'East District',
        status: 'Active',
      },
    }),
  ])

  console.log('Created customers')

  // Create billing adjustment rule
  const adjustmentRule = await prisma.billingAdjustmentRule.create({
    data: {
      ruleName: 'Standard Late Fee',
      description: 'Standard late payment penalty',
      penaltyType: 'Percentage',
      penaltyValue: 5,
      gracePeriodDays: 7,
      penaltyFrequency: 'Once',
      isCompounding: false,
      penaltyCap: 100,
      isActive: true,
    },
  })

  // Create sample contract
  const contract = await prisma.contract.create({
    data: {
      contractNumber: 'CON-001',
      customerId: customers[0].id,
      adjustmentRuleId: adjustmentRule.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: 'Active',
      monthlyRent: 1600,
      depositAmount: 3200,
      termsAndConditions: 'Standard residential lease agreement',
      properties: {
        create: [{ propertyId: units[1].id }],
      },
    },
  })

  console.log('Created contract')

  // Create sample meter reading
  const meterReading = await prisma.meterReading.create({
    data: {
      readingNumber: 'MR-001',
      customerId: customers[0].id,
      propertyId: units[1].id,
      readingDate: new Date(),
      status: 'Submitted',
      totalAmount: 156.5,
      items: {
        create: [
          {
            utilityItemId: electricity.id,
            meterNumber: 'ELEC-M-001',
            previousReading: 1000,
            currentReading: 1350,
            consumption: 350,
            rate: 0.12,
            amount: 42.0,
          },
          {
            utilityItemId: water.id,
            meterNumber: 'WATER-M-001',
            previousReading: 5000,
            currentReading: 7500,
            consumption: 2500,
            rate: 0.005,
            amount: 12.5,
          },
        ],
      },
    },
  })

  console.log('Created meter reading')

  // Create sample invoice
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-001',
      customerId: customers[0].id,
      contractId: contract.id,
      meterReadingId: meterReading.id,
      invoiceType: 'Standard',
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'Submitted',
      subtotal: 1756.5,
      taxAmount: 175.65,
      totalAmount: 1932.15,
      paidAmount: 0,
      items: {
        create: [
          {
            utilityItemId: electricity.id,
            description: 'Electricity usage - 350 kWh',
            quantity: 350,
            rate: 0.12,
            amount: 42.0,
          },
          {
            utilityItemId: water.id,
            description: 'Water usage - 2500 gallons',
            quantity: 2500,
            rate: 0.005,
            amount: 12.5,
          },
          {
            description: 'Monthly Rent - Unit 102',
            quantity: 1,
            rate: 1600,
            amount: 1600,
          },
          {
            description: 'Maintenance Fee',
            quantity: 1,
            rate: 102,
            amount: 102,
          },
        ],
      },
    },
  })

  console.log('Created invoice')

  // Create settings
  await prisma.settings.create({
    data: {
      companyName: 'Utility Billing Co.',
      companyAddress: '123 Business Center, Commerce City, ST 12345',
      companyPhone: '+1 (555) 000-0000',
      companyEmail: 'info@utilitybilling.com',
      defaultCurrency: 'USD',
      taxRate: 10,
      requireDeposit: true,
      requireSiteSurvey: false,
      autoGenerateInvoice: true,
      paymentTermsDays: 30,
    },
  })

  console.log('Created settings')
  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
