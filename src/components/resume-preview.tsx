"use client";

import { useState } from "react";
import type { ResumeData } from "@/types/resume";
import { Card, CardContent } from "@/components/ui/card";
import ProfessionalTemplate from "./templates/professional-template";
import ModernTemplate from "./templates/modern-template";
import CreativeTemplate from "./templates/creative-template";
import MinimalistTemplate from "./templates/minimalist-template";
import { Button } from "./ui/button";
import { Download, LayoutTemplate, Loader2 } from "lucide-react";
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
import { ThemeToggle } from "./theme-toggle";

interface ResumePreviewProps {
  resumeData: ResumeData;
}

export default function ResumePreview({ resumeData }: ResumePreviewProps) {
  const [template, setTemplate] = useState("professional");
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    // We target the first child of the preview div, which is the actual template component
    const resumeElement = document.getElementById("resume-preview")?.firstChild as HTMLElement;
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
        scale: 3, // Increased scale for better quality text
        useCORS: true,
        logging: false, // Disables logging for cleaner console
        width: resumeElement.scrollWidth, // Use scrollWidth to capture full content width
        height: resumeElement.scrollHeight, // Use scrollHeight to capture full content height
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Use 'px' as units for more direct mapping from canvas to PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      // Maintain aspect ratio
      const ratio = canvasWidth / canvasHeight;
      let scaledPdfHeight = pdfWidth / ratio;
      
      // If the scaled height is less than the canvas height, it means we need to scale by height instead
      if (scaledPdfHeight > canvasHeight) {
          scaledPdfHeight = canvasHeight
      }
      
      let heightLeft = canvasHeight * (pdfWidth/canvasWidth); // total height of the canvas in pdf units
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, heightLeft);
      heightLeft -= pdfHeight;

      // Add new pages if content overflows
      while (heightLeft > 0) {
        position -= pdfHeight; // Shift the "camera" down the canvas for the next page
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, canvasHeight * (pdfWidth/canvasWidth));
        heightLeft -= pdfHeight;
      }
      
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
            <ThemeToggle />
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
          </div>
        </CardContent>
      </Card>
      
      <div className="flex-grow overflow-auto flex justify-center py-4">
          <div id="resume-preview" className="bg-white shadow-lg rounded-lg">
              {renderTemplate()}
          </div>
      </div>
    </div>
  );
}
