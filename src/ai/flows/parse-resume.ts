'use server';

/**
 * @fileOverview Parses a resume file and extracts structured data.
 *
 * - parseResume - A function that handles parsing a resume.
 * - ParseResumeInput - The input type for the parseResume function.
 * - ParseResumeOutput - The return type for the parseResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schemas based on src/types/resume.ts

const PersonalInfoSchema = z.object({
  name: z.string().describe('The full name of the person.'),
  email: z.string().describe('The email address.'),
  phone: z.string().describe('The phone number.'),
  linkedin: z.string().describe("The LinkedIn profile URL or handle. Extract only the profile identifier, not the full URL. For example, for 'linkedin.com/in/yourprofile', extract 'yourprofile'."),
  github: z.string().describe("The GitHub profile URL or username. Extract only the username. For example, for 'github.com/yourusername', extract 'yourusername'."),
});

const ExperienceSchema = z.object({
  jobTitle: z.string().describe('The job title.'),
  company: z.string().describe('The company name.'),
  startDate: z.string().describe("The start date in 'YYYY-MM' format."),
  endDate: z.string().describe("The end date in 'YYYY-MM' format, or 'Present' if current."),
  description: z.string().describe('A description of the responsibilities and achievements, formatted with bullet points (•) for each distinct point.'),
});

const EducationSchema = z.object({
  institution: z.string().describe('The name of the educational institution.'),
  degree: z.string().describe('The degree or certificate obtained.'),
  startDate: z.string().describe("The start date in 'YYYY-MM' format."),
  endDate: z.string().describe("The end date in 'YYYY-MM' format."),
});

const ProjectSchema = z.object({
  name: z.string().describe('The name of the project.'),
  description: z.string().describe('A brief description of the project.'),
  url: z.string().describe('The URL of the project, if available.'),
});

const ParseResumeOutputSchema = z.object({
  personalInfo: PersonalInfoSchema,
  summary: z.string().describe('A professional summary.'),
  experience: z.array(ExperienceSchema).describe('A list of work experiences.'),
  education: z.array(EducationSchema).describe('A list of educational qualifications.'),
  skills: z.array(z.string()).describe('A list of skills.'),
  projects: z.array(ProjectSchema).describe('A list of projects.'),
});
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;

const ParseResumeInputSchema = z.object({
  resumeFile: z.string().describe(
      "A resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. Supported formats are PDF and DOCX."
    ),
});
export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;

export async function parseResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  return parseResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseResumePrompt',
  input: {schema: ParseResumeInputSchema},
  output: {schema: ParseResumeOutputSchema},
  prompt: `You are an expert resume parser. Analyze the following resume file and extract the information into the structured JSON format provided.

- For all dates, use the 'YYYY-MM' format. If only a year is provided, use 'YYYY-01'.
- For experience descriptions, maintain the original content but ensure each distinct point or sentence starts on a new line with a '• ' bullet point.
- For LinkedIn and GitHub, extract just the username or profile identifier, not the full URL (e.g., 'yourprofile' from 'linkedin.com/in/yourprofile').
- If a section (like projects) is not present, return an empty array for it.

Resume File: {{media url=resumeFile}}`,
});

const parseResumeFlow = ai.defineFlow(
  {
    name: 'parseResumeFlow',
    inputSchema: ParseResumeInputSchema,
    outputSchema: ParseResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
