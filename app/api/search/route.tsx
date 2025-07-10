import { NextRequest, NextResponse } from 'next/server'
import { handbookProcessor } from '@/lib/ai-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const category = searchParams.get('category') || ''
    const limit = parseInt(searchParams.get('limit') || '5', 10)

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      )
    }

    // Validate limit
    if (limit < 1 || limit > 20) {
      return NextResponse.json(
        { error: "Limit must be between 1 and 20" },
        { status: 400 }
      )
    }

    console.log('Search request:', { query, category, limit })

    // Search handbook content
    const results = handbookProcessor.searchContent(query, limit)

    // Filter by category if specified
    const filteredResults = category 
      ? results.filter(result => 
          result.section.toLowerCase().includes(category.toLowerCase())
        )
      : results

    return NextResponse.json({
      query,
      category,
      results: filteredResults,
      total: filteredResults.length,
      timestamp: new Date().toISOString(),
      success: true
    })

  } catch (error) {
    console.error('Search error:', error)
    
    return NextResponse.json(
      {
        error: 'Search failed',
        message: 'Unable to search handbook content',
        timestamp: new Date().toISOString(),
        success: false
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, category = '', limit = 5 } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: "Query is required and must be a string" },
        { status: 400 }
      )
    }

    console.log('POST Search request:', { query, category, limit })

    // Search handbook content
    const results = handbookProcessor.searchContent(query.trim(), limit)

    // Filter by category if specified
    const filteredResults = category 
      ? results.filter(result => 
          result.section.toLowerCase().includes(category.toLowerCase())
        )
      : results

    return NextResponse.json({
      query: query.trim(),
      category,
      results: filteredResults,
      total: filteredResults.length,
      timestamp: new Date().toISOString(),
      success: true
    })

  } catch (error) {
    console.error('POST Search error:', error)
    
    return NextResponse.json(
      {
        error: 'Search failed',
        message: 'Unable to search handbook content',
        timestamp: new Date().toISOString(),
        success: false
      },
      { status: 500 }
    )
  }
}
