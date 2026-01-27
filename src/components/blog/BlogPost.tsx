import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { BlogPost as BlogPostType } from "@/data/blogPosts/blogContent";
import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewFooter } from "@/components/landing/NewFooter";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPostProps {
  post: BlogPostType;
  relatedPosts: BlogPostType[];
}

export function BlogPost({ post, relatedPosts }: BlogPostProps) {
  const navigate = useNavigate();

  const renderContent = () => {
    return post.content.map((section, index) => {
      switch (section.type) {
        case 'heading':
          const headingLevel = section.level || 2;
          const headingClasses = headingLevel === 2
            ? "text-3xl font-bold mt-12 mb-6 text-white"
            : "text-2xl font-semibold mt-8 mb-4 text-slate-200";

          if (headingLevel === 2) {
            return (
              <h2 key={index} className={headingClasses}>
                {section.content}
              </h2>
            );
          } else {
            return (
              <h3 key={index} className={headingClasses}>
                {section.content}
              </h3>
            );
          }

        case 'paragraph':
          return (
            <p key={index} className="text-slate-300 text-lg leading-relaxed mb-6">
              {section.content}
            </p>
          );

        case 'list':
          return (
            <ul key={index} className="space-y-3 mb-6 ml-6">
              {section.items?.map((item, idx) => (
                <li key={idx} className="text-slate-300 text-lg leading-relaxed list-disc">
                  {item}
                </li>
              ))}
            </ul>
          );

        case 'quote':
          return (
            <blockquote key={index} className="border-l-4 border-[#1E293B] pl-6 py-4 my-8 bg-slate-800/50 rounded-r-lg">
              <p className="text-slate-200 text-lg italic leading-relaxed">
                {section.content}
              </p>
            </blockquote>
          );

        case 'cta':
          return (
            <div key={index} className="my-12 p-8 bg-gradient-to-r from-[#0F172A]/20 to-[#0F172A]/20 border border-[#1E293B]/30 rounded-xl text-center">
              <p className="text-xl text-white font-semibold mb-4">
                {section.content}
              </p>
              <Button
                onClick={() => navigate('/')}
                size="lg"
                className="bg-[#0F172A] hover:bg-[#0F172A] text-white px-8 py-6 text-lg"
              >
                Scan Your Resume Now
              </Button>
            </div>
          );

        case 'image':
          return (
            <div key={index} className="my-8">
              <img
                src={section.content}
                alt={section.alt || ''}
                className="w-full rounded-lg border border-slate-700"
              />
            </div>
          );

        default:
          return null;
      }
    });
  };

  return (
    <div className="dark min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <NewNavbar />

      <main className="container max-w-4xl mx-auto px-4 py-12">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="mb-8 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </motion.div>

        {/* Article Header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-[#0F172A]/20 border border-[#1E293B]/30 rounded-full text-[#94A3B8] text-sm">
                {post.category}
              </span>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.publishDate}>
                  {new Date(post.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime}</span>
              </div>
            </div>

            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed mb-6">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-slate-400" />
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-slate-800 rounded text-slate-300 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg prose-invert max-w-none">
            {renderContent()}
          </div>

          {/* Author info */}
          <div className="mt-12 pt-8 border-t border-slate-800">
            <p className="text-slate-400">
              Written by <span className="text-white font-semibold">{post.author}</span>
            </p>
            {post.lastUpdated !== post.publishDate && (
              <p className="text-slate-500 text-sm mt-2">
                Last updated: {new Date(post.lastUpdated).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
        </motion.article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 pt-12 border-t border-slate-800"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                  className="glass-panel rounded-xl p-6 cursor-pointer hover:border-[#1E293B]/50 transition-all"
                >
                  <span className="text-xs text-[#94A3B8] font-semibold">
                    {relatedPost.category}
                  </span>
                  <h3 className="text-lg font-semibold text-white mt-2 mb-3 line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                    {relatedPost.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{relatedPost.readingTime}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 p-12 bg-gradient-to-r from-[#0F172A]/10 to-[#0F172A]/10 border border-[#1E293B]/20 rounded-2xl text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Optimize Your Resume?
          </h2>
          <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto">
            See exactly how ATS systems parse your resume and get actionable insights in seconds.
          </p>
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="bg-[#0F172A] hover:bg-[#0F172A] text-white px-10 py-6 text-lg"
          >
            Scan Your Resume for Free
          </Button>
        </motion.section>
      </main>

      <NewFooter />
    </div>
  );
}
