// This file is machine-generated - edit with care!
'use server';

/**
 * @fileOverview Rewrites a description using AI to be more impactful and professional.
 *
 * - rewriteJobDescription - A function that handles the rewriting of descriptions.
 * - RewriteJobDescriptionInput - The input type for the rewriteJobDescription function.
 * - RewriteJobDescriptionOutput - The return type for the rewriteJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteJobDescriptionInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The description to rewrite.'),
});
export type RewriteJobDescriptionInput = z.infer<
  typeof RewriteJobDescriptionInputSchema
>;

const RewriteJobDescriptionOutputSchema = z.object({
  rewrittenJobDescription: z
    .string()
    .describe('The rewritten description, formatted as a list of bullet points.'),
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
  prompt: `Rewrite the following description to be more impactful, professional, and concise. Format the response as a list of bullet points, with each point starting with a '•' character. Use strong action verbs and quantify achievements where possible:

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
