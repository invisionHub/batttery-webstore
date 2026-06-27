import React from 'react';
import Link from 'next/link';
import { mockBlogPosts } from '@/lib/mock-data';

const colors = {
  primary: '#22C55E',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  textMuted: '#94A3B8',
  cardBg: '#1E3448',
};

const BlogSection: React.FC = () => (
  <section style={{ backgroundColor: colors.secondary, paddingTop: '48px', paddingBottom: '48px' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: colors.white, margin: 0 }}>
            From Our Blog
          </h2>
          <div
            style={{
              width: '40px',
              height: '3px',
              backgroundColor: colors.primary,
              borderRadius: '2px',
              marginTop: '6px',
            }}
          />
        </div>
        <Link
          href="/blog"
          style={{
            color: colors.primary,
            fontSize: '13px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          View All Posts →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {mockBlogPosts.map((post) => (
          <div
            key={post.id}
            className="flex flex-col rounded-xl overflow-hidden"
            style={{ backgroundColor: colors.cardBg }}
          >
            {/* Image */}
            <div
              style={{ height: '160px', backgroundColor: colors.secondary, position: 'relative' }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: colors.primary,
                  color: colors.white,
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                {post.category}
              </span>
              <div className="w-full h-full flex items-center justify-center">
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    stroke={colors.cardBg}
                    strokeWidth="1.5"
                  />
                  <circle cx="8.5" cy="8.5" r="1.5" stroke={colors.textMuted} strokeWidth="1.5" />
                  <path
                    d="M21 15l-5-5L5 21"
                    stroke={colors.textMuted}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            {/* Content */}
            <div className="flex flex-col gap-3 flex-1" style={{ padding: '16px' }}>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '11px', color: colors.textMuted }}>{post.date}</span>
                <span style={{ color: colors.textMuted }}>·</span>
                <span style={{ fontSize: '11px', color: colors.primary }}>{post.readTime}</span>
              </div>
              <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: colors.white,
                    lineHeight: 1.4,
                    margin: 0,
                  }}
                >
                  {post.title}
                </h3>
              </Link>
              <p
                style={{ fontSize: '12px', color: colors.textMuted, lineHeight: 1.6, margin: 0 }}
                className="line-clamp-2"
              >
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: colors.primary,
                  textDecoration: 'none',
                  marginTop: 'auto',
                }}
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BlogSection;
