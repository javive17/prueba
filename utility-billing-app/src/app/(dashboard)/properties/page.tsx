'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Modal } from '@/components/ui/modal'
import { formatCurrency } from '@/lib/utils'
import { Plus, Search, Building2, Edit, Trash2, Eye } from 'lucide-react'

interface Property {
  id: string
  name: string
  propertyType: string
  address: string | null
  area: number | null
  areaUnit: string | null
  unitType: string | null
  status: string
  monthlyRent: number | null
  depositAmount: number | null
  parent: { id: string; name: string } | null
  children: any[]
  _count: {
    customers: number
    contracts: number
  }
}

const propertyTypes = [
  { value: '', label: 'All Types' },
  { value: 'Project', label: 'Project' },
  { value: 'Building', label: 'Building' },
  { value: 'Floor', label: 'Floor' },
  { value: 'Unit', label: 'Unit' },
]

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'Available', label: 'Available' },
  { value: 'Occupied', label: 'Occupied' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Reserved', label: 'Reserved' },
]

const unitTypes = [
  { value: '', label: 'Select Unit Type' },
  { value: 'Studio', label: 'Studio' },
  { value: '1BR', label: '1 Bedroom' },
  { value: '2BR', label: '2 Bedroom' },
  { value: '3BR', label: '3 Bedroom' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Office', label: 'Office' },
]

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    propertyType: 'Unit',
    parentId: '',
    address: '',
    area: '',
    areaUnit: 'sqft',
    unitType: '',
    status: 'Available',
    monthlyRent: '',
    depositAmount: '',
  })

  useEffect(() => {
    fetchProperties()
  }, [typeFilter, statusFilter])

  const fetchProperties = async () => {
    try {
      const params = new URLSearchParams()
      if (typeFilter) params.set('type', typeFilter)
      if (statusFilter) params.set('status', statusFilter)
      if (search) params.set('search', search)

      const res = await fetch(`/api/properties?${params}`)
      const data = await res.json()
      setProperties(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProperties()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingProperty
        ? `/api/properties/${editingProperty.id}`
        : '/api/properties'
      const method = editingProperty ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowModal(false)
        setEditingProperty(null)
        resetForm()
        fetchProperties()
      }
    } catch (error) {
      console.error('Error saving property:', error)
    }
  }

  const handleEdit = (property: Property) => {
    setEditingProperty(property)
    setFormData({
      name: property.name,
      propertyType: property.propertyType,
      parentId: property.parent?.id || '',
      address: property.address || '',
      area: property.area?.toString() || '',
      areaUnit: property.areaUnit || 'sqft',
      unitType: property.unitType || '',
      status: property.status,
      monthlyRent: property.monthlyRent?.toString() || '',
      depositAmount: property.depositAmount?.toString() || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchProperties()
      }
    } catch (error) {
      console.error('Error deleting property:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      propertyType: 'Unit',
      parentId: '',
      address: '',
      area: '',
      areaUnit: 'sqft',
      unitType: '',
      status: 'Available',
      monthlyRent: '',
      depositAmount: '',
    })
  }

  const parentOptions = [
    { value: '', label: 'No Parent' },
    ...properties
      .filter((p) => p.propertyType !== 'Unit')
      .map((p) => ({ value: p.id, label: `${p.name} (${p.propertyType})` })),
  ]

  return (
    <div>
      <Header title="Properties" />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-end">
              <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search properties..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>

              <div className="w-40">
                <Select
                  options={propertyTypes}
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                />
              </div>

              <div className="w-40">
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
              </div>

              <Button
                onClick={() => {
                  setEditingProperty(null)
                  resetForm()
                  setShowModal(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Properties Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Building2 className="w-12 h-12 mb-4" />
                <p>No properties found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowModal(true)}
                >
                  Add your first property
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Unit Type</TableHead>
                    <TableHead>Rent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tenants</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{property.name}</p>
                          {property.parent && (
                            <p className="text-xs text-gray-500">
                              {property.parent.name}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{property.propertyType}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {property.address || '-'}
                      </TableCell>
                      <TableCell>{property.unitType || '-'}</TableCell>
                      <TableCell>
                        {property.monthlyRent
                          ? formatCurrency(property.monthlyRent)
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge status={property.status} />
                      </TableCell>
                      <TableCell>{property._count.customers}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/properties/${property.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(property)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(property.id)}
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
          setEditingProperty(null)
          resetForm()
        }}
        title={editingProperty ? 'Edit Property' : 'Add Property'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Property Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Select
              label="Property Type"
              options={propertyTypes.slice(1)}
              value={formData.propertyType}
              onChange={(e) =>
                setFormData({ ...formData, propertyType: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Parent Property"
              options={parentOptions}
              value={formData.parentId}
              onChange={(e) =>
                setFormData({ ...formData, parentId: e.target.value })
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

          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Area"
              type="number"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            />
            <Select
              label="Area Unit"
              options={[
                { value: 'sqft', label: 'Sq Ft' },
                { value: 'sqm', label: 'Sq M' },
              ]}
              value={formData.areaUnit}
              onChange={(e) =>
                setFormData({ ...formData, areaUnit: e.target.value })
              }
            />
            <Select
              label="Unit Type"
              options={unitTypes}
              value={formData.unitType}
              onChange={(e) =>
                setFormData({ ...formData, unitType: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Monthly Rent"
              type="number"
              value={formData.monthlyRent}
              onChange={(e) =>
                setFormData({ ...formData, monthlyRent: e.target.value })
              }
            />
            <Input
              label="Deposit Amount"
              type="number"
              value={formData.depositAmount}
              onChange={(e) =>
                setFormData({ ...formData, depositAmount: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false)
                setEditingProperty(null)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingProperty ? 'Update Property' : 'Create Property'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
