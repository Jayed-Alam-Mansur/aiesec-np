
import { apiFetch, Partner } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Handshake, Building2, Zap, Award } from 'lucide-react';

export default async function PartnersPage() {
  const MOCK_PARTNERS: Partner[] = [
    { id: '1', name: 'Coca-Cola', logoUrl: 'https://picsum.photos/seed/p1/300/150', contributionType: 'Corporate Partner', isCurrent: true },
    { id: '2', name: 'PwC', logoUrl: 'https://picsum.photos/seed/p2/300/150', contributionType: 'Talent Partner', isCurrent: true },
    { id: '3', name: 'UNICEF', logoUrl: 'https://picsum.photos/seed/p3/300/150', contributionType: 'NGO Partner', isCurrent: false },
    { id: '4', name: 'DPD', logoUrl: 'https://picsum.photos/seed/p4/300/150', contributionType: 'Logistics Partner', isCurrent: false },
  ];

  let partners: Partner[] = MOCK_PARTNERS;
  try {
    partners = await apiFetch<Partner[]>('/partners').catch(() => MOCK_PARTNERS);
  } catch (e) {
    console.error("Partners fetch failed");
  }

  const currentPartners = partners.filter(p => p.isCurrent);
  const previousPartners = partners.filter(p => !p.isCurrent);

  return (
    <div className="flex flex-col w-full">
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">Partner for Change</h1>
          <p className="text-xl max-w-2xl mx-auto text-slate-400">
            Join forces with AIESEC Nepal to connect with youth leaders and drive impactful social initiatives.
          </p>
          <div className="pt-8">
            <Link href="/form?type=partner">
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-12 py-8 rounded-full text-xl">Partner With Us</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold font-headline text-primary">Current Strategic Partners</h2>
            <p className="text-muted-foreground">The organizations that help us make a difference every day.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {currentPartners.map((partner) => (
              <Card key={partner.id} className="group hover:shadow-xl transition-all border-none shadow-lg">
                <CardContent className="p-8 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="h-20 w-40 relative">
                    <Image src={partner.logoUrl} alt={partner.name} fill className="object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold font-headline">{partner.name}</h3>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest">{partner.contributionType}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold font-headline text-slate-400">Previous Collaborations</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
            {previousPartners.map((partner) => (
              <div key={partner.id} className="h-16 w-40 relative">
                <Image src={partner.logoUrl} alt={partner.name} fill className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><Zap /></div>
              <h3 className="text-xl font-bold font-headline">Youth Engagement</h3>
              <p className="text-muted-foreground text-sm">Direct access to a pool of motivated youth leaders from various academic backgrounds.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary"><Building2 /></div>
              <h3 className="text-xl font-bold font-headline">Corporate Branding</h3>
              <p className="text-muted-foreground text-sm">Enhance your employer branding and CSR initiatives through AIESEC's global visibility.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent"><Handshake /></div>
              <h3 className="text-xl font-bold font-headline">Global Talent</h3>
              <p className="text-muted-foreground text-sm">Bring international perspectives to your workplace with our talent solutions.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
