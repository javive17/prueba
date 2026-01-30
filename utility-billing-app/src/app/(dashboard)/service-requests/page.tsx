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
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, ClipboardList, Edit, Trash2, Eye } from 'lucide-react'

interface ServiceRequest {
  id: string
  requestNumber: string
  requestType: string
  status: string
  billingStatus: string
  customerName: string | null
  customerEmail: string | null
  startDate: string | null
  endDate: string | null
  totalAmount: number
  customer: { id: string; customerName: string } | null
  properties: {
    property: { id: string; name: string; propertyType: string }
  }[]
}

interface Customer {
  id: string
  customerName: string
}

interface Property {
  id: string
  name: string
  propertyType: string
  status: string
}

const requestTypes = [
  { value: 'New Connection', label: 'New Connection' },
  { value: 'Rental', label: 'Rental' },
  { value: 'Service Change', label: 'Service Change' },
  { value: 'Disconnection', label: 'Disconnection' },
]

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Site Survey', label: 'Site Survey' },
  { value: 'BOM', label: 'BOM' },
  { value: 'Billing', label: 'Billing' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
]

export default function ServiceRequestsPage() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingRequest, setEditingRequest] = useState<ServiceRequest | null>(null)

  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    requestType: 'New Connection',
    status: 'Draft',
    startDate: '',
    endDate: '',
    contractMonths: '',
    propertyIds: [] as string[],
    notes: '',
    items: [{ itemDescription: '', quantity: '1', rate: '' }],
  })

  useEffect(() => {
    fetchServiceRequests()
    fetchCustomers()
    fetchProperties()
  }, [statusFilter])

  const fetchServiceRequests = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)

      const res = await fetch(`/api/service-requests?${params}`)
      const data = await res.json()
      setServiceRequests(data)
    } catch (error) {
      console.error('Error fetching service requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers')
      const data = await res.json()
      setCustomers(data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/properties?status=Available')
      const data = await res.json()
      setProperties(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingRequest
        ? `/api/service-requests/${editingRequest.id}`
        : '/api/service-requests'
      const method = editingRequest ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowModal(false)
        setEditingRequest(null)
        resetForm()
        fetchServiceRequests()
      }
    } catch (error) {
      console.error('Error saving service request:', error)
    }
  }

  const handleEdit = (request: ServiceRequest) => {
    setEditingRequest(request)
    setFormData({
      customerId: request.customer?.id || '',
      customerName: request.customerName || '',
      customerEmail: request.customerEmail || '',
      customerPhone: '',
      requestType: request.requestType,
      status: request.status,
      startDate: request.startDate?.split('T')[0] || '',
      endDate: request.endDate?.split('T')[0] || '',
      contractMonths: '',
      propertyIds: request.properties.map((p) => p.property.id),
      notes: '',
      items: [{ itemDescription: '', quantity: '1', rate: '' }],
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service request?')) return

    try {
      const res = await fetch(`/api/service-requests/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchServiceRequests()
      }
    } catch (error) {
      console.error('Error deleting service request:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      customerId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      requestType: 'New Connection',
      status: 'Draft',
      startDate: '',
      endDate: '',
      contractMonths: '',
      propertyIds: [],
      notes: '',
      items: [{ itemDescription: '', quantity: '1', rate: '' }],
    })
  }

  const toggleProperty = (propertyId: string) => {
    const current = formData.propertyIds
    if (current.includes(propertyId)) {
      setFormData({
        ...formData,
        propertyIds: current.filter((id) => id !== propertyId),
      })
    } else {
      setFormData({
        ...formData,
        propertyIds: [...current, propertyId],
      })
    }
  }

  const customerOptions = [
    { value: '', label: 'New Customer' },
    ...customers.map((c) => ({ value: c.id, label: c.customerName })),
  ]

  return (
    <div>
      <Header title="Service Requests" />

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
                  setEditingRequest(null)
                  resetForm()
                  setShowModal(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Service Request
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Service Requests Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : serviceRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <ClipboardList className="w-12 h-12 mb-4" />
                <p>No service requests found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowModal(true)}
                >
                  Create your first service request
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Properties</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Billing</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.requestNumber}
                      </TableCell>
                      <TableCell>{request.requestType}</TableCell>
                      <TableCell>
                        {request.customer?.customerName || request.customerName || '-'}
                      </TableCell>
                      <TableCell>
                        {request.properties.length > 0 ? (
                          <div className="text-sm">
                            {request.properties.slice(0, 2).map((p) => (
                              <div key={p.property.id}>{p.property.name}</div>
                            ))}
                            {request.properties.length > 2 && (
                              <span className="text-gray-500">
                                +{request.properties.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{formatCurrency(request.totalAmount)}</TableCell>
                      <TableCell>
                        <Badge status={request.status} />
                      </TableCell>
                      <TableCell>
                        <Badge status={request.billingStatus} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(request)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(request.id)}
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
          setEditingRequest(null)
          resetForm()
        }}
        title={editingRequest ? 'Edit Service Request' : 'New Service Request'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Existing Customer"
              options={customerOptions}
              value={formData.customerId}
              onChange={(e) => {
                const customer = customers.find((c) => c.id === e.target.value)
                setFormData({
                  ...formData,
                  customerId: e.target.value,
                  customerName: customer?.customerName || '',
                })
              }}
            />
            <Select
              label="Request Type"
              options={requestTypes}
              value={formData.requestType}
              onChange={(e) =>
                setFormData({ ...formData, requestType: e.target.value })
              }
            />
          </div>

          {!formData.customerId && (
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Customer Name"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                required={!formData.customerId}
              />
              <Input
                label="Email"
                type="email"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, customerEmail: e.target.value })
                }
              />
              <Input
                label="Phone"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
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

          {/* Properties Selection */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Select Properties</h4>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {properties.map((property) => (
                <label
                  key={property.id}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border ${
                    formData.propertyIds.includes(property.id)
                      ? 'bg-primary-50 border-primary-500'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.propertyIds.includes(property.id)}
                    onChange={() => toggleProperty(property.id)}
                    className="rounded"
                  />
                  <div>
                    <p className="text-sm font-medium">{property.name}</p>
                    <p className="text-xs text-gray-500">{property.propertyType}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false)
                setEditingRequest(null)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingRequest ? 'Update Request' : 'Create Request'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
