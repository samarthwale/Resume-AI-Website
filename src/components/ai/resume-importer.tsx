
"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { parseResume, ParseResumeOutput } from "@/ai/flows/parse-resume";
import type { ResumeData } from "@/types/resume";

interface ResumeImporterProps {
  onImport: (data: ResumeData) => void;
}

export default function ResumeImporter({ onImport }: ResumeImporterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const dataUri = reader.result as string;
      try {
        const parsedData = await parseResume({ resumeFile: dataUri });

        // The AI returns data without client-side IDs. We add them here.
        const fullResumeData: ResumeData = {
          ...parsedData,
          experience: parsedData.experience.map(exp => ({ ...exp, id: crypto.randomUUID() })),
          education: parsedData.education.map(edu => ({ ...edu, id: crypto.randomUUID() })),
          projects: parsedData.projects.map(proj => ({ ...proj, id: crypto.randomUUID() })),
        };

        onImport(fullResumeData);
        toast({
          title: "Import Successful",
          description: "Your resume has been parsed and the form has been automatically filled.",
        });
      } catch (error) {
        console.error("Error parsing resume:", error);
        let description = "Could not parse the resume. Please check the file or try again.";
        if (error instanceof Error && (error.message.includes('503') || error.message.toLowerCase().includes('overloaded'))) {
          description = "The AI service is currently busy. Please try again in a few moments.";
        }
        toast({
          variant: "destructive",
          title: "AI Parsing Failed",
          description,
        });
      } finally {
        setIsLoading(false);
        // Reset file input
        if(fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast({
            variant: "destructive",
            title: "File Read Error",
            description: "Could not read the selected file.",
        });
        setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept=".pdf"
        disabled={isLoading}
      />
      <Button onClick={handleButtonClick} disabled={isLoading} variant="outline">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        Import Resume
      </Button>
    </>
  );
}
