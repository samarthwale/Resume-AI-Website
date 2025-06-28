// This file is machine-generated - edit with care!
'use server';

/**
 * @fileOverview Rewrites job descriptions using AI to be more impactful and ATS-friendly.
 *
 * - rewriteJobDescription - A function that handles the rewriting of job descriptions.
 * - RewriteJobDescriptionInput - The input type for the rewriteJobDescription function.
 * - RewriteJobDescriptionOutput - The return type for the rewriteJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteJobDescriptionInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The job description to rewrite to be more impactful and ATS-friendly.'),
});
export type RewriteJobDescriptionInput = z.infer<
  typeof RewriteJobDescriptionInputSchema
>;

const RewriteJobDescriptionOutputSchema = z.object({
  rewrittenJobDescription: z
    .string()
    .describe('The rewritten job description that is more impactful and ATS-friendly.'),
});
export type RewriteJobDescriptionOutput = z.infer<
  typeof RewriteJobDescriptionOutputSchema
>;

export async function rewriteJobDescription(
  input: RewriteJobDescriptionInput
): Promise<RewriteJobDescriptionOutput> {
  return rewriteJobDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rewriteJobDescriptionPrompt',
  input: {schema: RewriteJobDescriptionInputSchema},
  output: {schema: RewriteJobDescriptionOutputSchema},
  prompt: `Rewrite the following job description to be more impactful and ATS-friendly:

{{jobDescription}}`,
});

const rewriteJobDescriptionFlow = ai.defineFlow(
  {
    name: 'rewriteJobDescriptionFlow',
    inputSchema: RewriteJobDescriptionInputSchema,
    outputSchema: RewriteJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
