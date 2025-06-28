'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Transaction {
  id: string
  amount: number
  description: string
  date: string
  type: 'INCOME' | 'EXPENSE'
  category?: string
}

interface MonthlyChartProps {
  transactions: Transaction[]
}

export function MonthlyChart({ transactions }: MonthlyChartProps) {
  const chartData = useMemo(() => {
    const monthlyData: Record<string, { month: string; expenses: number; income: number }> = {}
    
    // Get current year
    const currentYear = new Date().getFullYear()
    
    // Initialize all months for current year
    for (let month = 0; month < 12; month++) {
      const date = new Date(currentYear, month, 1)
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' })
      monthlyData[monthKey] = {
        month: monthKey,
        expenses: 0,
        income: 0
      }
    }
    
    // Process transactions
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date)
      const transactionYear = transactionDate.getFullYear()
      
      // Only include transactions from current year
      if (transactionYear === currentYear) {
        const monthKey = transactionDate.toLocaleDateString('en-US', { month: 'short' })
        
        if (transaction.type === 'EXPENSE') {
          monthlyData[monthKey].expenses += transaction.amount
        } else {
          monthlyData[monthKey].income += transaction.amount
        }
      }
    })
    
    // Convert to array and sort by month order
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    return monthOrder.map(month => monthlyData[month])
  }, [transactions])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No data to display. Add some transactions to see the chart!</p>
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="expenses" 
            fill="#ef4444" 
            name="Expenses"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="income" 
            fill="#22c55e" 
            name="Income"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 