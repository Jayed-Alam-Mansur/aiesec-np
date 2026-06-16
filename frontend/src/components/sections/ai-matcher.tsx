
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { aiExchangeProgramRecommender, ExchangeProgramRecommenderOutput } from '@/ai/flows/ai-exchange-program-recommender';
import { MOCK_PROGRAMS } from '@/lib/api';

export function AIExchangeMatcher() {
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<ExchangeProgramRecommenderOutput | null>(null);

  const handleMatch = async () => {
    if (!skills || !interests) return;
    setLoading(true);
    try {
      const result = await aiExchangeProgramRecommender({
        skills,
        interests,
        availablePrograms: MOCK_PROGRAMS.map(p => ({ id: p.id, name: p.name, description: p.description }))
      });
      setRecommendations(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 border-primary/20 bg-primary/5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <Sparkles className="text-primary animate-pulse" />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          AI Program Matcher
        </CardTitle>
        <CardDescription>
          Tell us about yourself and our AI will suggest the best AIESEC program for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">My Skills</label>
          <Input 
            placeholder="e.g. project management, coding, teaching" 
            value={skills} 
            onChange={(e) => setSkills(e.target.value)}
            className="bg-white/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">My Interests</label>
          <Input 
            placeholder="e.g. sustainability, traveling, social work" 
            value={interests} 
            onChange={(e) => setInterests(e.target.value)}
            className="bg-white/50"
          />
        </div>
        <Button 
          onClick={handleMatch} 
          disabled={loading || !skills || !interests}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold"
        >
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Matching...</> : "Find My Match"}
        </Button>

        {recommendations && (
          <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Top Recommendations:</h4>
            {recommendations.recommendations.map((rec, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-primary/10">
                <h5 className="font-bold text-lg mb-1">{rec.programName}</h5>
                <p className="text-sm text-muted-foreground mb-3">{rec.reasoning}</p>
                <div className="text-xs p-2 bg-slate-50 rounded italic text-muted-foreground">
                  {rec.programDescription}
                </div>
              </div>
            ))}
            <Button variant="link" className="text-primary p-0 h-auto font-bold" onClick={() => setRecommendations(null)}>
              Start Over
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
