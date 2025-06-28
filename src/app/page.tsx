'use client'

import { useState, useEffect } from 'react'
import { TransactionForm } from '@/components/transaction-form'
import { TransactionList } from '@/components/transaction-list'
import { MonthlyChart } from '@/components/monthly-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/transactions')
      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }
      const data = await response.json()
      setTransactions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleTransactionAdded = () => {
    fetchTransactions()
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-2">FinSight</h1>
        <p className="text-center text-muted-foreground">
          Personal Finance Tracker
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Add Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionForm onTransactionAdded={handleTransactionAdded} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyChart transactions={transactions} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionList 
            transactions={transactions} 
            onTransactionUpdated={handleTransactionAdded}
            onTransactionDeleted={handleTransactionAdded}
          />
        </CardContent>
      </Card>
    </div>
  )
} 