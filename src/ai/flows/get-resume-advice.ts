'use server';

/**
 * @fileOverview A chatbot flow for providing resume advice and making direct edits.
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


const ResumeUpdateSchema = z.object({
    section: z.enum(['summary', 'experience', 'education', 'projects', 'personalInfo']).describe("The top-level section of the resume to be updated."),
    id: z.string().optional().describe('The ID of a specific item within a section (e.g., for an experience entry). Not required for singleton sections like "summary".'),
    field: z.string().describe('The specific field within the section or item to update (e.g., "description", "summary", "jobTitle").'),
    value: z.string().describe('The new content for the specified field.'),
}).describe('A specific, single update to be applied to the resume.');


const GetResumeAdviceOutputSchema = z.object({
  advice: z.string().describe("The AI-generated advice or a confirmation message for an action taken."),
  update: ResumeUpdateSchema.optional().describe("A structured object representing a change to the resume. This should only be populated if the user explicitly asks for a change to be made."),
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

**Important**: If the user asks you to directly change, rewrite, update, or remove a part of their resume, you MUST perform the following steps:
1.  Generate the new text for the requested section. To remove an item (like a link), set its 'value' to an empty string.
2.  Populate the 'update' object in the output with the details of the change.
    - 'section': The top-level key in the JSON to change (e.g., 'summary', 'experience', 'personalInfo').
    - 'id': If changing an item in a list (like experience or education), find the correct item's 'id' from the JSON and use it.
    - 'field': The specific property within the object to change (e.g., 'description', 'jobTitle', 'summary', 'github'). For the main summary, the field is 'summary'.
    - 'value': The new text content (or an empty string for removal).
3.  Set the 'advice' field to a confirmation message, like "I've updated that for you."

If the question is for general advice, provide tips without populating the 'update' object. Use markdown for formatting, like lists or bold text, to make the advice easy to read.

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
