export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">FlowLink Test</h1>
        <p className="text-xl mb-8">If you can see this, the app is working!</p>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
          <p className="text-lg">✅ Next.js is running</p>
          <p className="text-lg">✅ Tailwind CSS is working</p>
          <p className="text-lg">✅ React components are rendering</p>
        </div>
      </div>
    </div>
  )
}
