import { motion } from "framer-motion";
import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewFooter } from "@/components/landing/NewFooter";
import { Mail, MessageSquare, Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { updatePageSEO } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    updatePageSEO({
      title: 'Contact Us | CVDebug Support',
      description: 'Get in touch with CVDebug support team. We\'re here to help with your resume optimization questions and technical support.',
      keywords: ['contact cvdebug', 'customer support', 'help desk', 'technical support'],
      canonical: 'https://cvdebug.com/contact',
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast("Message sent! We'll get back to you within 24 hours.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      detail: "support@cvdebug.com",
      color: "blue"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      detail: "Available 9AM-5PM PST",
      color: "purple"
    },
    {
      icon: Clock,
      title: "Response Time",
      description: "Average response time",
      detail: "Under 4 hours",
      color: "green"
    },
    {
      icon: MapPin,
      title: "Location",
      description: "Headquarters",
      detail: "San Francisco, CA",
      color: "orange"
    }
  ];

  return (
    <div className="dark min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <NewNavbar />

      <main className="container max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Get in <span className="text-blue-500">Touch</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Have a question or need help? Our team is here to assist you with anything related to CVDebug.
          </p>
        </motion.section>

        {/* Contact Methods Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 2) }}
              className="glass-panel rounded-xl p-6 text-center"
            >
              <div className={`w-12 h-12 bg-${method.color}-600/20 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                <method.icon className={`w-6 h-6 text-${method.color}-400`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{method.title}</h3>
              <p className="text-slate-400 text-sm mb-2">{method.description}</p>
              <p className="text-white font-semibold">{method.detail}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Contact Form */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-12 mb-16"
        >
          {/* Form */}
          <div className="glass-panel rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing & Subscriptions</option>
                  <option value="feature">Feature Request</option>
                  <option value="feedback">General Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div className="glass-panel rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">How long does resume scanning take?</h4>
                  <p className="text-slate-300 text-sm">Most resumes are analyzed in 10-30 seconds. Complex documents may take up to 2 minutes.</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Can I get a refund?</h4>
                  <p className="text-slate-300 text-sm">Yes! We offer refunds within 7 days of purchase if you haven't used any scans.</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Is my resume data secure?</h4>
                  <p className="text-slate-300 text-sm">Absolutely. We use end-to-end encryption and never share your data with third parties.</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Do you offer enterprise plans?</h4>
                  <p className="text-slate-300 text-sm">Yes! Contact us at enterprise@cvdebug.com for custom solutions.</p>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Office Hours</h3>
              <div className="space-y-3 text-slate-300">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-white font-semibold">9:00 AM - 6:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-white font-semibold">10:00 AM - 4:00 PM PST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-slate-500">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="p-12 bg-gradient-to-r from-blue-600/10 to-teal-600/10 border border-blue-500/20 rounded-2xl text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Optimize Your Resume?
          </h2>
          <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto">
            Don't wait! Start scanning your resume today and get instant feedback.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            Get Started Free
          </a>
        </motion.section>
      </main>

      <NewFooter />
    </div>
  );
}
