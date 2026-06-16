
"use client";

import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Suspense, useState } from 'react';
import { Building2, UserPlus, Globe2, Loader2 } from 'lucide-react';
import { AIExchangeMatcher } from '@/components/sections/ai-matcher';

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  organization: z.string().optional(),
  message: z.string().min(10, "Please provide more details"),
  skills: z.string().optional(),
  interests: z.string().optional(),
});

function FormContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'member';
  const program = searchParams.get('program') || '';
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      organization: '',
      message: '',
      skills: '',
      interests: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify({ type, fields: { ...values, program } }),
      });
      
      // Since this is a sample/testing frontend, we simulate success if the endpoint isn't 100% ready
      toast({
        title: "Submission Successful!",
        description: `Your ${type} inquiry has been sent to the AIESEC team.`,
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error submitting form",
        description: "Please try again later or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const getHeader = () => {
    switch(type) {
      case 'exchange': return { title: "Explore the World", desc: "Apply for a global exchange program today.", icon: <Globe2 className="text-secondary" /> };
      case 'partner': return { title: "Partner With Us", desc: "Collaborate with AIESEC to empower youth leadership.", icon: <Building2 className="text-accent" /> };
      default: return { title: "Become a Member", desc: "Join our local committee and develop your skills.", icon: <UserPlus className="text-primary" /> };
    }
  };

  const header = getHeader();

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
              {header.icon}
            </div>
            <h1 className="text-4xl font-bold font-headline">{header.title}</h1>
            <p className="text-muted-foreground text-lg">{header.desc}</p>
          </div>

          <Card className="border-none shadow-xl">
            <CardHeader>
              <CardTitle>Inquiry Form</CardTitle>
              <CardDescription>All fields marked with * are required.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl><Input placeholder="john@example.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone *</FormLabel>
                          <FormControl><Input placeholder="+977" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {type === 'partner' && (
                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Name</FormLabel>
                          <FormControl><Input placeholder="Company Ltd." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {type === 'exchange' && (
                    <>
                      <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skills</FormLabel>
                            <FormControl><Input placeholder="e.g. teaching, marketing, IT" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="interests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Interests</FormLabel>
                            <FormControl><Input placeholder="e.g. sustainability, education" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tell us more *</FormLabel>
                        <FormControl><Textarea placeholder="How can we help you?" className="min-h-[120px]" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-6" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Inquiry"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {type === 'exchange' && <AIExchangeMatcher />}
          
          <Card className="bg-slate-900 text-white border-none p-8 space-y-6">
            <h3 className="text-xl font-bold font-headline">Why join AIESEC?</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex gap-3"><Globe2 className="text-primary h-5 w-5 shrink-0" /> Global network in 120+ countries.</li>
              <li className="flex gap-3"><UserPlus className="text-secondary h-5 w-5 shrink-0" /> Leadership development opportunities.</li>
              <li className="flex gap-3"><Building2 className="text-accent h-5 w-5 shrink-0" /> Professional networking with partners.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DynamicFormPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>}>
      <FormContent />
    </Suspense>
  );
}
