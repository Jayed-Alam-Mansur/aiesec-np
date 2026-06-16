
import { apiFetch, Post } from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const CATEGORIES = ['Member', 'Events', 'Exchange', 'Impact'];

export default async function BlogPage({ searchParams }: { searchParams: { category?: string } }) {
  const currentCategory = searchParams.category || 'All';
  
  // Mock data fallback
  const MOCK_POSTS: Post[] = [
    { id: '1', title: 'How My Exchange Changed My Career', category: 'Exchange', content: '...', imageUrl: 'https://picsum.photos/seed/blog1/800/600', createdAt: new Date().toISOString() },
    { id: '2', title: 'Local Committee Summit 2024', category: 'Events', content: '...', imageUrl: 'https://picsum.photos/seed/blog2/800/600', createdAt: new Date().toISOString() },
    { id: '3', title: 'Member Spotlight: Anish from Kathmandu', category: 'Member', content: '...', imageUrl: 'https://picsum.photos/seed/blog3/800/600', createdAt: new Date().toISOString() },
    { id: '4', title: 'Climate Action in Nepal: Our Impact', category: 'Impact', content: '...', imageUrl: 'https://picsum.photos/seed/blog4/800/600', createdAt: new Date().toISOString() },
  ];

  let posts: Post[] = MOCK_POSTS;
  try {
    const query = searchParams.category ? `?category=${searchParams.category}` : '';
    posts = await apiFetch<Post[]>(`/posts${query}`).catch(() => MOCK_POSTS);
  } catch (e) {
    console.error("Blog fetch failed");
  }

  const filteredPosts = currentCategory === 'All' 
    ? posts 
    : posts.filter(p => p.category === currentCategory);

  return (
    <div className="flex flex-col w-full py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline">Latest Stories</h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Stay updated with the latest news, events, and impact stories from AIESEC Nepal.
            </p>
          </div>
          
          <Tabs defaultValue={currentCategory} className="w-full md:w-auto">
            <TabsList className="bg-slate-100 p-1">
              <Link href="/blog"><TabsTrigger value="All" className="px-6">All</TabsTrigger></Link>
              {CATEGORIES.map(cat => (
                <Link key={cat} href={`/blog?category=${cat}`}>
                  <TabsTrigger value={cat} className="px-6">{cat}</TabsTrigger>
                </Link>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden group hover:shadow-2xl transition-all border-none shadow-lg">
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge className="absolute top-4 left-4 bg-white/90 text-primary border-none">{post.category}</Badge>
              </div>
              <CardHeader className="p-6 pb-2">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> 5 min read</span>
                </div>
                <h3 className="text-xl font-bold font-headline leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
                  {post.content}
                </p>
                <Link href="#" className="inline-flex items-center text-primary font-bold text-sm">
                  Read More <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
