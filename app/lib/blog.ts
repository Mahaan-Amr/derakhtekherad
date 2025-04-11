import prisma from '@/lib/db';

export interface BlogPost {
  id: string;
  title: string;
  titleFa: string;
  slug: string;
  excerpt: string;
  excerptFa: string;
  content: string;
  contentFa: string;
  author: string;
  authorImage?: string;
  category: string;
  categoryFa: string;
  publishDate: string;
  isPublished: boolean;
  thumbnailUrl: string;
}

// Define the Prisma BlogPost type based on the schema
type PrismaBlogPost = {
  id: string;
  title: string;
  titleFa: string;
  slug: string;
  excerpt: string;
  excerptFa: string;
  content: string;
  contentFa: string;
  author: string;
  authorImage: string | null;
  category: string;
  categoryFa: string;
  publishDate: Date;
  isPublished: boolean;
  thumbnailUrl: string;
  adminId: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function getLatestBlogPosts(limit = 2): Promise<BlogPost[]> {
  try {
    // Use direct SQL query to get blog posts
    const result = await prisma.$queryRaw`
      SELECT * FROM "BlogPost"
      WHERE "isPublished" = true
      ORDER BY "publishDate" DESC
      LIMIT ${limit}
    `;
    
    // Convert raw query result to BlogPost type
    const posts = result as unknown as PrismaBlogPost[];
    
    console.log("Raw BlogPost data:", posts);

    return posts.map((post: PrismaBlogPost) => ({
      id: post.id,
      title: post.title,
      titleFa: post.titleFa,
      slug: post.slug,
      excerpt: post.excerpt,
      excerptFa: post.excerptFa,
      content: post.content,
      contentFa: post.contentFa,
      author: post.author,
      authorImage: post.authorImage || undefined,
      category: post.category,
      categoryFa: post.categoryFa,
      publishDate: post.publishDate.toISOString(),
      isPublished: post.isPublished,
      thumbnailUrl: post.thumbnailUrl || '/images/blog-placeholder.jpg'
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Use direct SQL query to get blog post by slug
    const result = await prisma.$queryRaw`
      SELECT * FROM "BlogPost"
      WHERE "slug" = ${slug}
      LIMIT 1
    `;
    
    const posts = result as unknown as PrismaBlogPost[];
    
    if (!posts || posts.length === 0) {
      return null;
    }
    
    const post = posts[0];

    return {
      id: post.id,
      title: post.title,
      titleFa: post.titleFa,
      slug: post.slug,
      excerpt: post.excerpt,
      excerptFa: post.excerptFa,
      content: post.content,
      contentFa: post.contentFa,
      author: post.author,
      authorImage: post.authorImage || undefined,
      category: post.category,
      categoryFa: post.categoryFa,
      publishDate: post.publishDate.toISOString(),
      isPublished: post.isPublished,
      thumbnailUrl: post.thumbnailUrl || '/images/blog-placeholder.jpg'
    };
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
} 