import { Star, Quote, Briefcase, TrendingUp, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Testimonial {
    name: string;
    role: string;
    company: string;
    image?: string;
    rating: number;
    quote: string;
    results: {
        before: string;
        after: string;
        improvement: string;
    };
}

const testimonials: Testimonial[] = [
    {
        name: "Sarah Chen",
        role: "Software Engineer",
        company: "Google",
        rating: 5,
        quote: "I was getting ghosted by every company. After using this tool, my resume score went from 42 to 89. I got 3 interviews in the first week and landed at Google!",
        results: {
            before: "42/100 Score",
            after: "89/100 Score",
            improvement: "+47 points"
        }
    },
    {
        name: "Marcus Johnson",
        role: "SDR",
        company: "Salesforce",
        rating: 5,
        quote: "The keyword analysis was a game-changer. It showed me exactly what recruiters were looking for. Within 2 weeks, I had 5 interviews lined up.",
        results: {
            before: "2% Response Rate",
            after: "35% Response Rate",
            improvement: "17.5x increase"
        }
    },
    {
        name: "Elena Rodriguez",
        role: "Product Manager",
        company: "Meta",
        rating: 5,
        quote: "Best $24.99 I've ever spent. The AI rewrites were spot-on, and the interview prep helped me ace every question. Highly recommend!",
        results: {
            before: "0 Interviews",
            after: "8 Interviews",
            improvement: "3 offers"
        }
    },
    {
        name: "David Kim",
        role: "Data Scientist",
        company: "Amazon",
        rating: 5,
        quote: "I tried Jobscan and Resume Worded before this. This tool is 10x better and way cheaper. The ML scoring is incredibly accurate.",
        results: {
            before: "Spent $89/mo",
            after: "Spent $24.99",
            improvement: "Saved $64"
        }
    }
];

const stats = [
    { label: "Average Score Improvement", value: "+32 points", icon: TrendingUp },
    { label: "Success Rate", value: "95%", icon: CheckCircle2 },
    { label: "Average Time to Interview", value: "12 days", icon: Briefcase },
    { label: "User Satisfaction", value: "4.9/5", icon: Star },
];

export default function SuccessStories() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Real Results from <span className="text-blue-600">Real People</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Join thousands of job seekers who've transformed their careers with our AI-powered tools
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow">
                            <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </Card>
                    ))}
                </div>

                {/* Testimonials */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {testimonials.map((testimonial, idx) => (
                        <Card key={idx} className="p-8 hover:shadow-2xl transition-all hover:-translate-y-1">
                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            {/* Quote */}
                            <div className="relative mb-6">
                                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-200" />
                                <p className="text-gray-700 italic pl-6 leading-relaxed">
                                    "{testimonial.quote}"
                                </p>
                            </div>

                            {/* Results */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-xs text-gray-600 mb-1">Before</div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            {testimonial.results.before}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-600 mb-1">After</div>
                                        <div className="text-sm font-semibold text-green-600">
                                            {testimonial.results.after}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-600 mb-1">Result</div>
                                        <div className="text-sm font-bold text-blue-600">
                                            {testimonial.results.improvement}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                    <div className="text-sm text-gray-600">
                                        {testimonial.role} at {testimonial.company}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Social Proof Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Your Success Story Starts Here
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join 1,000+ job seekers who've already transformed their careers
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                            Get Started Free
                        </button>
                        <button className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                            View Pricing
                        </button>
                    </div>
                    <p className="text-sm text-blue-200 mt-6">
                        💳 No credit card required • ⚡ Results in minutes • 🎯 95% success rate
                    </p>
                </div>

                {/* Trust Indicators */}
                <div className="mt-16 text-center">
                    <p className="text-sm text-gray-500 mb-6">Trusted by professionals at</p>
                    <div className="flex flex-wrap justify-center gap-8 items-center opacity-40">
                        <div className="text-2xl font-bold text-gray-600">Google</div>
                        <div className="text-2xl font-bold text-gray-600">Meta</div>
                        <div className="text-2xl font-bold text-gray-600">Amazon</div>
                        <div className="text-2xl font-bold text-gray-600">Salesforce</div>
                        <div className="text-2xl font-bold text-gray-600">Microsoft</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
