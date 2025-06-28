'use server';

/**
 * @fileOverview A chatbot flow for providing resume advice.
 *
 * - getResumeAdvice - A function that provides AI-powered suggestions for a resume.
 * - GetResumeAdviceInput - The input type for the getResumeAdvice function.
 * - GetResumeAdviceOutput - The return type for the getResumeAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetResumeAdviceInputSchema = z.object({
  resumeJson: z.string().describe('The user\'s current resume, formatted as a JSON string.'),
  question: z.string().describe('The user\'s question about their resume.'),
});
export type GetResumeAdviceInput = z.infer<typeof GetResumeAdviceInputSchema>;

const GetResumeAdviceOutputSchema = z.object({
  advice: z.string().describe('The AI-generated advice for the user\'s resume.'),
});
export type GetResumeAdviceOutput = z.infer<typeof GetResumeAdviceOutputSchema>;

export async function getResumeAdvice(input: GetResumeAdviceInput): Promise<GetResumeAdviceOutput> {
  return getResumeAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getResumeAdvicePrompt',
  input: {schema: GetResumeAdviceInputSchema},
  output: {schema: GetResumeAdviceOutputSchema},
  prompt: `You are an expert career coach and resume writer named "Flow". You are friendly, encouraging, and provide clear, actionable advice.

A user has a question about their resume. Their current resume data is provided below as a JSON object. Analyze their resume and their question to provide a helpful, concise, and well-formatted answer.

If the question is general, provide general tips. If it's about a specific section (like "summary" or "experience"), focus your advice there. Use markdown for formatting, like lists or bold text, to make the advice easy to read.

Resume Data:
\`\`\`json
{{{resumeJson}}}
\`\`\`

User's Question:
"{{question}}"`,
});

const getResumeAdviceFlow = ai.defineFlow(
  {
    name: 'getResumeAdviceFlow',
    inputSchema: GetResumeAdviceInputSchema,
    outputSchema: GetResumeAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
