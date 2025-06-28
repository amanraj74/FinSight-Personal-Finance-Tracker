import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { transactionSchema } from '@/lib/validations'

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        date: 'desc'
      }
    })
    
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = transactionSchema.parse(body)
    
    const transaction = await prisma.transaction.create({
      data: validatedData
    })
    
    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid transaction data' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
} 