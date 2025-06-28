'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TransactionFormData } from '@/lib/validations'

interface TransactionFormProps {
  onTransactionAdded: () => void
}

export function TransactionForm({ onTransactionAdded }: TransactionFormProps) {
  const [formData, setFormData] = useState<Partial<TransactionFormData>>({
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'EXPENSE'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date!),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create transaction')
      }

      // Reset form
      setFormData({
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: 'EXPENSE'
      })
      setErrors({})
      onTransactionAdded()
    } catch (error) {
      console.error('Error creating transaction:', error)
      setErrors({ submit: 'Failed to create transaction' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount || ''}
            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className={errors.amount ? 'border-red-500' : ''}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleInputChange('type', value)}
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
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter description"
          className={errors.description ? 'border-red-500' : ''}
          maxLength={255}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date || ''}
          onChange={(e) => handleInputChange('date', e.target.value)}
          className={errors.date ? 'border-red-500' : ''}
        />
        {errors.date && (
          <p className="text-sm text-red-500">{errors.date}</p>
        )}
      </div>

      {errors.submit && (
        <p className="text-sm text-red-500">{errors.submit}</p>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Adding...' : 'Add Transaction'}
      </Button>
    </form>
  )
} 