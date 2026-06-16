
"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Testimonial } from "@/lib/api";
import { Quote } from "lucide-react";

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="relative max-w-5xl mx-auto">
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {testimonials.map((t) => (
            <CarouselItem key={t.id} className="pl-4 md:basis-1/2">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white border h-full">
                <CardContent className="p-8 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <Quote className="text-primary w-10 h-10 mb-4" />
                    <p className="text-lg italic leading-relaxed">"{t.content}"</p>
                  </div>
                  <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                    <Avatar className="h-12 w-12 border-2 border-primary">
                      <AvatarImage src={t.avatarUrl} />
                      <AvatarFallback className="bg-slate-800 text-white">AN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold">{t.name}</p>
                      <p className="text-xs text-primary-foreground/70 uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="bg-white/10 border-white/20 text-white -left-12 hover:bg-primary transition-colors" />
          <CarouselNext className="bg-white/10 border-white/20 text-white -right-12 hover:bg-primary transition-colors" />
        </div>
      </Carousel>
    </div>
  );
}
