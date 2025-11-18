export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Welcome to NextAuth Admin, a modern and secure admin dashboard solution 
              built with the latest web technologies.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              We strive to provide developers with a robust, scalable, and easy-to-use 
              admin dashboard template that can be quickly customized and deployed for 
              various business needs.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technology Stack</h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Next.js 15 - React framework with App Router</li>
              <li>NextAuth.js - Complete authentication solution</li>
              <li>TypeScript - Type-safe development</li>
              <li>Tailwind CSS - Utility-first CSS framework</li>
              <li>PostgreSQL - Robust database solution</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Features</h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Secure authentication with multiple providers</li>
              <li>User management and authorization</li>
              <li>Responsive design for all devices</li>
              <li>Clean and modern interface</li>
              <li>Production-ready setup</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}