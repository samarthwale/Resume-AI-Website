import { config } from 'dotenv';
config();

import '@/ai/flows/rewrite-job-description.ts';
import '@/ai/flows/suggest-professional-summary.ts';
import '@/ai/flows/parse-resume.ts';
import '@/ai/flows/tailor-resume.ts';
