'use server';
/**
 * @fileOverview An AI agent that recommends AIESEC exchange programs based on user skills and interests.
 *
 * - aiExchangeProgramRecommender - A function that handles the program recommendation process.
 * - ExchangeProgramRecommenderInput - The input type for the aiExchangeProgramRecommender function.
 * - ExchangeProgramRecommenderOutput - The return type for the aiExchangeProgramRecommender function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExchangeProgramInputSchema = z.object({
  skills: z.string().describe("A comma-separated list or description of the user's skills (e.g., 'leadership, project management, communication')."),
  interests: z.string().describe("A comma-separated list or description of the user's interests (e.g., 'sustainable development, education, cultural exchange')."),
});

const AvailableProgramSchema = z.object({
  id: z.string().describe('Unique identifier for the program.'),
  name: z.string().describe('The name of the program (e.g., Global Volunteer, Global Talent, Global Teacher).'),
  description: z.string().describe('A brief description of the program.'),
  // Add other relevant program details if available from the API
});

const ExchangeProgramRecommenderInputSchema = ExchangeProgramInputSchema.extend({
  availablePrograms: z.array(AvailableProgramSchema).describe('A list of available AIESEC exchange programs, including their names and descriptions.'),
});
export type ExchangeProgramRecommenderInput = z.infer<typeof ExchangeProgramRecommenderInputSchema>;

const ExchangeProgramRecommenderOutputSchema = z.object({
  recommendations: z.array(z.object({
    programName: z.string().describe('The name of the recommended program.'),
    reasoning: z.string().describe('An explanation of why this program is a good fit for the user, linking to their skills and interests.'),
    programDescription: z.string().describe('A short description of the recommended program from the available list.'),
  })).describe('A list of recommended AIESEC exchange programs, with reasoning and descriptions.'),
});
export type ExchangeProgramRecommenderOutput = z.infer<typeof ExchangeProgramRecommenderOutputSchema>;

export async function aiExchangeProgramRecommender(input: ExchangeProgramRecommenderInput): Promise<ExchangeProgramRecommenderOutput> {
  return exchangeProgramRecommenderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'exchangeProgramRecommenderPrompt',
  input: {schema: ExchangeProgramRecommenderInputSchema},
  output: {schema: ExchangeProgramRecommenderOutputSchema},
  prompt: `You are an expert AIESEC program recommender. Your task is to analyze a user's skills and interests and recommend the most suitable AIESEC exchange programs from a given list.

User's Skills:
{{{skills}}}

User's Interests:
{{{interests}}}

Available Programs:
{{#each availablePrograms}}
- Program Name: {{this.name}}
  Description: {{this.description}}
{{/each}}

Based on the user's skills and interests, recommend up to 3 programs from the 'Available Programs' list that are the best fit. For each recommendation, provide the program name, a brief reasoning why it's suitable, and a short description of the program. Ensure the programDescription exactly matches the description provided in the 'Available Programs' list for the recommended program.`,
});

const exchangeProgramRecommenderFlow = ai.defineFlow(
  {
    name: 'exchangeProgramRecommenderFlow',
    inputSchema: ExchangeProgramRecommenderInputSchema,
    outputSchema: ExchangeProgramRecommenderOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
