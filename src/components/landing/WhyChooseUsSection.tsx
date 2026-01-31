import { motion } from "framer-motion";
import { Check, X, Zap, Target, TrendingUp } from "lucide-react";

const features = [
    { name: "ML-Powered Scoring", us: true, others: false },
    { name: "Success Analytics", us: true, others: false },
    { name: "Application CRM", us: true, others: false },
    { name: "Flexible Pricing ($4.99)", us: true, others: false },
    { name: "Real-time AI Feedback", us: true, others: true },
    { name: "ATS Scanning", us: true, others: true },
    { name: "LinkedIn Optimization", us: true, others: "Premium" },
    { name: "Unlimited Rewrites", us: true, others: "Limited" },
];

export function WhyChooseUsSection() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Why Choose RoutinizeWellness?
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Compare us with traditional resume tools. We offer more power for less.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Feature List */}
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="bg-blue-100 p-3 rounded-lg h-fit">
                                <Target className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Precision Targeting</h3>
                                <p className="text-gray-600 mt-2">
                                    Our advanced ML algorithms analyze your resume against specific job descriptions with 95% accuracy compared to industry standard 70%.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-green-100 p-3 rounded-lg h-fit">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Success Analytics</h3>
                                <p className="text-gray-600 mt-2">
                                    Track your application success rate, interview conversions, and A/B test different versions of your resume.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-purple-100 p-3 rounded-lg h-fit">
                                <Zap className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Pay-As-You-Go</h3>
                                <p className="text-gray-600 mt-2">
                                    No forced subscriptions. Pay $4.99 for a single fix or $9.99 for a 24-hour pass when you need it.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Comparison Table Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-xl"
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Feature Comparison</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 text-sm font-semibold text-gray-500 border-b border-gray-200 pb-2">
                                <div>Feature</div>
                                <div className="text-center text-blue-600">Us</div>
                                <div className="text-center">Others</div>
                            </div>

                            {features.map((feature, idx) => (
                                <div key={idx} className="grid grid-cols-3 items-center text-sm py-2 border-b border-gray-100 last:border-0">
                                    <div className="font-medium text-gray-800">{feature.name}</div>
                                    <div className="flex justify-center">
                                        {feature.us === true ? (
                                            <div className="bg-blue-100 text-blue-600 rounded-full p-1">
                                                <Check className="w-4 h-4" />
                                            </div>
                                        ) : (
                                            <span className="text-blue-600 font-bold">{feature.us}</span>
                                        )}
                                    </div>
                                    <div className="flex justify-center">
                                        {feature.others === true ? (
                                            <div className="bg-gray-100 text-gray-600 rounded-full p-1">
                                                <Check className="w-4 h-4" />
                                            </div>
                                        ) : feature.others === false ? (
                                            <div className="bg-red-50 text-red-400 rounded-full p-1">
                                                <X className="w-4 h-4" />
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">{feature.others}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-500 italic mb-4">
                                *Comparison based on standard market rates
                            </p>
                            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/25">
                                Start For Free
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
