'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  FileBarChart,
  Download,
  TrendingUp,
  Building2,
  Users,
  Receipt,
  Gauge,
} from 'lucide-react'

// Mock data for reports
const revenueByMonth = [
  { month: 'Jan', revenue: 45000, target: 50000 },
  { month: 'Feb', revenue: 52000, target: 50000 },
  { month: 'Mar', revenue: 48000, target: 52000 },
  { month: 'Apr', revenue: 61000, target: 55000 },
  { month: 'May', revenue: 55000, target: 55000 },
  { month: 'Jun', revenue: 67000, target: 60000 },
]

const propertyOccupancy = [
  { name: 'Occupied', value: 75, color: '#22c55e' },
  { name: 'Available', value: 20, color: '#3b82f6' },
  { name: 'Maintenance', value: 5, color: '#f59e0b' },
]

const utilityConsumption = [
  { month: 'Jan', electricity: 12500, water: 8500, gas: 4200 },
  { month: 'Feb', electricity: 11800, water: 8200, gas: 4500 },
  { month: 'Mar', electricity: 13200, water: 9100, gas: 3800 },
  { month: 'Apr', electricity: 14100, water: 9800, gas: 3200 },
  { month: 'May', electricity: 15500, water: 10200, gas: 2800 },
  { month: 'Jun', electricity: 16800, water: 11500, gas: 2500 },
]

const topCustomers = [
  { name: 'Acme Corporation', amount: 15420, properties: 5 },
  { name: 'Tech Solutions Inc', amount: 12850, properties: 3 },
  { name: 'Global Enterprises', amount: 11200, properties: 4 },
  { name: 'Smith Industries', amount: 9800, properties: 2 },
  { name: 'Johnson Holdings', amount: 8500, properties: 2 },
]

const recentPayments = [
  { customer: 'John Doe', invoice: 'INV-001', amount: 1250, date: '2024-01-15', method: 'Bank Transfer' },
  { customer: 'Jane Smith', invoice: 'INV-002', amount: 890, date: '2024-01-14', method: 'Card' },
  { customer: 'Bob Wilson', invoice: 'INV-003', amount: 2100, date: '2024-01-13', method: 'Cash' },
  { customer: 'Alice Brown', invoice: 'INV-004', amount: 1560, date: '2024-01-12', method: 'Bank Transfer' },
]

const reportTypes = [
  { value: 'revenue', label: 'Revenue Report' },
  { value: 'occupancy', label: 'Property Occupancy' },
  { value: 'consumption', label: 'Utility Consumption' },
  { value: 'customers', label: 'Customer Report' },
  { value: 'invoices', label: 'Invoice Summary' },
  { value: 'payments', label: 'Payment Report' },
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('revenue')
  const [dateFrom, setDateFrom] = useState(
    new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  )
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0])

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(328000),
      change: '+12.5%',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Active Properties',
      value: '186',
      change: '+8',
      icon: Building2,
      color: 'text-blue-600',
    },
    {
      title: 'Active Customers',
      value: '1,429',
      change: '+52',
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Pending Invoices',
      value: '32',
      change: '-5',
      icon: Receipt,
      color: 'text-orange-600',
    },
  ]

  return (
    <div>
      <Header title="Reports" />

      <div className="p-6 space-y-6">
        {/* Report Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="w-48">
                <Select
                  label="Report Type"
                  options={reportTypes}
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                />
              </div>
              <Input
                label="From"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-40"
              />
              <Input
                label="To"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-40"
              />
              <Button>Generate Report</Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <p className={`text-sm mt-1 ${stat.color}`}>{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gray-100`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis
                      stroke="#6b7280"
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                    <Bar dataKey="target" fill="#e5e7eb" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Property Occupancy */}
          <Card>
            <CardHeader>
              <CardTitle>Property Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={propertyOccupancy}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {propertyOccupancy.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {propertyOccupancy.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Utility Consumption */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Utility Consumption Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={utilityConsumption}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="electricity"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Electricity (kWh)"
                    />
                    <Line
                      type="monotone"
                      dataKey="water"
                      stroke="#22c55e"
                      strokeWidth={2}
                      name="Water (Gal)"
                    />
                    <Line
                      type="monotone"
                      dataKey="gas"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Gas (cf)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Customers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Customers by Revenue</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Properties
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topCustomers.map((customer, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {customer.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {customer.properties}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {formatCurrency(customer.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Invoice
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Method
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentPayments.map((payment, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {payment.customer}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {payment.invoice}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {payment.method}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {formatCurrency(payment.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
