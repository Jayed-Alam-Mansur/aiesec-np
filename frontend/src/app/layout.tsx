
import type {Metadata} from 'next';
import './globals.css';
import {Navbar} from '@/components/navigation/navbar';
import {Footer} from '@/components/navigation/footer';
import {Toaster} from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'AIESEC Nepal Portal | Empowering Youth Leadership',
  description: 'Join the worlds largest youth-led organization. Explore global volunteer, talent, and teacher programs with AIESEC Nepal.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary selection:text-white">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
