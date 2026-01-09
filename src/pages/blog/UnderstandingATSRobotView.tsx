import { BlogPost as BlogPostComponent } from "@/components/blog/BlogPost";
import { getBlogPost, getRelatedBlogPosts } from "@/data/blogPosts/blogContent";

export default function UnderstandingATSRobotView() {
  const post = getBlogPost("understanding-ats-robot-view");

  if (!post) {
    return <div>Post not found</div>;
  }

  const relatedPosts = getRelatedBlogPosts(post.slug);

  return <BlogPostComponent post={post} relatedPosts={relatedPosts} />;
}
