"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2, Loader2, Check } from "lucide-react";
import { generateProfessionalSummary, ProfessionalSummaryInput } from "@/ai/flows/suggest-professional-summary";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";

interface SummaryGeneratorProps {
  currentSummary: string;
  onSummaryGenerated: (summary: string) => void;
  userInfo: {
    name: string;
    skills: string;
  };
}

export default function SummaryGenerator({ currentSummary, onSummaryGenerated, userInfo }: SummaryGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [generatedSummary, setGeneratedSummary] = useState("");
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!jobTitle || !experienceYears) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both a job title and years of experience.",
      });
      return;
    }

    setIsLoading(true);
    setGeneratedSummary("");

    try {
      const input: ProfessionalSummaryInput = {
        ...userInfo,
        jobTitle,
        experienceYears: parseInt(experienceYears, 10),
      };
      const result = await generateProfessionalSummary(input);
      setGeneratedSummary(result.summary);
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: "Could not generate a summary. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySummary = () => {
    onSummaryGenerated(generatedSummary);
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="mt-2">
        <Wand2 className="mr-2 h-4 w-4" />
        Generate with AI
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>AI Professional Summary</DialogTitle>
            <DialogDescription>
              Provide a few details and let AI write a compelling summary for you.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title</Label>
              <Input id="job-title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Software Engineer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience-years">Years of Experience</Label>
              <Input id="experience-years" type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} placeholder="e.g. 5" />
            </div>
             <Button onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Summary
            </Button>
            {generatedSummary && (
                <div className="space-y-2">
                    <Label>Generated Summary:</Label>
                    <Textarea value={generatedSummary} readOnly rows={4} className="bg-muted"/>
                </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleApplySummary} disabled={!generatedSummary}>
                <Check className="mr-2 h-4 w-4"/>
                Apply Summary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
