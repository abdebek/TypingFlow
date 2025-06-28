import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, AlertTriangle, Scale } from 'lucide-react';

export function TermsOfService() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="glass-card p-8 text-center">
        <FileText className="w-16 h-16 text-primary-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-200 mb-4">Terms of Service</h1>
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
              <Users className="w-6 h-6 text-success-400" />
              <h2 className="text-xl font-bold text-gray-200">Agreement to Terms</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using TypingFlow, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* Service Description */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Service Description</h2>
            <div className="text-gray-300 space-y-3">
              <p className="leading-relaxed">
                TypingFlow is a web-based typing test application that provides:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Typing speed and accuracy tests</li>
                <li>Interactive typing tutorials</li>
                <li>Performance analytics and progress tracking</li>
                <li>Gamified challenges and achievements</li>
                <li>Virtual keyboard visualization</li>
              </ul>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Scale className="w-6 h-6 text-primary-400" />
              <h2 className="text-xl font-bold text-gray-200">Acceptable Use</h2>
            </div>
            <div className="text-gray-300 space-y-3">
              <p className="leading-relaxed">You agree to use TypingFlow only for lawful purposes and in a way that does not infringe the rights of others. You must not:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated tools to manipulate test results</li>
                <li>Interfere with the proper functioning of the service</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to reverse engineer or copy the application</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Intellectual Property</h2>
            <div className="text-gray-300 space-y-3">
              <p className="leading-relaxed">
                The TypingFlow application, including its design, code, content, and features, is protected by copyright and other intellectual property laws. 
                The source code is available under an open-source license on GitHub.
              </p>
              <p className="leading-relaxed">
                Text content used in typing tests may be sourced from public domain works, fair use excerpts, or original content. 
                We respect intellectual property rights and will address any concerns promptly.
              </p>
            </div>
          </section>

          {/* User Data */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-200 mb-4">User Data and Privacy</h2>
            <div className="text-gray-300 space-y-3">
              <p className="leading-relaxed">
                Your typing test results and progress are stored locally in your browser. We do not collect or store personal information on our servers. 
                For detailed information about data handling, please refer to our Privacy Policy.
              </p>
              <p className="leading-relaxed">
                You are responsible for backing up your data if desired, as clearing browser data will remove your local progress.
              </p>
            </div>
          </section>

          {/* Service Availability */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-gray-200">Service Availability</h2>
            </div>
            <div className="text-gray-300 space-y-3">
              <p className="leading-relaxed">
                We strive to maintain high availability of TypingFlow, but we cannot guarantee uninterrupted service. 
                The service may be temporarily unavailable due to:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Scheduled maintenance</li>
                <li>Technical issues or server problems</li>
                <li>Third-party service dependencies</li>
                <li>Force majeure events</li>
              </ul>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Disclaimers</h2>
            <div className="text-gray-300 space-y-3">
              <p className="leading-relaxed">
                TypingFlow is provided "as is" without any warranties, express or implied. We do not warrant that:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>The service will be error-free or uninterrupted</li>
                <li>All features will work perfectly on all devices</li>
                <li>Your data will be permanently preserved</li>
                <li>The service will meet your specific requirements</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              To the maximum extent permitted by law, TypingFlow and its creators shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including but not limited to loss of data, 
              loss of use, or loss of profits, arising out of your use of the service.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
              Your continued use of TypingFlow after any changes constitutes acceptance of the new terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-xl font-bold text-gray-200 mb-4">Governing Law</h2>
            <p className="text-gray-300 leading-relaxed">
              These terms shall be governed by and construed in accordance with applicable laws. 
              Any disputes arising from these terms or your use of TypingFlow shall be resolved through appropriate legal channels.
            </p>
          </section>

        </div>
      </div>
    </motion.div>
  );
}