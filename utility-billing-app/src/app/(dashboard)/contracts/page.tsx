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
import { Plus, FileText, Edit, Trash2 } from 'lucide-react'

interface Contract {
  id: string
  contractNumber: string
  status: string
  startDate: string
  endDate: string
  monthlyRent: number | null
  depositAmount: number | null
  customer: { id: string; customerName: string }
  properties: {
    property: { id: string; name: string; propertyType: string }
  }[]
  _count: { invoices: number }
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
  monthlyRent: number | null
}

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'Active', label: 'Active' },
  { value: 'Expired', label: 'Expired' },
  { value: 'Terminated', label: 'Terminated' },
]

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingContract, setEditingContract] = useState<Contract | null>(null)

  const [formData, setFormData] = useState({
    customerId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active',
    monthlyRent: '',
    depositAmount: '',
    propertyIds: [] as string[],
    termsAndConditions: '',
  })

  useEffect(() => {
    fetchContracts()
    fetchCustomers()
    fetchProperties()
  }, [statusFilter])

  const fetchContracts = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)

      const res = await fetch(`/api/contracts?${params}`)
      const data = await res.json()
      setContracts(data)
    } catch (error) {
      console.error('Error fetching contracts:', error)
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

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/properties')
      const data = await res.json()
      setProperties(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingContract
        ? `/api/contracts/${editingContract.id}`
        : '/api/contracts'
      const method = editingContract ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowModal(false)
        setEditingContract(null)
        resetForm()
        fetchContracts()
        fetchProperties() // Refresh properties to get updated status
      }
    } catch (error) {
      console.error('Error saving contract:', error)
    }
  }

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract)
    setFormData({
      customerId: contract.customer.id,
      startDate: contract.startDate.split('T')[0],
      endDate: contract.endDate.split('T')[0],
      status: contract.status,
      monthlyRent: contract.monthlyRent?.toString() || '',
      depositAmount: contract.depositAmount?.toString() || '',
      propertyIds: contract.properties.map((p) => p.property.id),
      termsAndConditions: '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contract?')) return

    try {
      const res = await fetch(`/api/contracts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchContracts()
        fetchProperties()
      }
    } catch (error) {
      console.error('Error deleting contract:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      customerId: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Active',
      monthlyRent: '',
      depositAmount: '',
      propertyIds: [],
      termsAndConditions: '',
    })
  }

  const toggleProperty = (propertyId: string) => {
    const current = formData.propertyIds
    const property = properties.find((p) => p.id === propertyId)

    if (current.includes(propertyId)) {
      setFormData({
        ...formData,
        propertyIds: current.filter((id) => id !== propertyId),
      })
    } else {
      setFormData({
        ...formData,
        propertyIds: [...current, propertyId],
        monthlyRent: property?.monthlyRent?.toString() || formData.monthlyRent,
      })
    }
  }

  const customerOptions = [
    { value: '', label: 'Select Customer' },
    ...customers.map((c) => ({ value: c.id, label: c.customerName })),
  ]

  // Filter available properties or properties already in this contract
  const availableProperties = properties.filter(
    (p) =>
      p.status === 'Available' ||
      (editingContract &&
        editingContract.properties.some((ep) => ep.property.id === p.id))
  )

  return (
    <div>
      <Header title="Contracts" />

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
                  setEditingContract(null)
                  resetForm()
                  setShowModal(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Contract
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contracts Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : contracts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <FileText className="w-12 h-12 mb-4" />
                <p>No contracts found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowModal(true)}
                >
                  Create your first contract
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Properties</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Monthly Rent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">
                        {contract.contractNumber}
                      </TableCell>
                      <TableCell>{contract.customer.customerName}</TableCell>
                      <TableCell>
                        {contract.properties.length > 0 ? (
                          <div className="text-sm">
                            {contract.properties.slice(0, 2).map((p) => (
                              <div key={p.property.id}>{p.property.name}</div>
                            ))}
                            {contract.properties.length > 2 && (
                              <span className="text-gray-500">
                                +{contract.properties.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{formatDate(contract.startDate)}</TableCell>
                      <TableCell>{formatDate(contract.endDate)}</TableCell>
                      <TableCell>
                        {contract.monthlyRent
                          ? formatCurrency(contract.monthlyRent)
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge status={contract.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(contract)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(contract.id)}
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
          setEditingContract(null)
          resetForm()
        }}
        title={editingContract ? 'Edit Contract' : 'New Contract'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Customer"
              options={customerOptions}
              value={formData.customerId}
              onChange={(e) =>
                setFormData({ ...formData, customerId: e.target.value })
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

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              required
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Monthly Rent"
              type="number"
              step="0.01"
              value={formData.monthlyRent}
              onChange={(e) =>
                setFormData({ ...formData, monthlyRent: e.target.value })
              }
            />
            <Input
              label="Deposit Amount"
              type="number"
              step="0.01"
              value={formData.depositAmount}
              onChange={(e) =>
                setFormData({ ...formData, depositAmount: e.target.value })
              }
            />
          </div>

          {/* Properties Selection */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Select Properties</h4>
            {availableProperties.length === 0 ? (
              <p className="text-gray-500 text-sm">No available properties</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {availableProperties.map((property) => (
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
                      <p className="text-xs text-gray-500">
                        {property.propertyType}
                        {property.monthlyRent &&
                          ` - ${formatCurrency(property.monthlyRent)}/mo`}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Terms and Conditions
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              value={formData.termsAndConditions}
              onChange={(e) =>
                setFormData({ ...formData, termsAndConditions: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false)
                setEditingContract(null)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingContract ? 'Update Contract' : 'Create Contract'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
