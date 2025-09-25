
"use client";

import { useState, useEffect } from "react";
import type { ResumeData } from "@/types/resume";
import ResumeForm from "@/components/resume-form";
import ResumePreview from "@/components/resume-preview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import ResumeChatbot from "@/components/ai/resume-chatbot";

const initialResumeData: ResumeData = {
  personalInfo: {
    name: "Your Name",
    email: "your.email@example.com",
    phone: "123-456-7890",
    linkedin: "linkedin.com/in/yourprofile",
    github: "github.com/yourusername",
  },
  summary:
    "A brief professional summary about yourself. You can also use our AI Summary Generator to create one for you!",
  experience: [],
  education: [],
  skills: "React, TypeScript, Node.js, Tailwind CSS, Firebase",
  projects: [],
  customSections: [],
};

export default function ResumeEditor() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setResumeData({
      ...initialResumeData,
      experience: [
        {
          id: crypto.randomUUID(),
          jobTitle: "Software Engineer",
          company: "Tech Company",
          startDate: "2022-01",
          endDate: "Present",
          description: "• Developed and maintained web applications using React and Node.js.\n• Collaborated with cross-functional teams to deliver high-quality software.",
        },
      ],
      education: [
        {
          id: crypto.randomUUID(),
          institution: "University of Technology",
          degree: "B.S. in Computer Science",
          startDate: "2018-09",
          endDate: "2022-05",
        },
      ],
      projects: [
        {
          id: crypto.randomUUID(),
          name: "ResumeFlow AI",
          description: "An AI-powered resume builder to create professional resumes with ease.",
          url: "your-resume-flow-ai.com",
        },
      ],
      customSections: [],
    });
  }, []);

  if (!isClient || !resumeData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 h-screen">
        <div className="p-4 space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="p-4">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen max-h-screen">
      <ScrollArea className="h-screen">
        <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
      </ScrollArea>
      <ScrollArea className="h-screen bg-white print:h-auto">
        <ResumePreview resumeData={resumeData} />
      </ScrollArea>
      <ResumeChatbot resumeData={resumeData} setResumeData={setResumeData} />
    </div>
  );
}
