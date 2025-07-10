'use client'

const MinimalHomepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-700 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Simple header to test visibility */}
        <div className="bg-white rounded-2xl p-8 mb-8 text-center shadow-xl">
          <h1 className="text-blue-900 text-4xl font-bold mb-4">
            澳門旅遊大學
          </h1>
          <h2 className="text-blue-600 text-2xl mb-4">
            學士學位課程手冊（中文學制）
          </h2>
          <div className="bg-orange-500 text-white px-6 py-3 rounded-full inline-block">
            2024/2025
          </div>
        </div>

        {/* Simple test content */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h3 className="text-gray-800 text-xl font-bold mb-4">Test Content</h3>
          <p className="text-gray-600">
            If you can see this text, the basic component is working. 
            The issue might be with imported components or CSS conflicts.
          </p>
        </div>
      </div>
    </div>
  )
}

export default MinimalHomepage