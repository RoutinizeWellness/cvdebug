import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewFooter } from "@/components/landing/NewFooter";
import { Calendar, Clock, ArrowRight, Eye, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { updatePageSEO } from "@/lib/seo";
import { SEOHead, StructuredDataTemplates } from "@/components/SEOHead";

export default function Blog() {
  const navigate = useNavigate();
  const allPosts = useQuery(api.blog.getAllPosts, { limit: 20 });
  const categories = useQuery(api.blog.getCategories, {});

  useEffect(() => {
    updatePageSEO({
      title: 'ATS Resume Tips & Job Search Strategies Blog | CVDebug',
      description: 'Expert advice on beating ATS systems, optimizing your resume, and landing more interviews. Learn proven strategies to get hired faster.',
      keywords: [
        'ATS tips',
        'resume writing',
        'job search strategies',
        'interview preparation',
        'career advice',
        'resume optimization',
        'ATS resume scanner',
        'job application tips',
        'resume keywords',
        'hiring process'
      ],
      canonical: 'https://cvdebug.com/blog',
    });
  }, []);

  if (!allPosts) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#0F172A] text-xl">Loading blog posts...</div>
      </div>
    );
  }

  const featuredPost = allPosts[0];
  const recentPosts = allPosts.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="ATS Resume Tips & Job Search Strategies Blog"
        description="Expert advice on beating ATS systems, optimizing your resume, and landing more interviews. Learn proven strategies to get hired faster."
        keywords={[
          'ATS tips',
          'resume writing',
          'job search strategies',
          'interview preparation',
          'career advice',
          'resume optimization',
          'ATS resume scanner'
        ]}
        ogType="website"
        canonical="https://cvdebug.com/blog"
        structuredData={StructuredDataTemplates.website('CVDebug Blog', 'https://cvdebug.com/blog')}
      />
      <NewNavbar />

      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] mb-6">
            <BookOpen className="w-4 h-4 text-[#1E293B]" />
            <span className="text-[#1E293B] font-semibold text-sm">Career Resources</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            CVDebug <span className="text-[#1E293B]">Blog</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Expert guides and proven strategies to help you beat ATS systems and land more interviews.
          </p>
        </motion.section>

        {/* Featured Post */}
        {featuredPost && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-20"
          >
            <div
              onClick={() => navigate(`/blog/${featuredPost.slug}`)}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#CBD5E1] hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              {/* Featured badge */}
              <div className="bg-gradient-to-r from-[#0F172A] to-indigo-600 px-6 py-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-white text-[20px]">star</span>
                  <span className="text-white text-sm font-bold uppercase tracking-wider">Featured Article</span>
                </div>
              </div>

              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-[#0F172A] text-sm font-semibold">
                    {featuredPost.category}
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-[#1E293B] transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center gap-6 mb-8 flex-wrap text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time>
                      {featuredPost.publishedAt ? new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Recently'}
                    </time>
                  </div>
                  {featuredPost.readingTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readingTime} min read</span>
                    </div>
                  )}
                  {featuredPost.views && (
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{featuredPost.views.toLocaleString()} views</span>
                    </div>
                  )}
                </div>

                <Button className="bg-[#0F172A] hover:bg-[#0F172A] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all">
                  Read Full Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.article>
        )}

        {/* Recent Posts Section */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Recent Articles</h2>
            <span className="text-gray-500 text-sm font-medium bg-gray-100 px-4 py-2 rounded-full">
              {recentPosts.length} posts
            </span>
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post: any, index: number) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 2) }}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#CBD5E1] hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full"
              >
                <div className="p-6 flex flex-col h-full">
                  {/* Category Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-xs font-semibold uppercase tracking-wide">
                      {post.category}
                    </span>
                    {post.views && post.views > 100 && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-lg">
                        <span className="material-symbols-outlined text-green-600 text-[14px]">trending_up</span>
                        <span className="text-green-600 text-[10px] font-bold uppercase">Popular</span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#1E293B] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-gray-500 text-xs pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <time>
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'Recently'}
                      </time>
                    </div>
                    {post.readingTime && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readingTime} min</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap mt-4">
                      {post.tags.slice(0, 3).map((tag: any, tagIndex: number) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-gray-600 text-[10px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-gray-500 text-[10px] font-medium">+{post.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-20 p-12 bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] border border-[#E2E8F0] rounded-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2E8F0] mb-6">
            <span className="material-symbols-outlined text-[#1E293B] text-[20px]">rocket_launch</span>
            <span className="text-[#1E293B] font-semibold text-sm">Start Your Journey</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to See Your <span className="text-[#1E293B]">ATS Score</span>?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Stop guessing and start optimizing. Scan your resume and get instant AI-powered insights in seconds.
          </p>
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="bg-[#0F172A] hover:bg-[#0F172A] text-white px-10 py-6 text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <span className="flex items-center gap-2">
              Scan Your Resume for Free
              <ArrowRight className="w-5 h-5" />
            </span>
          </Button>
          <p className="text-gray-500 text-sm mt-4">No credit card required • Get results in 10 seconds</p>
        </motion.section>
      </main>

      <NewFooter />
    </div>
  );
}
