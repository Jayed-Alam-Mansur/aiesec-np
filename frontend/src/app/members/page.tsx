
import { Button } from '@/components/ui/button';
import { apiFetch, MOCK_TESTIMONIALS, Testimonial } from '@/lib/api';
import { TestimonialCarousel } from '@/components/sections/testimonial-carousel';
import { UserPlus, Star, Heart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function MembersPage() {
  let testimonials: Testimonial[] = MOCK_TESTIMONIALS;
  try {
    testimonials = await apiFetch<Testimonial[]>('/testimonials').catch(() => MOCK_TESTIMONIALS);
  } catch (e) {
    console.error("Testimonial fetch failed");
  }

  return (
    <div className="flex flex-col w-full">
      <section className="bg-accent py-24 text-white text-center">
        <div className="container mx-auto px-4 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">Be Part of the Network</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90 leading-relaxed font-medium">
            Join the world's largest youth-led organization and develop the skills you need to lead in the 21st century.
          </p>
          <div className="pt-8">
            <Link href="/form?type=member">
              <Button size="lg" className="bg-white text-accent hover:bg-slate-100 font-bold px-12 py-8 rounded-full text-xl">Join AIESEC Nepal</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-bold font-headline">What You Gain</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Being an AIESECer is more than just a membership. It's a transformative journey.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-6 p-8 rounded-2xl bg-slate-50 border-b-4 border-primary">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto"><Star size={32} /></div>
              <h3 className="text-2xl font-bold font-headline">Skill Development</h3>
              <p className="text-muted-foreground">Master project management, sales, marketing, and leadership through practical roles.</p>
            </div>
            <div className="text-center space-y-6 p-8 rounded-2xl bg-slate-50 border-b-4 border-secondary">
              <div className="h-16 w-16 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mx-auto"><TrendingUp size={32} /></div>
              <h3 className="text-2xl font-bold font-headline">Career Network</h3>
              <p className="text-muted-foreground">Connect with global partners and fellow youth leaders from across the globe.</p>
            </div>
            <div className="text-center space-y-6 p-8 rounded-2xl bg-slate-50 border-b-4 border-accent">
              <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto"><Heart size={32} /></div>
              <h3 className="text-2xl font-bold font-headline">Global Family</h3>
              <p className="text-muted-foreground">Find a community that shares your values and supports your personal growth.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-headline">Member Experiences</h2>
          </div>
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>
    </div>
  );
}
