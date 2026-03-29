import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/SEO';
import Loader from '../../components/Loader';
import './Blog.css';

// Default blog posts for demo/fallback
const defaultPosts = [
  {
    id: 1,
    title: 'Building Scalable React Applications',
    excerpt: 'Learn the best practices for structuring large-scale React applications with proper state management and component architecture.',
    slug: 'building-scalable-react-apps',
    published_at: '2026-03-15',
    reading_time: 8,
    tags: ['React', 'Architecture', 'Best Practices'],
    cover_image: null,
  },
  {
    id: 2,
    title: 'The Future of Web Development in 2026',
    excerpt: 'Exploring emerging trends and technologies that are shaping the future of web development.',
    slug: 'future-of-web-development-2026',
    published_at: '2026-03-01',
    reading_time: 5,
    tags: ['Web Dev', 'Trends', 'Technology'],
    cover_image: null,
  },
  {
    id: 3,
    title: 'Mastering TypeScript for Production',
    excerpt: 'A comprehensive guide to using TypeScript effectively in production applications.',
    slug: 'mastering-typescript-production',
    published_at: '2026-02-20',
    reading_time: 12,
    tags: ['TypeScript', 'JavaScript', 'Tutorial'],
    cover_image: null,
  },
];

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const BlogCard = ({ post, index }) => (
  <article 
    className="blog-card glass animate-slide-up"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    {post.cover_image && (
      <div className="blog-card-image">
        <img src={post.cover_image} alt="" loading="lazy" />
      </div>
    )}
    <div className="blog-card-content">
      <div className="blog-card-meta">
        <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
        <span className="blog-card-reading-time">{post.reading_time} min read</span>
      </div>
      <h2 className="blog-card-title">
        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>
      <p className="blog-card-excerpt">{post.excerpt}</p>
      <div className="blog-card-tags">
        {post.tags?.map((tag) => (
          <span key={tag} className="blog-card-tag">{tag}</span>
        ))}
      </div>
      <Link to={`/blog/${post.slug}`} className="blog-card-link">
        Read Article <span aria-hidden="true">→</span>
      </Link>
    </div>
  </article>
);

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data?.length > 0 ? data : defaultPosts);
    } catch (err) {
      console.error('Error fetching posts:', err.message);
      setPosts(defaultPosts);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Blog"
        description="Thoughts, tutorials, and insights on web development, technology, and design."
        url="/blog"
      />
      <div className="blog-container">
        <header className="blog-header">
          <h1 className="blog-title animate-slide-up">The Journal</h1>
          <p className="blog-subtitle animate-fade-in">
            Thoughts, tutorials, and insights on web development, technology, and design.
          </p>
        </header>

        {loading ? (
          <Loader />
        ) : (
          <div className="blog-grid">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))
            ) : (
              <div className="blog-empty">
                No posts yet. Check back soon!
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;
