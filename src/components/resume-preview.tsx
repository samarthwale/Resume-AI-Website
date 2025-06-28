
"use client";

import { useState } from "react";
import type { ResumeData } from "@/types/resume";
import { Card, CardContent } from "@/components/ui/card";
import ProfessionalTemplate from "./templates/professional-template";
import ModernTemplate from "./templates/modern-template";
import CreativeTemplate from "./templates/creative-template";
import MinimalistTemplate from "./templates/minimalist-template";
import { Button } from "./ui/button";
import { Download, Share2, LayoutTemplate, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ThemeCustomizer from "./theme-customizer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ResumePreviewProps {
  resumeData: ResumeData;
}

export default function ResumePreview({ resumeData }: ResumePreviewProps) {
  const [template, setTemplate] = useState("professional");
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    const resumeElement = document.getElementById("resume-preview");
    if (!resumeElement) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not find the resume element to download.",
      });
      return;
    }

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(resumeElement, {
        scale: 2, // Use a higher scale for better resolution
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resumeData.personalInfo.name.replace(/ /g, '_')}_Resume.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "There was an issue creating the PDF. Please try again.",
      });
    } finally {
      setIsDownloading(false);
    }
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
    <>
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full bg-gray-100 dark:bg-gray-800">
        <Card className="mb-4">
          <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="h-5 w-5 text-primary" />
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Template" />
                  </SelectTrigger>
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
              <Button onClick={handleDownload} variant="outline" disabled={isDownloading}>
                {isDownloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Download PDF
              </Button>
              <Button onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex-grow overflow-auto flex justify-center py-4">
            <div id="resume-preview" className="bg-white shadow-lg rounded-lg">
                {renderTemplate()}
            </div>
        </div>
      </div>
    </>
  );
}
