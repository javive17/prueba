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
import { Plus, Search, Receipt, Edit, Trash2, Eye, Send, CreditCard } from 'lucide-react'

interface Invoice {
  id: string
  invoiceNumber: string
  invoiceType: string
  invoiceDate: string
  dueDate: string
  status: string
  subtotal: number
  taxAmount: number
  totalAmount: number
  paidAmount: number
  customer: { id: string; customerName: string }
  contract: { id: string; contractNumber: string } | null
  items: {
    id: string
    description: string
    quantity: number
    rate: number
    amount: number
  }[]
  _count: { payments: number }
}

interface Customer {
  id: string
  customerName: string
}

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Submitted', label: 'Submitted' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Overdue', label: 'Overdue' },
  { value: 'Cancelled', label: 'Cancelled' },
]

const invoiceTypes = [
  { value: 'Standard', label: 'Standard' },
  { value: 'Penalty', label: 'Penalty' },
  { value: 'Adjustment', label: 'Adjustment' },
]

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)

  const [formData, setFormData] = useState({
    customerId: '',
    invoiceType: 'Standard',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Draft',
    taxRate: '0',
    items: [{ description: '', quantity: '1', rate: '' }],
  })

  useEffect(() => {
    fetchInvoices()
    fetchCustomers()
  }, [statusFilter])

  const fetchInvoices = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)

      const res = await fetch(`/api/invoices?${params}`)
      const data = await res.json()
      setInvoices(data)
    } catch (error) {
      console.error('Error fetching invoices:', error)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingInvoice
        ? `/api/invoices/${editingInvoice.id}`
        : '/api/invoices'
      const method = editingInvoice ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowModal(false)
        setEditingInvoice(null)
        resetForm()
        fetchInvoices()
      }
    } catch (error) {
      console.error('Error saving invoice:', error)
    }
  }

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setFormData({
      customerId: invoice.customer.id,
      invoiceType: invoice.invoiceType,
      invoiceDate: invoice.invoiceDate.split('T')[0],
      dueDate: invoice.dueDate.split('T')[0],
      status: invoice.status,
      taxRate: ((invoice.taxAmount / invoice.subtotal) * 100).toString() || '0',
      items: invoice.items.map((item) => ({
        description: item.description,
        quantity: item.quantity.toString(),
        rate: item.rate.toString(),
      })),
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return

    try {
      const res = await fetch(`/api/invoices/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchInvoices()
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      customerId: '',
      invoiceType: 'Standard',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Draft',
      taxRate: '0',
      items: [{ description: '', quantity: '1', rate: '' }],
    })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: '1', rate: '' }],
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
    setFormData({ ...formData, items: newItems })
  }

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => {
      return sum + parseFloat(item.quantity || '0') * parseFloat(item.rate || '0')
    }, 0)
  }

  const customerOptions = [
    { value: '', label: 'Select Customer' },
    ...customers.map((c) => ({ value: c.id, label: c.customerName })),
  ]

  return (
    <div>
      <Header title="Invoices" />

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
                  setEditingInvoice(null)
                  resetForm()
                  setShowModal(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Invoice
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : invoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Receipt className="w-12 h-12 mb-4" />
                <p>No invoices found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowModal(true)}
                >
                  Create your first invoice
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                      <TableCell>{invoice.customer.customerName}</TableCell>
                      <TableCell>{invoice.invoiceType}</TableCell>
                      <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                      <TableCell>{formatCurrency(invoice.paidAmount)}</TableCell>
                      <TableCell>
                        {formatCurrency(invoice.totalAmount - invoice.paidAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge status={invoice.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(invoice)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(invoice.id)}
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
          setEditingInvoice(null)
          resetForm()
        }}
        title={editingInvoice ? 'Edit Invoice' : 'New Invoice'}
        size="xl"
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
              label="Invoice Type"
              options={invoiceTypes}
              value={formData.invoiceType}
              onChange={(e) =>
                setFormData({ ...formData, invoiceType: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Invoice Date"
              type="date"
              value={formData.invoiceDate}
              onChange={(e) =>
                setFormData({ ...formData, invoiceDate: e.target.value })
              }
              required
            />
            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
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
              <h4 className="font-medium">Invoice Items</h4>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="col-span-2">
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(index, 'description', e.target.value)
                      }
                      required
                    />
                  </div>
                  <Input
                    placeholder="Qty"
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, 'quantity', e.target.value)
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
                    <span className="text-sm text-gray-600">
                      {formatCurrency(
                        parseFloat(item.quantity || '0') *
                          parseFloat(item.rate || '0')
                      )}
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

            {/* Totals */}
            <div className="mt-4 pt-4 border-t space-y-2 text-right">
              <div className="flex justify-end gap-4">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium w-24">
                  {formatCurrency(calculateSubtotal())}
                </span>
              </div>
              <div className="flex justify-end items-center gap-4">
                <span className="text-gray-600">Tax Rate (%):</span>
                <Input
                  type="number"
                  step="0.01"
                  className="w-24"
                  value={formData.taxRate}
                  onChange={(e) =>
                    setFormData({ ...formData, taxRate: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-4 text-lg font-bold">
                <span>Total:</span>
                <span className="w-24">
                  {formatCurrency(
                    calculateSubtotal() *
                      (1 + parseFloat(formData.taxRate || '0') / 100)
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false)
                setEditingInvoice(null)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
