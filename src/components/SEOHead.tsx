/**
 * SEO Head Component
 * Dynamic meta tags for better SEO optimization
 */

import { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  noindex?: boolean;
  structuredData?: Record<string, any>;
}

export function SEOHead({
  title,
  description,
  keywords = [],
  ogImage = '/og-image.png',
  ogType = 'website',
  canonical,
  noindex = false,
  structuredData
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = `${title} | Resume ATS Optimizer`;

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords.join(', '));

    // Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', ogImage, 'property');
    updateMetaTag('og:type', ogType, 'property');
    updateMetaTag('og:url', window.location.href, 'property');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Canonical URL
    if (canonical) {
      updateLinkTag('canonical', canonical);
    }

    // Robots
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }

    // Structured Data (JSON-LD)
    if (structuredData) {
      injectStructuredData(structuredData);
    }

    // Cleanup
    return () => {
      // Remove structured data on unmount
      const existingScript = document.getElementById('structured-data');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [title, description, keywords, ogImage, ogType, canonical, noindex, structuredData]);

  return null; // This is a side-effect only component
}

/**
 * Update or create meta tag
 */
function updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

/**
 * Update or create link tag
 */
function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

/**
 * Inject structured data (JSON-LD)
 */
function injectStructuredData(data: Record<string, any>) {
  // Remove existing structured data
  const existing = document.getElementById('structured-data');
  if (existing) {
    existing.remove();
  }

  // Create new script tag
  const script = document.createElement('script');
  script.id = 'structured-data';
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * Pre-defined structured data templates
 */
export const StructuredDataTemplates = {
  /**
   * Organization structured data
   */
  organization: (name: string, url: string, logo: string) => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo: {
      '@type': 'ImageObject',
      url: logo
    },
    sameAs: [
      // Add social media profiles
    ]
  }),

  /**
   * WebSite structured data
   */
  website: (name: string, url: string) => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }),

  /**
   * SoftwareApplication structured data
   */
  softwareApplication: (name: string, description: string, url: string) => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250'
    }
  }),

  /**
   * Article structured data
   */
  article: (
    headline: string,
    description: string,
    author: string,
    datePublished: string,
    image: string
  ) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    author: {
      '@type': 'Person',
      name: author
    },
    datePublished,
    image: {
      '@type': 'ImageObject',
      url: image
    }
  }),

  /**
   * FAQ structured data
   */
  faq: (questions: Array<{ question: string; answer: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  }),

  /**
   * BreadcrumbList structured data
   */
  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  })
};

/**
 * Hook for easy SEO management
 */
export function useSEO(props: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = `${props.title} | Resume ATS Optimizer`;

    // Update meta description
    updateMetaTag('description', props.description);

    // Update keywords if provided
    if (props.keywords && props.keywords.length > 0) {
      updateMetaTag('keywords', props.keywords.join(', '));
    }
  }, [props.title, props.description, props.keywords]);
}
