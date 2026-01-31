import { Check, X, Sparkles, Zap, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

interface CompetitorFeature {
    feature: string;
    us: boolean | string;
    jobscan: boolean | string;
    resumeWorded: boolean | string;
    topResume: boolean | string;
    category: "core" | "advanced" | "unique";
}

const features: CompetitorFeature[] = [
    // Core Features
    { feature: "ATS Scanning", us: "ML-Powered", jobscan: "Basic", resumeWorded: true, topResume: "Manual", category: "core" },
    { feature: "Keyword Analysis", us: "Advanced AI", jobscan: "Basic", resumeWorded: "Good", topResume: "Manual", category: "core" },
    { feature: "Real-time Scoring", us: true, jobscan: true, resumeWorded: true, topResume: false, category: "core" },
    { feature: "Format Check", us: true, jobscan: true, resumeWorded: true, topResume: true, category: "core" },

    // Advanced Features
    { feature: "AI Rewriting", us: "Unlimited*", jobscan: false, resumeWorded: "Limited", topResume: "Manual", category: "advanced" },
    { feature: "Cover Letter Generator", us: "AI-Powered", jobscan: false, resumeWorded: "Templates", topResume: "Manual", category: "advanced" },
    { feature: "LinkedIn Optimization", us: true, jobscan: true, resumeWorded: true, topResume: false, category: "advanced" },
    { feature: "Interview Prep", us: "Battle Plans", jobscan: false, resumeWorded: "Basic", topResume: false, category: "advanced" },

    // Unique Features
    { feature: "Application Tracker", us: "CRM-Style", jobscan: false, resumeWorded: false, topResume: false, category: "unique" },
    { feature: "A/B Testing", us: "CV Versions", jobscan: false, resumeWorded: false, topResume: false, category: "unique" },
    { feature: "Success Analytics", us: true, jobscan: false, resumeWorded: false, topResume: false, category: "unique" },
    { feature: "24-Hour Pass", us: "$9.99", jobscan: false, resumeWorded: false, topResume: false, category: "unique" },
];

const pricingComparison = [
    { name: "Our SaaS", entry: "$4.99", mid: "$9.99 (24h)", premium: "$29.99 (7d)", highlight: true },
    { name: "Jobscan", entry: "$49.95/mo", mid: "$69.95/mo", premium: "$89.95/mo", highlight: false },
    { name: "Resume Worded", entry: "$19/mo", mid: "$33/mo", premium: "$49/mo", highlight: false },
    { name: "TopResume", entry: "$149", mid: "$219", premium: "$349", highlight: false },
];

export default function CompetitorComparison() {
    const navigate = useNavigate();

    const renderValue = (value: boolean | string) => {
        if (typeof value === "boolean") {
            return value ? (
                <Check className="w-5 h-5 text-green-500 mx-auto" />
            ) : (
                <X className="w-5 h-5 text-gray-300 mx-auto" />
            );
        }
        return <span className="text-sm font-medium text-gray-900">{value}</span>;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Why Choose <span className="text-blue-600">RoutinizeWellness</span>?
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        See how we compare to other resume optimization tools. Spoiler: We're better. 😉
                    </p>
                </div>

                {/* Key Differentiators */}
                <div className="grid md:grid-cols-4 gap-6 mb-16">
                    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-500">
                        <Sparkles className="w-10 h-10 text-blue-600 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Most Advanced AI</h3>
                        <p className="text-sm text-gray-600">
                            ML-powered scoring with 40+ factors. Not just keyword matching.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-500">
                        <Zap className="w-10 h-10 text-green-600 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Most Flexible Pricing</h3>
                        <p className="text-sm text-gray-600">
                            Pay only when you need it. $4.99 one-time or $9.99 for 24 hours.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-500">
                        <Shield className="w-10 h-10 text-purple-600 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Complete Suite</h3>
                        <p className="text-sm text-gray-600">
                            Resume + Cover Letter + LinkedIn + Interview Prep + Tracking.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-500">
                        <TrendingUp className="w-10 h-10 text-orange-600 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Success Analytics</h3>
                        <p className="text-sm text-gray-600">
                            Track what works. No other tool offers this level of insight.
                        </p>
                    </div>
                </div>

                {/* Feature Comparison Table */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-16">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                        <h2 className="text-2xl font-bold text-white">Feature Comparison</h2>
                        <p className="text-blue-100 mt-1">See how we stack up against the competition</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600 bg-blue-50">
                                        Us ⭐
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Jobscan</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Resume Worded</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">TopResume</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {features.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className={`
                      ${item.category === "unique" ? "bg-blue-50" : ""}
                      hover:bg-gray-50 transition-colors
                    `}
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                            {item.feature}
                                            {item.category === "unique" && (
                                                <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                                                    Unique
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center bg-blue-50 font-semibold">
                                            {renderValue(item.us)}
                                        </td>
                                        <td className="px-6 py-4 text-center">{renderValue(item.jobscan)}</td>
                                        <td className="px-6 py-4 text-center">{renderValue(item.resumeWorded)}</td>
                                        <td className="px-6 py-4 text-center">{renderValue(item.topResume)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-gray-50 px-6 py-3 text-xs text-gray-600">
                        * Unlimited AI rewrites on Interview Sprint plan
                    </div>
                </div>

                {/* Pricing Comparison */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-16">
                    <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
                        <h2 className="text-2xl font-bold text-white">Pricing Comparison</h2>
                        <p className="text-green-100 mt-1">We're up to 90% cheaper than competitors</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Service</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Entry</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Mid Tier</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Premium</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pricingComparison.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className={`
                      ${item.highlight ? "bg-green-50 font-semibold" : ""}
                      hover:bg-gray-50 transition-colors
                    `}
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {item.name}
                                            {item.highlight && (
                                                <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                                                    Best Value
                                                </span>
                                            )}
                                        </td>
                                        <td className={`px-6 py-4 text-center text-sm ${item.highlight ? "text-green-700" : "text-gray-900"}`}>
                                            {item.entry}
                                        </td>
                                        <td className={`px-6 py-4 text-center text-sm ${item.highlight ? "text-green-700" : "text-gray-900"}`}>
                                            {item.mid}
                                        </td>
                                        <td className={`px-6 py-4 text-center text-sm ${item.highlight ? "text-green-700" : "text-gray-900"}`}>
                                            {item.premium}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of job seekers who've landed their dream jobs with our AI-powered tools.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-6 text-lg"
                            onClick={() => navigate("/dashboard")}
                        >
                            Start Free Trial
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg"
                            onClick={() => navigate("/pricing")}
                        >
                            View Pricing
                        </Button>
                    </div>
                    <p className="text-sm text-blue-200 mt-6">
                        No credit card required • Start in 2 minutes • Cancel anytime
                    </p>
                </div>

                {/* Trust Indicators */}
                <div className="mt-16 text-center">
                    <p className="text-sm text-gray-500 mb-4">Trusted by job seekers worldwide</p>
                    <div className="flex flex-wrap justify-center gap-8 items-center opacity-50">
                        <div className="text-2xl font-bold text-gray-400">1,000+ Users</div>
                        <div className="text-2xl font-bold text-gray-400">4.8★ Rating</div>
                        <div className="text-2xl font-bold text-gray-400">95% Success Rate</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
