import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewFooter } from "@/components/landing/NewFooter";
import { Calendar, Clock, ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { updatePageSEO } from "@/lib/seo";

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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-[#0F172A] text-xl">Loading blog posts...</div>
      </div>
    );
  }

  const featuredPost = allPosts[0];
  const recentPosts = allPosts.slice(1);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <NewNavbar />

      <main className="container max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 relative overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mt-16"></div>
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -mt-16"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <span className="material-symbols-outlined text-cyan-600 text-[20px]">auto_stories</span>
              <span className="text-cyan-600 font-bold text-sm uppercase tracking-wider">Career Resources</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-[#0F172A] mb-6">
              CVDebug <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">Blog</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#475569] max-w-3xl mx-auto leading-relaxed font-medium">
              Expert guides, proven strategies, and insider insights to help you{" "}
              <span className="text-cyan-600 font-bold">beat ATS systems</span> and land more interviews.
            </p>
          </div>
        </motion.section>

        {/* Featured Post */}
        {featuredPost && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-16 group"
          >
            <div
              onClick={() => navigate(`/blog/${featuredPost.slug}`)}
              className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-2xl p-8 md:p-12 cursor-pointer hover:border-cyan-500/60 transition-all duration-300 relative overflow-hidden hover:shadow-[0_0_60px_-12px_rgba(6,182,212,0.4)]"
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-full shadow-lg shadow-cyan-500/20">
                    <span className="material-symbols-outlined text-white text-[18px]">star</span>
                    <span className="text-white text-sm font-black uppercase tracking-wider">Featured</span>
                  </div>
                  <span className="px-3 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-[#475569] text-sm font-semibold">
                    {featuredPost.category}
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] mt-6 mb-5 leading-tight group-hover:text-cyan-600 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-lg md:text-xl text-[#475569] mb-8 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center gap-6 mb-8 flex-wrap">
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <div className="p-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <time className="text-sm font-medium">
                      {featuredPost.publishedAt ? new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Recently'}
                    </time>
                  </div>
                  {featuredPost.readingTime && (
                    <div className="flex items-center gap-2 text-[#64748B]">
                      <div className="p-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{featuredPost.readingTime} min read</span>
                    </div>
                  )}
                  {featuredPost.views && (
                    <div className="flex items-center gap-2 text-[#64748B]">
                      <div className="p-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                        <Eye className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{featuredPost.views.toLocaleString()} views</span>
                    </div>
                  )}
                </div>

                <Button className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold px-6 py-6 text-base shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all group-hover:scale-[1.02]">
                  Read Full Article
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </motion.article>
        )}

        {/* Recent Posts Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A]">Recent Articles</h2>
            <span className="text-[#64748B] text-sm font-medium">{recentPosts.length} posts</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {recentPosts.map((post: any, index: number) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 2) }}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 cursor-pointer hover:border-teal-500/50 transition-all duration-300 group relative overflow-hidden flex flex-col h-full hover:shadow-[0_0_40px_-12px_rgba(20,184,166,0.3)]"
              >
                {/* Hover glow effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#475569] text-xs font-bold uppercase tracking-wider">
                      {post.category}
                    </span>
                    {post.views && post.views > 100 && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                        <span className="material-symbols-outlined text-teal-600 text-[14px]">trending_up</span>
                        <span className="text-teal-600 text-[10px] font-bold">POPULAR</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-[#0F172A] mt-2 mb-3 leading-tight group-hover:text-teal-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-[#475569] mb-4 leading-relaxed text-sm line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-[#64748B] text-xs mb-4 pt-4 border-t border-[#E2E8F0]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <time className="font-medium">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'Recently'}
                      </time>
                    </div>
                    {post.readingTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-medium">{post.readingTime} min</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {post.tags.slice(0, 3).map((tag: any, tagIndex: number) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[#64748B] text-[10px] font-semibold uppercase tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-[#64748B] text-[10px] font-semibold">+{post.tags.length - 3}</span>
                    )}
                  </div>
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
          className="mt-16 p-8 md:p-12 bg-gradient-to-br from-cyan-50 via-teal-50 to-cyan-50 border-2 border-cyan-500/30 rounded-2xl text-center relative overflow-hidden shadow-[0_0_80px_-12px_rgba(6,182,212,0.3)]"
        >
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -ml-16 -mt-16"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mb-16"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 mb-4">
              <span className="material-symbols-outlined text-cyan-600 text-[20px]">rocket_launch</span>
              <span className="text-cyan-600 font-bold text-sm uppercase tracking-wider">Start Your Journey</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4">
              Ready to See Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">ATS Score</span>?
            </h2>
            <p className="text-[#475569] text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Stop guessing and start optimizing. Scan your resume and get{" "}
              <span className="text-cyan-600 font-bold">instant AI-powered insights</span> in seconds.
            </p>
            <Button
              onClick={() => navigate('/')}
              size="lg"
              className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white px-10 py-6 text-lg font-black shadow-[0_0_40px_-5px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_-5px_rgba(6,182,212,0.7)] transition-all hover:scale-[1.05]"
            >
              <span className="flex items-center gap-2">
                Scan Your Resume for Free
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
            <p className="text-[#64748B] text-sm mt-4">No credit card required • Get results in 10 seconds</p>
          </div>
        </motion.section>
      </main>

      <NewFooter />
    </div>
  );
}
