
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_PROGRAMS } from '@/lib/api';
import { CheckCircle2, Globe, GraduationCap, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  return (
    <div className="flex flex-col w-full">
      <section className="bg-slate-900 py-24 text-white">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">Experience the World</h1>
          <p className="text-xl max-w-2xl mx-auto text-slate-400">
            Our exchange programs are designed to push you out of your comfort zone and develop leadership skills through practical experiences.
          </p>
        </div>
      </section>

      {MOCK_PROGRAMS.map((program, index) => (
        <section key={program.id} className={`py-24 ${index % 2 === 1 ? 'bg-slate-50' : 'bg-white'}`}>
          <div className="container mx-auto px-4">
            <div className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-16 items-center`}>
              <div className="md:w-1/2 relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={`https://picsum.photos/seed/${program.id}/800/600`}
                  alt={program.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="md:w-1/2 space-y-8">
                <Badge style={{ backgroundColor: program.color }} className="text-white border-none py-1 px-4 text-sm font-bold uppercase tracking-widest">
                  {program.name}
                </Badge>
                <h2 className="text-4xl font-bold font-headline">{program.name === 'Global Volunteer' ? 'Volunteer for the Global Goals' : program.name === 'Global Talent' ? 'Gain Professional International Experience' : 'Teach Overseas and Make an Impact'}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {program.description} Join a network of thousands of young people who have taken the leap to travel, learn, and grow through this unique opportunity.
                </p>
                <div className="space-y-4">
                  {[
                    "Cross-cultural preparation",
                    "Leadership development framework",
                    "Logistical support from AIESEC",
                    "Authentic local experience"
                  ].map((benefit) => (
                    <div key={benefit} className="flex gap-3 items-center">
                      <CheckCircle2 className="text-primary h-5 w-5" />
                      <span className="font-medium text-slate-700">{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-6">
                  <Link href={`/form?type=exchange&program=${program.id}`}>
                    <Button size="lg" style={{ backgroundColor: program.color }} className="text-white px-10 py-7 text-lg rounded-full">Apply for {program.name}</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA section */}
      <section className="py-24 bg-primary text-white text-center">
        <div className="container mx-auto px-4 space-y-8">
          <h2 className="text-4xl font-bold font-headline">Not sure which one is right for you?</h2>
          <p className="text-xl text-primary-foreground/80 max-w-xl mx-auto">Try our AI-powered matcher tool to find your perfect exchange experience.</p>
          <Link href="/form?type=exchange">
            <Button size="lg" className="bg-white text-primary hover:bg-slate-100 font-bold px-12 py-8 rounded-full text-xl">Get Started</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
