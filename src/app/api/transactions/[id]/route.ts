import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { transactionSchema } from '@/lib/validations'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = transactionSchema.parse(body)
    
    const transaction = await prisma.transaction.update({
      where: { id: params.id },
      data: validatedData
    })
    
    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error updating transaction:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid transaction data' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.transaction.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    )
  }
} 