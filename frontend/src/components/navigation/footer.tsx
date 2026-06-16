
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold font-headline">AIESEC Nepal</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering young people to develop leadership through practical experiences in challenging environments.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary transition-colors"><Facebook size={18} /></Link>
              <Link href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary transition-colors"><Instagram size={18} /></Link>
              <Link href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary transition-colors"><Linkedin size={18} /></Link>
              <Link href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary transition-colors"><Twitter size={18} /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/products" className="hover:text-white transition-colors">Programs</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Local Committees</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Latest Stories</Link></li>
              <li><Link href="/members" className="hover:text-white transition-colors">Join AIESEC</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Opportunities</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/form?type=exchange" className="hover:text-white transition-colors">Global Volunteer</Link></li>
              <li><Link href="/form?type=exchange" className="hover:text-white transition-colors">Global Talent</Link></li>
              <li><Link href="/form?type=exchange" className="hover:text-white transition-colors">Global Teacher</Link></li>
              <li><Link href="/form?type=partner" className="hover:text-white transition-colors">Partner with us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>Kathmandu, Nepal</li>
              <li>nepal@aiesec.net</li>
              <li>+977 1 4XXXXXX</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AIESEC Nepal. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
