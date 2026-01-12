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
      <div className="dark min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading blog posts...</div>
      </div>
    );
  }

  const featuredPost = allPosts[0];
  const recentPosts = allPosts.slice(1);

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
            CVDebug <span className="text-blue-500">Blog</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Guides, strategies, and insights to help you beat ATS systems and land more interviews.
          </p>
        </motion.section>

        {/* Featured Post */}
        {featuredPost && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-16"
          >
            <div
              onClick={() => navigate(`/blog/${featuredPost.slug}`)}
              className="glass-panel rounded-2xl p-8 md:p-12 cursor-pointer hover:border-blue-500/50 transition-all"
            >
              <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-semibold">
                Featured
              </span>
              <h2 className="text-4xl font-bold text-white mt-6 mb-4">
                {featuredPost.title}
              </h2>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-6 mb-6 flex-wrap">
                <div className="flex items-center gap-2 text-slate-400">
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
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readingTime} min read</span>
                  </div>
                )}
                {featuredPost.views && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Eye className="w-4 h-4" />
                    <span>{featuredPost.views} views</span>
                  </div>
                )}
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Read Article
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.article>
        )}

        {/* Recent Posts Grid */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">Recent Articles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {recentPosts.map((post: any, index: number) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 2) }}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="glass-panel rounded-xl p-6 cursor-pointer hover:border-blue-500/50 transition-all"
              >
                <span className="px-3 py-1 bg-slate-800 rounded-full text-slate-300 text-xs font-semibold">
                  {post.category}
                </span>
                <h3 className="text-2xl font-bold text-white mt-4 mb-3">
                  {post.title}
                </h3>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-slate-400 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time>
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'Recently'}
                    </time>
                  </div>
                  {post.readingTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.readingTime} min</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {post.tags.map((tag: any, tagIndex: number) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-slate-800/50 rounded text-slate-400 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
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
          className="mt-16 p-12 bg-gradient-to-r from-blue-600/10 to-teal-600/10 border border-blue-500/20 rounded-2xl text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to See Your ATS Score?
          </h2>
          <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto">
            Stop guessing and start optimizing. Scan your resume and get instant insights.
          </p>
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg"
          >
            Scan Your Resume for Free
          </Button>
        </motion.section>
      </main>

      <NewFooter />
    </div>
  );
}
