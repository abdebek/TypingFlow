import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Database, Lock, AlertTriangle } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="glass-card p-8 text-center">
        <Shield className="w-16 h-16 text-primary-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-200 mb-4">Privacy Policy</h1>
        <p className="text-gray-400">
          Last updated: January 1, 2025
        </p>
      </div>

      {/* Content */}
      <div className="glass-card p-8">
        <div className="prose prose-invert max-w-none">
          
          {/* Introduction */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="w-6 h-6 text-success-400" />
              <h2 className="text-xl font-bold text-gray-200">Introduction</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              At TypingFlow, we are committed to protecting your privacy and ensuring transparency about how we handle your data. 
              This Privacy Policy explains what information we collect, how we use it, and your rights regarding your personal data.
            </p>
          </section>

          {/* Data Collection */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-6 h-6 text-primary-400" />
              <h2 className="text-xl font-bold text-gray-200">Information We Collect</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Local Storage Data</h3>
                <p className="leading-relaxed">
                  TypingFlow stores your typing test results, personal bests, and settings locally in your browser. 
                  This data never leaves your device and is not transmitted to our servers.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Analytics Data</h3>
                <p className="leading-relaxed">
                  We may collect anonymous usage statistics to improve the application, including:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Page views and session duration</li>
                  <li>Feature usage patterns</li>
                  <li>Error reports and performance metrics</li>
                  <li>General geographic location (country level)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Usage */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-gray-200">How We Use Your Information</h2>
            </div>
            <div className="text-gray-300 space-y-3">
              <p className="leading-relaxed">We use the collected information to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Provide and maintain the typing test functionality</li>
                <li>Save your progress and personal records locally</li>
                <li>Improve the application's performance and user experience</li>
                <li>Analyze usage patterns to develop new features</li>
                <li>Ensure the security and stability of our service</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-success-400" />
              <h2 className="text-xl font-bold text-gray-200">Data Security</h2>
            </div>
            <div className="text-gray-300 space-y-3">
              <p className="leading-relaxed">
                Your typing data is stored locally in your browser using secure web storage APIs. 
                We implement industry-standard security measures to protect any data that may be transmitted:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>HTTPS encryption for all communications</li>
                <li>No personal data transmission to external servers</li>
                <li>Regular security audits and updates</li>
                <li>Minimal data collection principles</li>
              </ul>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Third-Party Services</h2>
            <div className="text-gray-300 space-y-3">
              <p className="leading-relaxed">
                TypingFlow may use third-party services for analytics and hosting:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Netlify:</strong> For hosting and content delivery</li>
                <li><strong>Google Analytics:</strong> For anonymous usage analytics (if enabled)</li>
              </ul>
              <p className="leading-relaxed mt-3">
                These services have their own privacy policies and data handling practices.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Your Rights</h2>
            <div className="text-gray-300 space-y-3">
              <p className="leading-relaxed">You have the right to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Clear your local data at any time through the settings</li>
                <li>Disable analytics tracking in your browser</li>
                <li>Request information about data processing</li>
                <li>Use the application without providing any personal information</li>
              </ul>
            </div>
          </section>

          {/* Updates */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-gray-200">Policy Updates</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page 
              with an updated "Last modified" date. We encourage you to review this policy periodically.
            </p>
          </section>

          {/* No Data Collection Notice */}
          <section>
            <h2 className="text-xl font-bold text-gray-200 mb-4">No Personal Data Collection</h2>
            <div className="bg-success-900/20 border border-success-500/30 rounded-lg p-4">
              <p className="text-success-300 leading-relaxed">
                <strong>Important:</strong> TypingFlow is designed as a privacy-first application. We do not collect, 
                store, or transmit any personal information. All your typing data remains on your device and is never 
                sent to external servers. You can use this application with complete confidence in your privacy.
              </p>
            </div>
          </section>

        </div>
      </div>
    </motion.div>
  );
}