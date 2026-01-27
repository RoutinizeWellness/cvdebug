/**
 * Advanced SEO Optimization System
 * Next-level SEO with schema markup, dynamic optimization, and performance
 */

interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  schema?: any;
  language?: string;
}

/**
 * Advanced SEO Manager with Schema.org support
 */
export class AdvancedSEO {
  private static instance: AdvancedSEO;

  private constructor() {}

  static getInstance(): AdvancedSEO {
    if (!AdvancedSEO.instance) {
      AdvancedSEO.instance = new AdvancedSEO();
    }
    return AdvancedSEO.instance;
  }

  /**
   * Set comprehensive meta tags
   */
  setMetaTags(config: SEOConfig): void {
    // Basic meta tags
    this.setTag('title', config.title);
    this.setMetaTag('description', config.description);
    this.setMetaTag('keywords', config.keywords.join(', '));

    // Canonical URL
    if (config.canonical) {
      this.setLinkTag('canonical', config.canonical);
    }

    // Open Graph tags
    this.setMetaTag('og:title', config.title, 'property');
    this.setMetaTag('og:description', config.description, 'property');
    this.setMetaTag('og:type', config.ogType || 'website', 'property');
    this.setMetaTag('og:url', config.canonical || window.location.href, 'property');

    if (config.ogImage) {
      this.setMetaTag('og:image', config.ogImage, 'property');
      this.setMetaTag('og:image:width', '1200', 'property');
      this.setMetaTag('og:image:height', '630', 'property');
    }

    // Twitter Card tags
    this.setMetaTag('twitter:card', config.twitterCard || 'summary_large_image');
    this.setMetaTag('twitter:title', config.title);
    this.setMetaTag('twitter:description', config.description);
    if (config.ogImage) {
      this.setMetaTag('twitter:image', config.ogImage);
    }

    // Author and timestamps
    if (config.author) {
      this.setMetaTag('author', config.author);
    }
    if (config.publishedTime) {
      this.setMetaTag('article:published_time', config.publishedTime, 'property');
    }
    if (config.modifiedTime) {
      this.setMetaTag('article:modified_time', config.modifiedTime, 'property');
    }

    // Schema.org structured data
    if (config.schema) {
      this.setStructuredData(config.schema);
    }
  }

  /**
   * Set title tag
   */
  private setTag(tag: string, content: string): void {
    const element = document.querySelector(tag) || document.createElement(tag);
    element.textContent = content;
    if (!element.parentNode) {
      document.head.appendChild(element);
    }
  }

  /**
   * Set meta tag
   */
  private setMetaTag(name: string, content: string, type: 'name' | 'property' = 'name'): void {
    const selector = `meta[${type}="${name}"]`;
    let element = document.querySelector(selector) as HTMLMetaElement;

    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(type, name);
      document.head.appendChild(element);
    }

