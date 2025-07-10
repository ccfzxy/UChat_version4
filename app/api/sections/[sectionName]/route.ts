import { NextRequest, NextResponse } from 'next/server'
import { handbookProcessor } from '@/lib/ai-service'

interface RouteParams {
  params: {
    sectionName: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { sectionName } = params

    if (!sectionName) {
      return NextResponse.json(
        { error: 'Section name is required' },
        { status: 400 }
      )
    }

    console.log('Section detail request:', { sectionName })

    // Get section content
    const content = handbookProcessor.getSectionContent(decodeURIComponent(sectionName))

    if (!content) {
      return NextResponse.json(
        { 
          error: 'Section not found',
          message: `Section "${sectionName}" does not exist`,
          available_sections: handbookProcessor.getAllSections()
        },
        { status: 404 }
      )
    }

    // Find the exact section name for response
    const sections = handbookProcessor.getAllSections()
    const exactSectionName = sections.find(section => 
      section.toLowerCase().includes(sectionName.toLowerCase())
    ) || sectionName

    return NextResponse.json({
      section: exactSectionName,
      content,
      total_items: content.length,
      timestamp: new Date().toISOString(),
      success: true
    })

  } catch (error) {
    console.error('Section detail error:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to get section content',
        message: 'Unable to retrieve section content',
        timestamp: new Date().toISOString(),
        success: false
      },
      { status: 500 }
    )
  }
}
