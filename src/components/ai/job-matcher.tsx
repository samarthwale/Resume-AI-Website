"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Rocket, Loader2, PlusCircle } from "lucide-react";
import { tailorResume, TailorResumeOutput } from "@/ai/flows/tailor-resume";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface JobMatcherProps {
  currentSkills: string[];
  onAddSkill: (skill: string) => boolean;
}

export default function JobMatcher({ currentSkills, onAddSkill }: JobMatcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [results, setResults] = useState<TailorResumeOutput | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!jobDescription) {
      toast({
        variant: "destructive",
        title: "Missing Job Description",
        description: "Please paste a job description to analyze.",
      });
      return;
    }

    setIsLoading(true);
    setResults(null);

    try {
      const result = await tailorResume({
        skills: currentSkills,
        jobDescription,
      });
      setResults(result);
    } catch (error) {
      console.error("Error matching job:", error);
      toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: "Could not analyze the job description. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = (skill: string) => {
    const wasAdded = onAddSkill(skill);
    if (wasAdded) {
      toast({
          title: `Skill Added`,
          description: `"${skill}" has been added to your skills list.`,
          className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-300",
      });
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
        setResults(null);
        setJobDescription("");
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Rocket className="mr-2 h-4 w-4" />
        Tailor to Job Description
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tailor Resume to Job</DialogTitle>
            <DialogDescription>
              Paste a job description below. AI will analyze it and suggest keywords and skills to help you stand out.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={8}
              />
            </div>
             <Button onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Rocket className="mr-2 h-4 w-4" />
              )}
              Analyze and Suggest
            </Button>
            {results && (
                <div className="space-y-4 mt-4 max-h-[40vh] overflow-y-auto pr-2">
                    <Card>
                        <CardHeader><CardTitle className="text-lg">Analysis Results</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Matching Skills</h4>
                                <p className="text-sm text-muted-foreground mb-2">These are skills from your list that are a great match for this role.</p>
                                <div className="flex flex-wrap gap-2">
                                    {results.matchingSkills.length > 0 ? results.matchingSkills.map(skill => (
                                        <Badge key={skill} variant="secondary">{skill}</Badge>
                                    )) : <p className="text-sm text-muted-foreground">No direct matches found.</p>}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Suggested Skills</h4>
                                <p className="text-sm text-muted-foreground mb-2">Consider adding these skills from the job description if they apply to you.</p>
                                <div className="flex flex-wrap gap-2">
                                    {results.suggestedSkills.length > 0 ? results.suggestedSkills.map(skill => (
                                        <Badge key={skill} variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => handleAddSkill(skill)}>
                                            <PlusCircle className="mr-2 h-3 w-3" /> {skill}
                                        </Badge>
                                    )) : <p className="text-sm text-muted-foreground">No new skills suggested.</p>}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Keywords to Include</h4>
                                <p className="text-sm text-muted-foreground mb-2">Weave these keywords into your summary and experience descriptions.</p>
                                <div className="flex flex-wrap gap-2">
                                    {results.keywords.length > 0 ? results.keywords.map(keyword => (
                                        <Badge key={keyword} variant="default">{keyword}</Badge>
                                    )) : <p className="text-sm text-muted-foreground">No specific keywords identified.</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => handleOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
