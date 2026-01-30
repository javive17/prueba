'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Modal } from '@/components/ui/modal'
import { formatCurrency, formatDate, calculateConsumption } from '@/lib/utils'
import { Plus, Search, Gauge, Edit, Trash2, FileText } from 'lucide-react'

interface MeterReading {
  id: string
  readingNumber: string
  readingDate: string
  status: string
  totalAmount: number
  customer: { id: string; customerName: string }
  property: { id: string; name: string } | null
  items: {
    id: string
    meterNumber: string
    previousReading: number
    currentReading: number
    consumption: number
    rate: number
    amount: number
    utilityItem: { id: string; itemName: string; unit: string }
  }[]
}

interface Customer {
  id: string
  customerName: string
}

interface UtilityItem {
  id: string
  itemCode: string
  itemName: string
  unit: string
  baseRate: number
}

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Submitted', label: 'Submitted' },
  { value: 'Billed', label: 'Billed' },
]

export default function MeterReadingsPage() {
  const [meterReadings, setMeterReadings] = useState<MeterReading[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [utilityItems, setUtilityItems] = useState<UtilityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingReading, setEditingReading] = useState<MeterReading | null>(null)

  const [formData, setFormData] = useState({
    customerId: '',
    propertyId: '',
    readingDate: new Date().toISOString().split('T')[0],
    status: 'Draft',
    items: [
      {
        utilityItemId: '',
        meterNumber: '',
        previousReading: '',
        currentReading: '',
        rate: '',
      },
    ],
  })

  useEffect(() => {
    fetchMeterReadings()
    fetchCustomers()
    fetchUtilityItems()
  }, [statusFilter])

  const fetchMeterReadings = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)

      const res = await fetch(`/api/meter-readings?${params}`)
      const data = await res.json()
      setMeterReadings(data)
    } catch (error) {
      console.error('Error fetching meter readings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers?status=Active')
      const data = await res.json()
      setCustomers(data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const fetchUtilityItems = async () => {
    try {
      const res = await fetch('/api/utility-items')
      const data = await res.json()
      setUtilityItems(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching utility items:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingReading
        ? `/api/meter-readings/${editingReading.id}`
        : '/api/meter-readings'
      const method = editingReading ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowModal(false)
        setEditingReading(null)
        resetForm()
        fetchMeterReadings()
      }
    } catch (error) {
      console.error('Error saving meter reading:', error)
    }
  }

  const handleEdit = (reading: MeterReading) => {
    setEditingReading(reading)
    setFormData({
      customerId: reading.customer.id,
      propertyId: reading.property?.id || '',
      readingDate: reading.readingDate.split('T')[0],
      status: reading.status,
      items: reading.items.map((item) => ({
        utilityItemId: item.utilityItem.id,
        meterNumber: item.meterNumber,
        previousReading: item.previousReading.toString(),
        currentReading: item.currentReading.toString(),
        rate: item.rate.toString(),
      })),
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this meter reading?')) return

    try {
      const res = await fetch(`/api/meter-readings/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchMeterReadings()
      }
    } catch (error) {
      console.error('Error deleting meter reading:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      customerId: '',
      propertyId: '',
      readingDate: new Date().toISOString().split('T')[0],
      status: 'Draft',
      items: [
        {
          utilityItemId: '',
          meterNumber: '',
          previousReading: '',
          currentReading: '',
          rate: '',
        },
      ],
    })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          utilityItemId: '',
          meterNumber: '',
          previousReading: '',
          currentReading: '',
          rate: '',
        },
      ],
    })
  }

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    })
  }

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Auto-fill rate when utility item is selected
    if (field === 'utilityItemId') {
      const item = utilityItems.find((u) => u.id === value)
      if (item) {
        newItems[index].rate = item.baseRate.toString()
      }
    }

    setFormData({ ...formData, items: newItems })
  }

  const customerOptions = [
    { value: '', label: 'Select Customer' },
    ...customers.map((c) => ({ value: c.id, label: c.customerName })),
  ]

  const utilityItemOptions = [
    { value: '', label: 'Select Utility' },
    ...utilityItems.map((u) => ({ value: u.id, label: `${u.itemName} (${u.unit})` })),
  ]

  return (
    <div>
      <Header title="Meter Readings" />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="w-40">
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
              </div>

              <Button
                onClick={() => {
                  setEditingReading(null)
                  resetForm()
                  setShowModal(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Meter Reading
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Meter Readings Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : meterReadings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Gauge className="w-12 h-12 mb-4" />
                <p>No meter readings found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowModal(true)}
                >
                  Create your first meter reading
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reading #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meterReadings.map((reading) => (
                    <TableRow key={reading.id}>
                      <TableCell className="font-medium">
                        {reading.readingNumber}
                      </TableCell>
                      <TableCell>{formatDate(reading.readingDate)}</TableCell>
                      <TableCell>{reading.customer.customerName}</TableCell>
                      <TableCell>{reading.property?.name || '-'}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {reading.items.map((item, idx) => (
                            <div key={idx}>
                              {item.utilityItem.itemName}: {item.consumption}{' '}
                              {item.utilityItem.unit}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(reading.totalAmount)}</TableCell>
                      <TableCell>
                        <Badge status={reading.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(reading)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(reading.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingReading(null)
          resetForm()
        }}
        title={editingReading ? 'Edit Meter Reading' : 'New Meter Reading'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Customer"
              options={customerOptions}
              value={formData.customerId}
              onChange={(e) =>
                setFormData({ ...formData, customerId: e.target.value })
              }
              required
            />
            <Input
              label="Reading Date"
              type="date"
              value={formData.readingDate}
              onChange={(e) =>
                setFormData({ ...formData, readingDate: e.target.value })
              }
              required
            />
            <Select
              label="Status"
              options={statusOptions.slice(1)}
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            />
          </div>

          {/* Items */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Meter Reading Items</h4>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-6 gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <Select
                    options={utilityItemOptions}
                    value={item.utilityItemId}
                    onChange={(e) =>
                      updateItem(index, 'utilityItemId', e.target.value)
                    }
                    required
                  />
                  <Input
                    placeholder="Meter #"
                    value={item.meterNumber}
                    onChange={(e) =>
                      updateItem(index, 'meterNumber', e.target.value)
                    }
                    required
                  />
                  <Input
                    placeholder="Previous"
                    type="number"
                    value={item.previousReading}
                    onChange={(e) =>
                      updateItem(index, 'previousReading', e.target.value)
                    }
                    required
                  />
                  <Input
                    placeholder="Current"
                    type="number"
                    value={item.currentReading}
                    onChange={(e) =>
                      updateItem(index, 'currentReading', e.target.value)
                    }
                    required
                  />
                  <Input
                    placeholder="Rate"
                    type="number"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) => updateItem(index, 'rate', e.target.value)}
                    required
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {item.previousReading && item.currentReading
                        ? formatCurrency(
                            calculateConsumption(
                              parseFloat(item.currentReading),
                              parseFloat(item.previousReading)
                            ) * parseFloat(item.rate || '0')
                          )
                        : '-'}
                    </span>
                    {formData.items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false)
                setEditingReading(null)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingReading ? 'Update Reading' : 'Create Reading'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
