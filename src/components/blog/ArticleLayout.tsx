import { Helmet } from "react-helmet-async";
import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewFooter } from "@/components/landing/NewFooter";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ChevronLeft } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

interface ArticleMeta {
    title: string;
    description: string;
    publishDate: string;
    author: string;
    category: string;
    readTime: string;
}

interface ArticleLayoutProps {
    meta: ArticleMeta;
    children: React.ReactNode;
}

export function ArticleLayout({ meta, children }: ArticleLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Helmet>
                <title>{meta.title} | CVDebug Blog</title>
                <meta name="description" content={meta.description} />
            </Helmet>

            <NewNavbar />

            <main className="flex-grow pt-24 pb-16">
                <article className="max-w-3xl mx-auto px-6">
                    {/* Breadcrumb / Back */}
                    <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-8 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Home
                    </Link>

                    {/* Header */}
                    <header className="mb-12 text-center">
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 mb-6 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                            {meta.category}
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                            {meta.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 font-medium">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                                    {meta.author.charAt(0)}
                                </div>
                                {meta.author}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {meta.publishDate}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {meta.readTime}
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="prose prose-lg prose-blue mx-auto prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900">
                        {children}
                    </div>

                    {/* CTA Box */}
                    <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
                        <h3 className="text-2xl font-bold mb-4">Optimize your resume today</h3>
                        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                            Don't let the ATS reject your dream job application. Get a free scan in seconds.
                        </p>
                        <Link to="/dashboard">
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-0 font-bold">
                                Analyze My Resume Free
                            </Button>
                        </Link>
                    </div>
                </article>
            </main>

            <NewFooter />
        </div>
    );
}
