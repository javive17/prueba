'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  Building2,
  CreditCard,
  Bell,
  Shield,
  Users,
  Zap,
  Save,
  Plus,
  Trash2,
} from 'lucide-react'

export default function SettingsPage() {
  const [companySettings, setCompanySettings] = useState({
    companyName: 'Utility Billing Co.',
    companyAddress: '123 Main Street, City, State 12345',
    companyPhone: '+1 (555) 123-4567',
    companyEmail: 'info@utilitybilling.com',
    defaultCurrency: 'USD',
    taxRate: '10',
  })

  const [billingSettings, setBillingSettings] = useState({
    paymentTermsDays: '30',
    requireDeposit: true,
    requireSiteSurvey: false,
    autoGenerateInvoice: true,
    lateFeePercentage: '5',
    gracePeriodDays: '7',
  })

  const [utilityItems, setUtilityItems] = useState([
    { id: '1', itemCode: 'ELEC-001', itemName: 'Electricity', unit: 'kWh', baseRate: '0.12' },
    { id: '2', itemCode: 'WATER-001', itemName: 'Water', unit: 'Gallons', baseRate: '0.005' },
    { id: '3', itemCode: 'GAS-001', itemName: 'Natural Gas', unit: 'Cubic Feet', baseRate: '0.02' },
    { id: '4', itemCode: 'TRASH-001', itemName: 'Trash Collection', unit: 'Month', baseRate: '25.00' },
  ])

  const [newUtility, setNewUtility] = useState({
    itemCode: '',
    itemName: '',
    unit: '',
    baseRate: '',
  })

  const handleSaveCompany = () => {
    // Save company settings
    alert('Company settings saved successfully!')
  }

  const handleSaveBilling = () => {
    // Save billing settings
    alert('Billing settings saved successfully!')
  }

  const handleAddUtility = () => {
    if (newUtility.itemCode && newUtility.itemName && newUtility.unit && newUtility.baseRate) {
      setUtilityItems([
        ...utilityItems,
        { ...newUtility, id: Date.now().toString() },
      ])
      setNewUtility({ itemCode: '', itemName: '', unit: '', baseRate: '' })
    }
  }

  const handleDeleteUtility = (id: string) => {
    setUtilityItems(utilityItems.filter((item) => item.id !== id))
  }

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'CAD', label: 'Canadian Dollar (CAD)' },
    { value: 'AUD', label: 'Australian Dollar (AUD)' },
  ]

  return (
    <div>
      <Header title="Settings" />

      <div className="p-6 space-y-6">
        {/* Company Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary-600" />
              <CardTitle>Company Information</CardTitle>
            </div>
            <CardDescription>
              Manage your company details and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Company Name"
                value={companySettings.companyName}
                onChange={(e) =>
                  setCompanySettings({
                    ...companySettings,
                    companyName: e.target.value,
                  })
                }
              />
              <Input
                label="Email"
                type="email"
                value={companySettings.companyEmail}
                onChange={(e) =>
                  setCompanySettings({
                    ...companySettings,
                    companyEmail: e.target.value,
                  })
                }
              />
            </div>
            <Input
              label="Address"
              value={companySettings.companyAddress}
              onChange={(e) =>
                setCompanySettings({
                  ...companySettings,
                  companyAddress: e.target.value,
                })
              }
            />
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Phone"
                value={companySettings.companyPhone}
                onChange={(e) =>
                  setCompanySettings({
                    ...companySettings,
                    companyPhone: e.target.value,
                  })
                }
              />
              <Select
                label="Default Currency"
                options={currencyOptions}
                value={companySettings.defaultCurrency}
                onChange={(e) =>
                  setCompanySettings({
                    ...companySettings,
                    defaultCurrency: e.target.value,
                  })
                }
              />
              <Input
                label="Tax Rate (%)"
                type="number"
                step="0.01"
                value={companySettings.taxRate}
                onChange={(e) =>
                  setCompanySettings({
                    ...companySettings,
                    taxRate: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveCompany}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Billing Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-600" />
              <CardTitle>Billing Configuration</CardTitle>
            </div>
            <CardDescription>
              Configure billing rules and payment terms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Payment Terms (Days)"
                type="number"
                value={billingSettings.paymentTermsDays}
                onChange={(e) =>
                  setBillingSettings({
                    ...billingSettings,
                    paymentTermsDays: e.target.value,
                  })
                }
              />
              <Input
                label="Late Fee (%)"
                type="number"
                step="0.01"
                value={billingSettings.lateFeePercentage}
                onChange={(e) =>
                  setBillingSettings({
                    ...billingSettings,
                    lateFeePercentage: e.target.value,
                  })
                }
              />
              <Input
                label="Grace Period (Days)"
                type="number"
                value={billingSettings.gracePeriodDays}
                onChange={(e) =>
                  setBillingSettings({
                    ...billingSettings,
                    gracePeriodDays: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={billingSettings.requireDeposit}
                  onChange={(e) =>
                    setBillingSettings({
                      ...billingSettings,
                      requireDeposit: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <div>
                  <p className="font-medium">Require Deposit</p>
                  <p className="text-sm text-gray-500">
                    Require security deposit for new contracts
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={billingSettings.requireSiteSurvey}
                  onChange={(e) =>
                    setBillingSettings({
                      ...billingSettings,
                      requireSiteSurvey: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <div>
                  <p className="font-medium">Require Site Survey</p>
                  <p className="text-sm text-gray-500">
                    Require site survey before service activation
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={billingSettings.autoGenerateInvoice}
                  onChange={(e) =>
                    setBillingSettings({
                      ...billingSettings,
                      autoGenerateInvoice: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <div>
                  <p className="font-medium">Auto-generate Invoices</p>
                  <p className="text-sm text-gray-500">
                    Automatically create invoices from meter readings
                  </p>
                </div>
              </label>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveBilling}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Utility Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary-600" />
              <CardTitle>Utility Items</CardTitle>
            </div>
            <CardDescription>
              Configure utility types and their base rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Unit
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Base Rate
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {utilityItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono">
                        {item.itemCode}
                      </td>
                      <td className="px-4 py-3 text-sm">{item.itemName}</td>
                      <td className="px-4 py-3 text-sm">{item.unit}</td>
                      <td className="px-4 py-3 text-sm">${item.baseRate}</td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUtility(item.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {/* Add New Row */}
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3">
                      <Input
                        placeholder="Code"
                        value={newUtility.itemCode}
                        onChange={(e) =>
                          setNewUtility({ ...newUtility, itemCode: e.target.value })
                        }
                        className="text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        placeholder="Name"
                        value={newUtility.itemName}
                        onChange={(e) =>
                          setNewUtility({ ...newUtility, itemName: e.target.value })
                        }
                        className="text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        placeholder="Unit"
                        value={newUtility.unit}
                        onChange={(e) =>
                          setNewUtility({ ...newUtility, unit: e.target.value })
                        }
                        className="text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        placeholder="Rate"
                        type="number"
                        step="0.001"
                        value={newUtility.baseRate}
                        onChange={(e) =>
                          setNewUtility({ ...newUtility, baseRate: e.target.value })
                        }
                        className="text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" onClick={handleAddUtility}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-600" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure email and system notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <p className="font-medium">Invoice Created</p>
                  <p className="text-sm text-gray-500">
                    Send email when new invoice is created
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-gray-300"
                />
              </label>
              <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <p className="font-medium">Payment Received</p>
                  <p className="text-sm text-gray-500">
                    Send confirmation when payment is received
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-gray-300"
                />
              </label>
              <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <p className="font-medium">Payment Overdue</p>
                  <p className="text-sm text-gray-500">
                    Send reminder when payment is overdue
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-gray-300"
                />
              </label>
              <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <p className="font-medium">Contract Expiring</p>
                  <p className="text-sm text-gray-500">
                    Send alert 30 days before contract expires
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-gray-300"
                />
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
