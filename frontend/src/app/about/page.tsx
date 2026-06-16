
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiFetch, MOCK_LCS, LC } from '@/lib/api';
import { Building2, Calendar, Users, Award, Globe } from 'lucide-react';

export default async function AboutPage() {
  let lcs: LC[] = MOCK_LCS;
  try {
    lcs = await apiFetch<LC[]>('/lcs').catch(() => MOCK_LCS);
  } catch (e) {
    console.error("Failed to fetch LCs");
  }

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="bg-primary py-24 text-white">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">Who We Are</h1>
          <p className="text-xl max-w-3xl mx-auto text-primary-foreground/90 leading-relaxed font-medium">
            AIESEC is the world's largest youth-led organization, focused on developing the leadership potential of young people.
          </p>
        </div>
      </section>

      {/* History */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://picsum.photos/seed/aiesec_history/800/600"
                alt="History"
                fill
                className="object-cover"
                data-ai-hint="old conference"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-headline text-primary">Our Legacy</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded in 1948, AIESEC was created to promote cross-cultural understanding following WWII. Today, we are a global network of young leaders in over 120 countries and territories.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                In Nepal, we have been operating for over a decade, providing thousands of young Nepalis with the chance to experience professional and volunteering opportunities abroad while bringing global perspectives to our local communities.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="flex gap-4 items-center">
                  <div className="p-3 bg-secondary/10 rounded-lg text-secondary"><Award /></div>
                  <div>
                    <p className="font-bold">75+ Years</p>
                    <p className="text-xs text-muted-foreground">Global Impact</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="p-3 bg-accent/10 rounded-lg text-accent"><Globe /></div>
                  <div>
                    <p className="font-bold">120+ Countries</p>
                    <p className="text-xs text-muted-foreground">Global Presence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Committees */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold font-headline">Local Committees in Nepal</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Our presence across major cities in Nepal allows us to reach and empower more youth.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {lcs.map((lc) => (
              <Card key={lc.id} className="hover:shadow-xl transition-all border-none group">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="h-16 w-16 relative bg-white rounded-full p-2 border group-hover:border-primary transition-colors overflow-hidden">
                    <Image src={lc.logoUrl} alt={lc.name} fill className="object-contain" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-headline">AIESEC in {lc.name}</CardTitle>
                    <p className="text-sm text-primary font-medium">Established {lc.establishedYear}</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users size={16} className="text-secondary" />
                    <span className="text-sm font-medium">{lc.memberCount} Members</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={16} className="text-accent" />
                    <span className="text-sm font-medium">{new Date().getFullYear() - lc.establishedYear} Years</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