    element.content = content;
  }

  /**
   * Set link tag
   */
  private setLinkTag(rel: string, href: string): void {
    const selector = `link[rel="${rel}"]`;
    let element = document.querySelector(selector) as HTMLLinkElement;

    if (!element) {
      element = document.createElement('link');
      element.rel = rel;
      document.head.appendChild(element);
    }

    element.href = href;
  }

  /**
   * Set structured data (Schema.org)
   */
  setStructuredData(schema: any): void {
    const scriptId = 'structured-data';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schema);
  }

  /**
   * Generate Organization schema
   */
  generateOrganizationSchema(data: {
    name: string;
    url: string;
    logo: string;
    description: string;
    sameAs?: string[];
  }): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: data.name,
      url: data.url,
      logo: {
        '@type': 'ImageObject',
        url: data.logo
      },
      description: data.description,
      sameAs: data.sameAs || []
    };
  }

  /**
   * Generate WebSite schema with search action
   */
  generateWebsiteSchema(data: {
    name: string;
    url: string;
    searchUrl?: string;
  }): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: data.name,
      url: data.url,
      potentialAction: data.searchUrl ? {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${data.searchUrl}?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      } : undefined
    };
  }

  /**
   * Generate Article schema
   */
  generateArticleSchema(data: {
    headline: string;
    image: string;
    author: string;
    publisher: string;
    publishedDate: string;
    modifiedDate?: string;
    description: string;
  }): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.headline,
      image: [data.image],
      author: {
        '@type': 'Person',
        name: data.author
      },
      publisher: {
        '@type': 'Organization',
        name: data.publisher
      },
      datePublished: data.publishedDate,
      dateModified: data.modifiedDate || data.publishedDate,
      description: data.description
    };
  }

  /**
   * Generate BreadcrumbList schema
   */
  generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    };
  }

  /**
   * Generate Product schema
   */
  generateProductSchema(data: {
    name: string;
    image: string;
    description: string;
    price: number;
    currency: string;
    availability: string;
    rating?: number;
    reviewCount?: number;
  }): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.name,
      image: [data.image],
      description: data.description,
      offers: {
        '@type': 'Offer',
        price: data.price,
        priceCurrency: data.currency,
        availability: `https://schema.org/${data.availability}`
      },
      aggregateRating: data.rating ? {
        '@type': 'AggregateRating',
        ratingValue: data.rating,
        reviewCount: data.reviewCount || 0
      } : undefined
    };
  }

  /**
   * Set language and hreflang tags
   */
  setLanguageTags(currentLang: string, alternates: Array<{ lang: string; url: string }>): void {
    // Set html lang attribute
    document.documentElement.lang = currentLang;

    // Remove existing hreflang tags
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

    // Add new hreflang tags
    alternates.forEach(alt => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = alt.lang;
      link.href = alt.url;
      document.head.appendChild(link);
    });
  }

  /**
   * Add preconnect and dns-prefetch for performance
   */
  addResourceHints(domains: string[]): void {
    domains.forEach(domain => {
      // Preconnect
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = domain;
      document.head.appendChild(preconnect);

      // DNS prefetch
      const dnsPrefetch = document.createElement('link');
      dnsPrefetch.rel = 'dns-prefetch';
      dnsPrefetch.href = domain;
      document.head.appendChild(dnsPrefetch);
    });
  }

  /**
   * Add preload for critical resources
   */
  preloadResources(resources: Array<{ href: string; as: string; type?: string }>): void {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) {
        link.type = resource.type;
      }
      document.head.appendChild(link);
    });
  }

  /**
   * Generate sitemap entry
   */
  generateSitemapEntry(url: string, priority: number = 0.8, changefreq: string = 'weekly'): string {
    const lastmod = new Date().toISOString().split('T')[0];
    return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }

  /**
   * Optimize images for SEO
   */
  optimizeImages(): void {
    document.querySelectorAll('img:not([alt])').forEach(img => {
      console.warn('Image missing alt text:', img.getAttribute('src'));
    });

    document.querySelectorAll('img[loading]').forEach(img => {
      if (!img.getAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }

  /**
   * Add FAQ schema
   */
  generateFAQSchema(faqs: Array<{ question: string; answer: string }>): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }

  /**
   * Generate SoftwareApplication schema
   */
  generateSoftwareSchema(data: {
    name: string;
    description: string;
    price: string;
    category: string;
    operatingSystem: string;
    rating?: number;
  }): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: data.name,
      description: data.description,
      applicationCategory: data.category,
      operatingSystem: data.operatingSystem,
      offers: {
        '@type': 'Offer',
        price: data.price
      },
      aggregateRating: data.rating ? {
        '@type': 'AggregateRating',
        ratingValue: data.rating,
        bestRating: '5'
      } : undefined
    };
  }
}

// Global SEO instance
export const advancedSEO = AdvancedSEO.getInstance();

/**
 * React hook for SEO
 */
export function useAdvancedSEO(config: SEOConfig) {
  const seo = AdvancedSEO.getInstance();

  // Set meta tags on mount and update
  if (typeof window !== 'undefined') {
    seo.setMetaTags(config);
  }

  return seo;
}
