'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Meet Ashley</h1>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">Personal Info</h3>
                <div className="space-y-2">
                  <p className="text-white">
                    <span className="text-gray-400">Occupation:</span> Intern at a tech company
                  </p>
                  <p className="text-white">
                    <span className="text-gray-400">Duration:</span> 4 months
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">Financial Status</h3>
                <div className="space-y-2">
                  <p className="text-white">
                    <span className="text-gray-400">Bank Savings:</span> $1,000
                  </p>
                  <p className="text-white">
                    <span className="text-gray-400">Monthly Income:</span> $1,300
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">Monthly Expenses</h3>
                <div className="space-y-2">
                  <p className="text-white">
                    <span className="text-gray-400">Fixed Expenses:</span> $300
                    <span className="text-sm text-gray-400 ml-2">(transport, food, etc.)</span>
                  </p>
                  <p className="text-white">
                    <span className="text-gray-400">Disposable Income:</span> $1,000
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/bnpl"
              className="inline-block px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
            >
              Start BNPL Experience
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
