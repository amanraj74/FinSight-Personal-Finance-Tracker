'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Edit, Trash2, X, Check } from 'lucide-react'
import { TransactionFormData } from '@/lib/validations'

interface Transaction {
  id: string
  amount: number
  description: string
  date: string
  type: 'INCOME' | 'EXPENSE'
  category?: string
}

interface TransactionListProps {
  transactions: Transaction[]
  onTransactionUpdated: () => void
  onTransactionDeleted: () => void
}

export function TransactionList({ 
  transactions, 
  onTransactionUpdated, 
  onTransactionDeleted 
}: TransactionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<TransactionFormData>>({})
  const [loading, setLoading] = useState(false)

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id)
    setEditData({
      amount: transaction.amount,
      description: transaction.description,
      date: new Date(transaction.date).toISOString().split('T')[0],
      type: transaction.type
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleSaveEdit = async () => {
    if (!editingId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/transactions/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editData,
          date: new Date(editData.date!),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update transaction')
      }

      setEditingId(null)
      setEditData({})
      onTransactionUpdated()
    } catch (error) {
      console.error('Error updating transaction:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete transaction')
      }

      onTransactionDeleted()
    } catch (error) {
      console.error('Error deleting transaction:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No transactions yet. Add your first transaction above!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id}>
          <CardContent className="p-4">
            {editingId === transaction.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`amount-${transaction.id}`}>Amount</Label>
                    <Input
                      id={`amount-${transaction.id}`}
                      type="number"
                      step="0.01"
                      value={editData.amount || ''}
                      onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        amount: parseFloat(e.target.value) || 0 
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`type-${transaction.id}`}>Type</Label>
                    <Select
                      value={editData.type}
                      onValueChange={(value) => setEditData(prev => ({ 
                        ...prev, 
                        type: value as 'INCOME' | 'EXPENSE' 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EXPENSE">Expense</SelectItem>
                        <SelectItem value="INCOME">Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`description-${transaction.id}`}>Description</Label>
                  <Input
                    id={`description-${transaction.id}`}
                    value={editData.description || ''}
                    onChange={(e) => setEditData(prev => ({ 
                      ...prev, 
                      description: e.target.value 
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`date-${transaction.id}`}>Date</Label>
                  <Input
                    id={`date-${transaction.id}`}
                    type="date"
                    value={editData.date || ''}
                    onChange={(e) => setEditData(prev => ({ 
                      ...prev, 
                      date: e.target.value 
                    }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleSaveEdit} 
                    disabled={loading}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{transaction.description}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      transaction.type === 'EXPENSE' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(transaction.date)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${
                    transaction.type === 'EXPENSE' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.type === 'EXPENSE' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(transaction)}
                    disabled={loading}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(transaction.id)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 