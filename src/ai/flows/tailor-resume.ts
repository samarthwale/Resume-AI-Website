'use server';

/**
 * @fileOverview Analyzes a job description against a user's skills to provide tailoring suggestions.
 *
 * - tailorResume - A function that handles the resume tailoring process.
 * - TailorResumeInput - The input type for the tailorResume function.
 * - TailorResumeOutput - The return type for the tailorResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TailorResumeInputSchema = z.object({
  skills: z.array(z.string()).describe("The user's current list of skills."),
  jobDescription: z.string().describe('The job description to analyze.'),
});
export type TailorResumeInput = z.infer<typeof TailorResumeInputSchema>;

const TailorResumeOutputSchema = z.object({
  matchingSkills: z
    .array(z.string())
    .describe('A list of skills from the user\'s list that are most relevant to the job description.'),
  suggestedSkills: z
    .array(z.string())
    .describe('A list of new, relevant skills mentioned in the job description that the user could consider adding.'),
  keywords: z
    .array(z.string())
    .describe('A list of important keywords and technologies from the job description to include throughout the resume.'),
});
export type TailorResumeOutput = z.infer<typeof TailorResumeOutputSchema>;

export async function tailorResume(input: TailorResumeInput): Promise<TailorResumeOutput> {
  return tailorResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tailorResumePrompt',
  input: {schema: TailorResumeInputSchema},
  output: {schema: TailorResumeOutputSchema},
  prompt: `You are an expert career coach specializing in resume optimization for Applicant Tracking Systems (ATS).
Your task is to analyze the provided job description and compare it against the user's current list of skills.

Based on your analysis, provide the following:
1.  **matchingSkills**: Identify which of the user's current skills are the most relevant and should be highlighted for this job.
2.  **suggestedSkills**: Identify important skills mentioned in the job description that are missing from the user's list. These are suggestions for the user to add if they have these skills. Do not include skills already in the user's list.
3.  **keywords**: Extract a list of crucial keywords, technologies, and soft skills from the job description that the user should try to incorporate into their summary and experience sections to pass through ATS filters.

User's Current Skills:
{{#each skills}}
- {{this}}
{{/each}}

Job Description:
---
{{jobDescription}}
---
`,
});

const tailorResumeFlow = ai.defineFlow(
  {
    name: 'tailorResumeFlow',
    inputSchema: TailorResumeInputSchema,
    outputSchema: TailorResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
