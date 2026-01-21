import { useParams, Link, Navigate } from "react-router";
import { motion } from "framer-motion";
import { getPostBySlug, getAllPosts } from "@/data/blogPosts";
import { Clock, Calendar, Tag, ArrowLeft, Share2, Twitter, Linkedin, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { Helmet } from "react-helmet-async";

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/blog" replace />;
  }

  const post = getPostBySlug(slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  const shareUrl = `https://cvdebug.com/blog/${post.slug}`;
  const shareText = post.title;

  return (
    <>
      <Helmet>
        <title>{post.title} | CVDebug Blog</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={post.seoKeywords.join(', ')} />

        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        {post.featuredImage && <meta property="og:image" content={post.featuredImage} />}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />
        {post.featuredImage && <meta name="twitter:image" content={post.featuredImage} />}

        {/* Article metadata */}
        <meta property="article:published_time" content={post.publishedAt} />
        {post.updatedAt && <meta property="article:modified_time" content={post.updatedAt} />}
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#FFFFFF]">
        {/* Back Button */}
        <div className="pt-24 pb-8 px-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog">
              <Button variant="ghost" className="gap-2 text-[#475569] hover:text-[#0F172A]">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>

        {/* Article Header */}
        <article className="pb-24 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block bg-[#3B82F6] text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-[#64748B] mb-8 pb-8 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center text-white font-bold">
                    CV
                  </div>
                  <span className="font-medium text-[#0F172A]">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime} read</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 text-sm bg-[#F1F5F9] text-[#475569] px-3 py-1.5 rounded-lg font-medium"
                  >
                    <Tag className="h-3.5 w-3.5" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-3 mb-12">
                <span className="text-sm font-semibold text-[#64748B]">Share:</span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#165ec4] transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    alert('Link copied to clipboard!');
                  }}
                  className="p-2 bg-[#E2E8F0] text-[#475569] rounded-lg hover:bg-[#CBD5E1] transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-[#0F172A] prose-p:text-[#475569] prose-a:text-[#3B82F6] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#0F172A] prose-code:text-[#EF4444] prose-code:bg-[#FEF2F2] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#0F172A] prose-pre:text-[#F8FAFC] prose-ul:text-[#475569] prose-ol:text-[#475569]">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-2xl p-8 sm:p-12 text-center"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Fix Your Resume?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Scan your resume with CVDebug's AI-powered ATS checker. Get your score in 30 seconds.
              </p>
              <Link to="/dashboard">
                <Button className="h-14 px-8 text-lg font-bold bg-white text-[#3B82F6] hover:bg-[#F8FAFC]">
                  Scan Your Resume - Free
                </Button>
              </Link>
            </motion.div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-24">
                <h2 className="text-3xl font-bold text-[#0F172A] mb-8">Related Articles</h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {relatedPosts.map(relatedPost => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug}`}
                      className="group bg-white rounded-xl border border-[#E2E8F0] p-6 hover:shadow-lg transition-all"
                    >
                      <h3 className="text-lg font-bold text-[#0F172A] mb-2 group-hover:text-[#3B82F6] transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-[#64748B] mb-3 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <span className="text-sm font-semibold text-[#3B82F6] flex items-center gap-1">
                        Read More
                        <ArrowLeft className="h-3 w-3 rotate-180" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </>
  );
}

export default BlogPost;