"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";
import { rewriteJobDescription } from "@/ai/flows/rewrite-job-description";
import { useToast } from "@/hooks/use-toast";

interface DescriptionRewriterProps {
  jobDescription: string;
  onRewrite: (newDescription: string) => void;
}

export default function DescriptionRewriter({ jobDescription, onRewrite }: DescriptionRewriterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRewrite = async () => {
    if (!jobDescription) {
       toast({
        variant: "destructive",
        title: "Empty Description",
        description: "Please enter a description before rewriting.",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await rewriteJobDescription({ jobDescription });
      onRewrite(result.rewrittenJobDescription);
      toast({
        title: "Success",
        description: "Description has been rewritten by AI.",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-300",
      });
    } catch (error) {
      console.error("Error rewriting description:", error);
      toast({
        variant: "destructive",
        title: "AI Rewrite Failed",
        description: "Could not rewrite the description. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleRewrite} disabled={isLoading} className="mt-2">
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wand2 className="mr-2 h-4 w-4" />
      )}
      Rewrite with AI
    </Button>
  );
}
