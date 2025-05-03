import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold gradient-text">SME.AI</h1>
            <span className="bg-blue-100 text-primary-blue text-xs px-2 py-1 rounded-full font-medium">Beta</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="#industries" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Industries
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="bg-gradient-primary text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero section */}
        <section className="relative pt-16 pb-24 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
                Subject Matter Expertise, Powered by AI
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
                The specialized AI assistant for industrial professionals. Access expert knowledge, organize projects, and generate professional documents for your engineering needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/signup" 
                  className="btn-primary w-full sm:w-auto px-8 py-3"
                >
                  Start for Free
                </Link>
                <Link 
                  href="/demo" 
                  className="btn-outline w-full sm:w-auto px-8 py-3"
                >
                  See the Demo
                </Link>
              </div>
            </div>

            {/* App screenshot */}
            <div className="relative mx-auto max-w-5xl">
              <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-lg p-1">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
                  <Image 
                    src="/app-screenshot.png" 
                    alt="SME.AI Application Interface" 
                    width={1200} 
                    height={675}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
              <div className="absolute -z-10 inset-0 blur-3xl opacity-30 bg-gradient-to-r from-blue-600 to-purple-600 transform -skew-y-6" aria-hidden="true"></div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Specialized for Industrial Professionals</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Purpose-built AI assistant with features designed for engineering and industrial use cases.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Feature 1 */}
              <div className="card">
                <div className="w-12 h-12 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Image src="/file.svg" alt="Knowledge Base" width={24} height={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Specialized Knowledge</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Domain-specific knowledge for electrical, mechanical, process engineering and more.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card">
                <div className="w-12 h-12 mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Image src="/globe.svg" alt="Internet Access" width={24} height={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Internet Access</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Search the web for up-to-date information on codes, standards, and technical specifications.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card">
                <div className="w-12 h-12 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Image src="/window.svg" alt="Cloud Integration" width={24} height={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Cloud Integration</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Connect to Google Drive, OneDrive, and Dropbox to access and use your technical documents.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Industries section */}
        <section id="industries" className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Built for Your Industry</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                SME.AI is customized for professionals across various engineering disciplines.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
              {['Electrical Engineering', 'Mechanical Engineering', 'Process Engineering', 'Process Control', 'Project Engineering'].map((industry) => (
                <div key={industry} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-6 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                  <p className="font-medium">{industry}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing section */}
        <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Choose the plan that matches your needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Basic Plan */}
              <div className="card border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-2">Basic</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$29</span>
                  <span className="text-gray-600 dark:text-gray-300">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm">5 Projects</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm">50MB Storage</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm">2 Cloud Connections</span>
                  </li>
                </ul>
                <Link href="/signup?plan=basic" className="btn-outline w-full">
                  Get Started
                </Link>
              </div>

              {/* Professional Plan */}
              <div className="card border-2 border-primary-blue relative transform scale-105 shadow-glow">
                <div className="absolute top-0 inset-x-0 -translate-y-1/2 bg-primary-blue text-white text-xs font-medium px-3 py-1 rounded-full w-fit mx-auto">
                  Most Popular
                </div>
                <h3 className="text-xl font-semibold mb-2">Professional</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$79</span>
                  <span className="text-gray-600 dark:text-gray-300">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm">25 Projects</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm">250MB Storage</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm">Unlimited Cloud Connections</span>
                  </li>
                </ul>
                <Link href="/signup?plan=professional" className="btn-primary w-full">
                  Get Started
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="card border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$199</span>
                  <span className="text-gray-600 dark:text-gray-300">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm">Unlimited Projects</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm">1GB Storage</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm">Priority Support</span>
                  </li>
                </ul>
                <Link href="/signup?plan=enterprise" className="btn-outline w-full">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-sm uppercase mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">Features</Link></li>
                <li><Link href="#pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">Pricing</Link></li>
                <li><Link href="/demo" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm uppercase mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">Blog</Link></li>
                <li><Link href="/documentation" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">Documentation</Link></li>
                <li><Link href="/tutorials" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">Tutorials</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm uppercase mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">About</Link></li>
                <li><Link href="/careers" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">Careers</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm uppercase mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} SME.AI. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </Link>
              <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </Link>
              <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
