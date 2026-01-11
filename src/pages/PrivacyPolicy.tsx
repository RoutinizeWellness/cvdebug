import { motion } from "framer-motion";
import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewFooter } from "@/components/landing/NewFooter";
import { useEffect } from "react";
import { updatePageSEO } from "@/lib/seo";

export default function PrivacyPolicy() {
  useEffect(() => {
    updatePageSEO({
      title: 'Privacy Policy | CVDebug',
      description: 'CVDebug privacy policy. Learn how we collect, use, and protect your personal information and resume data.',
      keywords: ['privacy policy', 'data protection', 'cvdebug privacy'],
      canonical: 'https://cvdebug.com/privacy',
    });
  }, []);

  return (
    <div className="dark min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <NewNavbar />

      <main className="container max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400 mb-8">Last updated: January 11, 2026</p>

          <div className="glass-panel rounded-2xl p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p className="text-slate-300 leading-relaxed">
                CVDebug Inc. ("we," "us," or "our") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our ATS resume scanning service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p><strong className="text-white">Personal Information:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name and email address</li>
                  <li>Account credentials</li>
                  <li>Payment information (processed securely through Stripe)</li>
                </ul>

                <p className="mt-4"><strong className="text-white">Resume Data:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Resume files you upload (PDF, DOCX)</li>
                  <li>Extracted text content from your resume</li>
                  <li>Job descriptions you provide for matching</li>
                  <li>Analysis results and ATS scores</li>
                </ul>

                <p className="mt-4"><strong className="text-white">Usage Data:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Device information and browser type</li>
                  <li>IP address and location data</li>
                  <li>Pages visited and features used</li>
                  <li>Time and date of visits</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li>To provide and maintain our ATS scanning service</li>
                <li>To process your resume uploads and generate analysis reports</li>
                <li>To manage your account and subscriptions</li>
                <li>To send you service-related notifications and updates</li>
                <li>To improve our AI models and service quality</li>
                <li>To detect and prevent fraud or abuse</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
              <p className="text-slate-300 leading-relaxed">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4 mt-4">
                <li>End-to-end encryption for data transmission</li>
                <li>Encrypted storage for resume files and personal information</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure payment processing through PCI-compliant providers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Data Sharing and Disclosure</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We do not sell, rent, or share your personal information or resume data with third parties, except in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li><strong className="text-white">Service Providers:</strong> We work with trusted third-party services (e.g., cloud hosting, payment processing) who help us operate our service</li>
                <li><strong className="text-white">Legal Requirements:</strong> When required by law, court order, or to protect our rights</li>
                <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong className="text-white">With Your Consent:</strong> When you explicitly authorize us to share your information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Data Retention</h2>
              <p className="text-slate-300 leading-relaxed">
                We retain your personal information and resume data for as long as your account is active or as needed to provide you services. You can request deletion of your data at any time by contacting us. Anonymized usage data may be retained for analytical purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
              <p className="text-slate-300 leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Export your data in a portable format</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to processing of your personal data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Cookies and Tracking</h2>
              <p className="text-slate-300 leading-relaxed">
                We use cookies and similar tracking technologies to improve user experience, analyze usage patterns, and personalize content. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
              <p className="text-slate-300 leading-relaxed">
                Our service is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. International Data Transfers</h2>
              <p className="text-slate-300 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Changes to This Policy</h2>
              <p className="text-slate-300 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date. Continued use of our service after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
              <p className="text-slate-300 leading-relaxed">
                If you have questions about this privacy policy or wish to exercise your rights, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-slate-800/50 rounded-lg">
                <p className="text-white">Email: privacy@cvdebug.com</p>
                <p className="text-white">Address: CVDebug Inc., 123 Tech Street, San Francisco, CA 94105</p>
              </div>
            </section>
          </div>
        </motion.div>
      </main>

      <NewFooter />
    </div>
  );
}
