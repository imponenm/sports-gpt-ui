import Link from 'next/link'

export function MainFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-gray-600">© {new Date().getFullYear()} Sports GPT. All rights reserved.</span>
          </div>
          
          <nav className="flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="mailto:support@gptforsports.com" className="text-gray-600 hover:text-blue-600 transition-colors">
              Support
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
              Privacy
            </Link>
            <Link href="/tos" className="text-gray-600 hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
} 