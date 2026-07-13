'use client';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, Tag } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { blogApi } from '@/lib/api';
import { formatRelativeDate } from '@/lib/utils';

const CATEGORIES = [
  { value: '', label: 'All posts' },
  { value: 'buying-guide', label: 'Buying Guide' },
  { value: 'selling-guide', label: 'Selling Guide' },
  { value: 'market-analysis', label: 'Market Analysis' },
  { value: 'investment', label: 'Investment' },
];

export default function BlogPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['blog'],
    queryFn: () => blogApi.getAll({ limit: 12 }).then(r => r.data),
  });
  const posts = data?.posts || [];

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <div className="bg-primary-50 dark:bg-primary-950/30 py-12">
          <div className="container-page text-center">
            <h1 className="font-display font-bold text-3xl lg:text-4xl text-neutral-900 dark:text-white mb-3">Real Estate Insights</h1>
            <p className="text-neutral-600 dark:text-neutral-400">Guides, analysis, and news about Kosovo's property market</p>
          </div>
        </div>
        <div className="container-page py-10">
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(c => (
              <button key={c.value} className="px-4 py-2 rounded-full text-sm font-medium border border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:border-primary-500 hover:text-primary-600 transition-colors">
                {c.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({length:6}).map((_,i)=><div key={i} className="card"><div className="skeleton aspect-[16/10]" /><div className="p-5 space-y-3"><div className="skeleton h-4 w-20" /><div className="skeleton h-5 w-full" /><div className="skeleton h-4 w-3/4" /></div></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="card-hover block">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {post.coverImage ? <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="33vw" /> : <div className="w-full h-full bg-neutral-200 dark:bg-neutral-700" />}
                    <span className="absolute top-3 left-3 badge bg-white/95 text-primary-700">{post.category}</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.publishedAt ? formatRelativeDate(post.publishedAt) : ''}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{post.viewCount}</span>
                    </div>
                    <h2 className="font-display font-semibold text-neutral-900 dark:text-white line-clamp-2 mb-2">{post.title}</h2>
                    {post.excerpt && <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">{post.excerpt}</p>}
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {post.tags.slice(0,3).map((tag: string) => <span key={tag} className="badge-gray text-[10px]"><Tag className="w-2.5 h-2.5" />{tag}</span>)}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
