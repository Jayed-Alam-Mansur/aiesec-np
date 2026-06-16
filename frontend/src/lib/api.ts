
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export type Program = {
  id: string;
  name: string;
  description: string;
  color: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  avatarUrl: string;
};

export type Partner = {
  id: string;
  name: string;
  logoUrl: string;
  contributionType: string;
  isCurrent: boolean;
};

export type LC = {
  id: string;
  name: string;
  establishedYear: number;
  memberCount: number;
  logoUrl: string;
};

export type LCStats = {
  totalLCs: number;
  totalMembers: number;
  activeExchanges: number;
};

export type Post = {
  id: string;
  title: string;
  category: 'Member' | 'Events' | 'Exchange' | 'Impact';
  content: string;
  imageUrl: string;
  createdAt: string;
};

// Fallback Mock Data for UI stability when backend is not connected
export const MOCK_PROGRAMS: Program[] = [
  { id: 'gv', name: 'Global Volunteer', description: 'Cross-cultural volunteering for social impact.', color: '#F85A40' },
  { id: 'gt', name: 'Global Talent', description: 'Professional internships to develop your career.', color: '#037EF3' },
  { id: 'gte', name: 'Global Teacher', description: 'Impactful teaching opportunities abroad.', color: '#0CB9C1' },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: '1', name: 'Alina K.', role: 'Exchange Participant', content: 'AIESEC changed my perspective on global leadership completely.', avatarUrl: 'https://picsum.photos/seed/p1/200/200' },
  { id: '2', name: 'Sagar M.', role: 'LCP Kathmandu', content: 'The best platform for youth to experience real-world challenges.', avatarUrl: 'https://picsum.photos/seed/p2/200/200' },
];

export const MOCK_LCS: LC[] = [
  { id: 'ktm', name: 'Kathmandu', establishedYear: 2010, memberCount: 150, logoUrl: 'https://picsum.photos/seed/lc1/100/100' },
  { id: 'pkr', name: 'Pokhara', establishedYear: 2015, memberCount: 80, logoUrl: 'https://picsum.photos/seed/lc2/100/100' },
  { id: 'pkr', name: 'Lalitpur', establishedYear: 2012, memberCount: 110, logoUrl: 'https://picsum.photos/seed/lc3/100/100' },
];
