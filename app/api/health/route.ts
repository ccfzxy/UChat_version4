import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Check if the external API service is available
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:5200'
    
    let externalApiStatus = 'unknown'
    
    try {
      const response = await fetch(`${apiBaseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })
      
      externalApiStatus = response.ok ? 'online' : 'offline'
    } catch (error) {
      externalApiStatus = 'offline'
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || '2024/2025',
      services: {
        nextjs: 'online',
        externalApi: externalApiStatus,
        apiUrl: apiBaseUrl
      },
      environment: process.env.NODE_ENV || 'development'
    })

  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        services: {
          nextjs: 'error',
          externalApi: 'unknown'
        }
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return POST(request)
}