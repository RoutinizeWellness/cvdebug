import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewFooter } from "@/components/landing/NewFooter";
import { Calendar, Clock, ArrowLeft, Eye, Share2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { updatePageSEO } from "@/lib/seo";
import { toast } from "sonner";

export default function BlogPost() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const post = useQuery(api.blog.getPostBySlug, slug ? { slug } : "skip");
  const recentPosts = useQuery(api.blog.getRecentPosts, { limit: 3 });
  const incrementViews = useMutation(api.blog.incrementViews);

  useEffect(() => {
    if (post && post._id) {
      // Increment view count
      incrementViews({ postId: post._id }).catch(console.error);

      // Update SEO
      updatePageSEO({
        title: post.metaTitle || `${post.title} | CVDebug Blog`,
        description: post.metaDescription || post.excerpt,
        keywords: post.keywords,
        canonical: post.canonicalUrl || `https://cvdebug.com/blog/${post.slug}`,
      });
    }
  }, [post, incrementViews]);

  const handleShare = () => {
    const url = `https://cvdebug.com/blog/${slug}`;
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-900 text-xl">Loading post...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "author": {
            "@type": "Person",
            "name": post.author
          },
          "datePublished": post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
          "image": post.featuredImage,
          "publisher": {
            "@type": "Organization",
            "name": "CVDebug",
            "logo": {
              "@type": "ImageObject",
              "url": "https://harmless-tapir-303.convex.cloud/api/storage/4f836582-7336-4306-8004-211fad87218f"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://cvdebug.com/blog/${post.slug}`
          }
        })}
      </script>

      <NewNavbar />

      <main className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="mb-8 text-gray-600 hover:text-gray-900"
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
        >
          <header className="mb-12">
            <span className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-semibold mb-6">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex items-center justify-between flex-wrap gap-4 py-6 border-y border-gray-200">
              <div className="flex items-center gap-6 flex-wrap text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time>
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Recently'}
                  </time>
                </div>
                {post.readingTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readingTime} min read</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{post.views || 0} views</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="text-gray-600 hover:text-gray-900 border-gray-300"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-12 rounded-xl overflow-hidden border border-gray-200">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none mb-12 text-gray-800"
            style={{
              color: '#1f2937',
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap mb-12 pb-8 border-b border-gray-200">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 font-semibold text-sm">Tags:</span>
              {post.tags.map((tag: any, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Author Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-2">About the Author</h3>
            <p className="text-gray-700">
              Written by <span className="text-blue-600 font-semibold">{post.author}</span>
            </p>
          </div>
        </motion.article>

        {/* Related Posts */}
        {recentPosts && recentPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">More Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recentPosts.filter((p: any) => p.slug !== post.slug).slice(0, 3).map((relatedPost: any) => (
                <motion.div
                  key={relatedPost.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                  className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  <span className="inline-block px-3 py-1 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-xs font-semibold mb-3">
                    {relatedPost.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-12 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Optimize Your Resume?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Get instant ATS analysis and actionable feedback in seconds.
          </p>
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg font-bold rounded-lg shadow-lg"
          >
            Scan Your Resume for Free
          </Button>
        </motion.section>
      </main>

      <NewFooter />
    </div>
  );
}
