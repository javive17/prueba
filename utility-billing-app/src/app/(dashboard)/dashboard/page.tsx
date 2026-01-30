'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  Building2,
  Users,
  Receipt,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

// Mock data for the dashboard
const stats = [
  {
    name: 'Total Properties',
    value: '248',
    change: '+12%',
    trend: 'up',
    icon: Building2,
    color: 'bg-blue-500',
  },
  {
    name: 'Active Customers',
    value: '1,429',
    change: '+8%',
    trend: 'up',
    icon: Users,
    color: 'bg-green-500',
  },
  {
    name: 'Monthly Revenue',
    value: '$84,250',
    change: '+15%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-purple-500',
  },
  {
    name: 'Pending Invoices',
    value: '32',
    change: '-5%',
    trend: 'down',
    icon: Receipt,
    color: 'bg-orange-500',
  },
]

const revenueData = [
  { month: 'Jan', revenue: 65000, bills: 450 },
  { month: 'Feb', revenue: 68000, bills: 480 },
  { month: 'Mar', revenue: 72000, bills: 510 },
  { month: 'Apr', revenue: 75000, bills: 530 },
  { month: 'May', revenue: 78000, bills: 560 },
  { month: 'Jun', revenue: 84250, bills: 590 },
]

const utilityBreakdown = [
  { name: 'Electricity', value: 45, color: '#3b82f6' },
  { name: 'Water', value: 30, color: '#22c55e' },
  { name: 'Gas', value: 15, color: '#f59e0b' },
  { name: 'Other', value: 10, color: '#8b5cf6' },
]

const recentInvoices = [
  { id: 'INV-001', customer: 'John Doe', amount: 245.50, status: 'Paid', date: '2024-01-15' },
  { id: 'INV-002', customer: 'Jane Smith', amount: 189.00, status: 'Pending', date: '2024-01-14' },
  { id: 'INV-003', customer: 'Bob Wilson', amount: 312.75, status: 'Overdue', date: '2024-01-10' },
  { id: 'INV-004', customer: 'Alice Brown', amount: 156.25, status: 'Paid', date: '2024-01-13' },
  { id: 'INV-005', customer: 'Charlie Davis', amount: 278.00, status: 'Pending', date: '2024-01-12' },
]

const alerts = [
  { type: 'warning', message: '15 invoices are overdue by more than 30 days' },
  { type: 'info', message: '8 meter readings pending for this month' },
  { type: 'success', message: 'Payment collection rate improved by 5% this month' },
]

export default function DashboardPage() {
  return (
    <div>
      <Header title="Dashboard" />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Utility Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Utility Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={utilityBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {utilityBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {utilityBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {recentInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{invoice.id}</p>
                      <p className="text-sm text-gray-500">{invoice.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(invoice.amount)}
                      </p>
                      <Badge status={invoice.status}>{invoice.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts & Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Alerts & Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-lg ${
                    alert.type === 'warning'
                      ? 'bg-yellow-50'
                      : alert.type === 'success'
                      ? 'bg-green-50'
                      : 'bg-blue-50'
                  }`}
                >
                  <AlertCircle
                    className={`w-5 h-5 mt-0.5 ${
                      alert.type === 'warning'
                        ? 'text-yellow-600'
                        : alert.type === 'success'
                        ? 'text-green-600'
                        : 'text-blue-600'
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      alert.type === 'warning'
                        ? 'text-yellow-800'
                        : alert.type === 'success'
                        ? 'text-green-800'
                        : 'text-blue-800'
                    }`}
                  >
                    {alert.message}
                  </p>
                </div>
              ))}

              {/* Quick Stats */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">This Month</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">156</p>
                    <p className="text-sm text-gray-500">Meter Readings</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">92%</p>
                    <p className="text-sm text-gray-500">Collection Rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
