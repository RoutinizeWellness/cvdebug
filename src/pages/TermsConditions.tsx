import { motion } from "framer-motion";
import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewFooter } from "@/components/landing/NewFooter";
import { useEffect } from "react";
import { updatePageSEO } from "@/lib/seo";

export default function TermsConditions() {
  useEffect(() => {
    updatePageSEO({
      title: 'Terms & Conditions | CVDebug',
      description: 'CVDebug terms and conditions. Read our terms of service for using our ATS resume scanning platform.',
      keywords: ['terms and conditions', 'terms of service', 'cvdebug terms'],
      canonical: 'https://cvdebug.com/terms',
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
          <h1 className="text-5xl font-bold text-white mb-4">Terms & Conditions</h1>
          <p className="text-slate-400 mb-8">Last updated: January 11, 2026</p>

          <div className="glass-panel rounded-2xl p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-300 leading-relaxed">
                By accessing or using CVDebug's services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our service. These terms apply to all visitors, users, and others who access or use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                CVDebug provides an AI-powered ATS (Applicant Tracking System) resume scanning and optimization platform that includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li>Resume parsing and ATS compatibility analysis</li>
                <li>Keyword matching and gap identification</li>
                <li>Format and structure recommendations</li>
                <li>Job application tracking and management</li>
                <li>Cover letter and LinkedIn profile optimization tools</li>
                <li>Interview preparation resources</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p><strong className="text-white">Account Creation:</strong> You must create an account to access certain features. You agree to provide accurate, current, and complete information during registration.</p>
                <p><strong className="text-white">Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                <p><strong className="text-white">Account Termination:</strong> We reserve the right to suspend or terminate your account if you violate these terms or engage in fraudulent or abusive behavior.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Subscription Plans and Payments</h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p><strong className="text-white">Free Preview:</strong> Limited access to basic scanning features at no cost.</p>
                <p><strong className="text-white">Single Scan (€4.99):</strong> One-time payment for a single comprehensive resume analysis.</p>
                <p><strong className="text-white">Interview Sprint (€19.99):</strong> 30-day access to unlimited scans and premium features.</p>
                <p className="mt-4"><strong className="text-white">Billing:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All payments are processed securely through Stripe</li>
                  <li>Prices are in Euros and include applicable taxes</li>
                  <li>Interview Sprint subscriptions renew automatically unless canceled</li>
                  <li>You can cancel your subscription at any time from your account settings</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Refund Policy</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li>Single Scan purchases are non-refundable once the analysis is completed</li>
                <li>Interview Sprint subscriptions may be refunded within 7 days of initial purchase if no scans have been performed</li>
                <li>Refund requests must be submitted to support@cvdebug.com</li>
                <li>We reserve the right to refuse refunds for abuse or violation of terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Acceptable Use</h2>
              <p className="text-slate-300 leading-relaxed mb-4">You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Upload malicious code, viruses, or harmful content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Share your account credentials with others</li>
                <li>Resell or redistribute our service without permission</li>
                <li>Scrape, copy, or reverse engineer our platform</li>
                <li>Use automated tools to access the service excessively</li>
                <li>Upload resumes or content that you don't have rights to</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p><strong className="text-white">Our Content:</strong> All content, features, and functionality of CVDebug (including but not limited to text, graphics, logos, software, and AI models) are owned by CVDebug Inc. and are protected by copyright, trademark, and other intellectual property laws.</p>
                <p><strong className="text-white">Your Content:</strong> You retain all rights to the resumes and content you upload. By using our service, you grant us a limited license to process, analyze, and store your content solely for the purpose of providing our services.</p>
                <p><strong className="text-white">AI Training:</strong> We may use anonymized, aggregated data to improve our AI models, but we will never use your personal resume data to train models without explicit consent.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Disclaimers and Limitations</h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p><strong className="text-white">No Guarantee of Results:</strong> While we strive to provide accurate ATS analysis, we cannot guarantee that using our service will result in job interviews or employment. Job search outcomes depend on many factors outside our control.</p>
                <p><strong className="text-white">Service "As Is":</strong> Our service is provided "as is" without warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, error-free, or completely secure.</p>
                <p><strong className="text-white">Limitation of Liability:</strong> To the fullest extent permitted by law, CVDebug shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Third-Party Services</h2>
              <p className="text-slate-300 leading-relaxed">
                Our service may contain links to third-party websites or services (e.g., job boards, career resources). We are not responsible for the content, privacy policies, or practices of these third-party sites. Use of such services is at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Data Privacy</h2>
              <p className="text-slate-300 leading-relaxed">
                Your use of CVDebug is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information and resume data. Please review our Privacy Policy to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Modifications to Service</h2>
              <p className="text-slate-300 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any part of our service at any time, with or without notice. We may also update pricing, features, or subscription plans. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Termination</h2>
              <p className="text-slate-300 leading-relaxed">
                We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the service will cease immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">13. Governing Law</h2>
              <p className="text-slate-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes arising from these terms will be resolved in the courts of San Francisco County, California.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">14. Dispute Resolution</h2>
              <p className="text-slate-300 leading-relaxed">
                Before filing a claim, you agree to try to resolve the dispute informally by contacting us at support@cvdebug.com. If the dispute is not resolved within 30 days, either party may initiate formal proceedings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">15. Changes to Terms</h2>
              <p className="text-slate-300 leading-relaxed">
                We reserve the right to update these Terms and Conditions at any time. We will notify users of material changes by posting the updated terms on this page and updating the "Last updated" date. Your continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">16. Contact Information</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-white">Email: support@cvdebug.com</p>
                <p className="text-white">Legal: legal@cvdebug.com</p>
                <p className="text-white">Address: CVDebug Inc., 123 Tech Street, San Francisco, CA 94105</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">17. Severability</h2>
              <p className="text-slate-300 leading-relaxed">
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      <NewFooter />
    </div>
  );
}
