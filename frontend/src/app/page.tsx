
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, Globe, Building2, CheckCircle2 } from 'lucide-react';
import { apiFetch, MOCK_PROGRAMS, MOCK_TESTIMONIALS, MOCK_LCS, Program, Testimonial, LCStats } from '@/lib/api';
import { TestimonialCarousel } from '@/components/sections/testimonial-carousel';

export default async function HomePage() {
  // Parallel fetching for performance
  let data: { programs: Program[], testimonials: Testimonial[], stats: LCStats | null } = {
    programs: MOCK_PROGRAMS,
    testimonials: MOCK_TESTIMONIALS,
    stats: { totalLCs: 6, totalMembers: 500, activeExchanges: 120 }
  };

  try {
    const [programs, testimonials, stats] = await Promise.all([
      apiFetch<Program[]>('/programs').catch(() => MOCK_PROGRAMS),
      apiFetch<Testimonial[]>('/testimonials').catch(() => MOCK_TESTIMONIALS),
      apiFetch<LCStats>('/lcs/stats').catch(() => ({ totalLCs: 6, totalMembers: 500, activeExchanges: 120 })),
    ]);
    data = { programs, testimonials, stats };
  } catch (e) {
    console.error("Home page data fetch failed, using fallback mock data.");
  }

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://picsum.photos/seed/aiesec_hero/1920/1080"
          alt="Youth Leadership"
          fill
          priority
          className="object-cover brightness-[0.4]"
          data-ai-hint="youth leadership"
        />
        <div className="container relative z-10 px-4 text-center text-white space-y-6">
          <Badge className="bg-primary text-white border-none py-1.5 px-4 mb-4 uppercase tracking-widest text-xs">AIESEC Nepal</Badge>
          <h1 className="text-5xl md:text-7xl font-bold font-headline leading-tight max-w-4xl mx-auto">
            Where <span className="text-primary italic">Impact</span> Meets Adventure
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-medium">
            Develop your leadership potential through our international exchange and volunteer programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/form?type=exchange">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-7 rounded-full">Explore Opportunities</Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 text-lg px-8 py-7 rounded-full">Who We Are</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Program Cards */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold font-headline">Join Our Programs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Choose from a variety of programs designed to challenge you and create lasting global impact.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.programs.map((program) => (
              <Card key={program.id} className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="h-2 w-full" style={{ backgroundColor: program.color }} />
                <CardContent className="p-8 space-y-6">
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: program.color }}>
                    {program.id === 'gv' ? <Globe size={24} /> : program.id === 'gt' ? <Building2 size={24} /> : <Users size={24} />}
                  </div>
                  <h3 className="text-2xl font-bold font-headline">{program.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">{program.description}</p>
                  <Link href={`/form?type=exchange&program=${program.id}`} className="inline-flex items-center text-primary font-bold group-hover:gap-3 transition-all">
                    Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-primary font-headline">{data.stats?.totalLCs}+</p>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Local Committees</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-secondary font-headline">{data.stats?.totalMembers}+</p>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Active Members</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-accent font-headline">{data.stats?.activeExchanges}+</p>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Annual Exchanges</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-primary font-headline">120+</p>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Countries Reached</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 space-y-8">
              <h2 className="text-4xl font-bold font-headline leading-tight">Your Leadership Journey Starts Here</h2>
              <p className="text-lg text-muted-foreground">We provide a structured path for you to discover your strengths and develop global leadership skills.</p>
              <div className="space-y-4">
                {[
                  { step: "01", title: "Search Opportunities", desc: "Find a program that matches your interests and skills." },
                  { step: "02", title: "Quick Application", desc: "Submit your profile and preferences via our dynamic form." },
                  { step: "03", title: "Selection & Interview", desc: "Engage with our team for a personalized selection process." },
                  { step: "04", title: "Go Abroad", desc: "Begin your life-changing experience with AIESEC support." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-6 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                    <span className="text-2xl font-bold text-primary/30">{item.step}</span>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://picsum.photos/seed/aiesec_journey/800/1200"
                alt="Journey"
                fill
                className="object-cover"
                data-ai-hint="youth travel"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-primary text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-headline mb-4">Hear From Our Members</h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto">Real stories from youth leaders who changed their lives through AIESEC Nepal.</p>
          </div>
          <TestimonialCarousel testimonials={data.testimonials} />
        </div>
      </section>

      {/* Partner logos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-12">Our Strategic Partners</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-32 relative grayscale hover:grayscale-0 transition-all cursor-pointer">
                <Image src={`https://picsum.photos/seed/logo${i}/300/150`} alt="Partner" fill className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl font-bold font-headline">Ready to take the first step?</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Join the largest youth-led organization in the world and start your leadership journey today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/members">
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-10">Become a Member</Button>
            </Link>
            <Link href="/partners">
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 px-10">Partner with Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
