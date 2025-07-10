import { NextRequest, NextResponse } from 'next/server'
import { handbookProcessor } from '@/lib/ai-service'

export async function GET(request: NextRequest) {
  try {
    console.log('Sections request received')

    // Get all available handbook sections
    const sections = handbookProcessor.getAllSections()

    return NextResponse.json({
      sections,
      total: sections.length,
      timestamp: new Date().toISOString(),
      success: true
    })

  } catch (error) {
    console.error('Sections error:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to get sections',
        message: 'Unable to retrieve handbook sections',
        timestamp: new Date().toISOString(),
        success: false
      },
      { status: 500 }
    )
  }
}
