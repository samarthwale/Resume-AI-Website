"use client";

import { useState } from "react";
import type { ResumeData } from "@/types/resume";
import { Card, CardContent } from "@/components/ui/card";
import ProfessionalTemplate from "./templates/professional-template";
import ModernTemplate from "./templates/modern-template";
import CreativeTemplate from "./templates/creative-template";
import MinimalistTemplate from "./templates/minimalist-template";
import { Button } from "./ui/button";
import { Download, Share2, LayoutTemplate } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ThemeCustomizer from "./theme-customizer";

interface ResumePreviewProps {
  resumeData: ResumeData;
}

export default function ResumePreview({ resumeData }: ResumePreviewProps) {
  const [template, setTemplate] = useState("professional");
  const { toast } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    toast({
      title: "Coming Soon!",
      description: "The shareable link feature is under development.",
    });
  };

  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={resumeData} />;
      case "creative":
        return <CreativeTemplate data={resumeData} />;
      case "minimalist":
        return <MinimalistTemplate data={resumeData} />;
      case "professional":
      default:
        return <ProfessionalTemplate data={resumeData} />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full bg-gray-100 dark:bg-gray-800">
      <Card className="mb-4 no-print">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <LayoutTemplate className="h-5 w-5 text-primary" />
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Template" />
                </Trigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ThemeCustomizer />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div id="resume-preview" className="flex-grow bg-white shadow-lg rounded-lg">
        {renderTemplate()}
      </div>
    </div>
  );
}
