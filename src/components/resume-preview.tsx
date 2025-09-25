
"use client";

import { useState } from "react";
import type { ResumeData } from "@/types/resume";
import { Card, CardContent } from "@/components/ui/card";
import ProfessionalTemplate from "./templates/professional-template";
import ModernTemplate from "./templates/modern-template";
import CreativeTemplate from "./templates/creative-template";
import MinimalistTemplate from "./templates/minimalist-template";
import ClassicTemplate from "./templates/classic-template";
import { Button } from "./ui/button";
import { Download, LayoutTemplate, Loader2, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import FontSizer from "./font-sizer";
import Image from "next/image";

interface ResumePreviewProps {
  resumeData: ResumeData;
}

export default function ResumePreview({ resumeData }: ResumePreviewProps) {
  const [template, setTemplate] = useState("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const { toast } = useToast();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const generatePreview = async () => {
    const resumeElement = document.getElementById("resume-preview")?.firstChild as HTMLElement;
    if (!resumeElement) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not find the resume element to preview.",
      });
      return null;
    }

    setIsGenerating(true);

    try {
      const canvas = await html2canvas(resumeElement, {
        scale: 3,
        useCORS: true,
        logging: false,
        width: resumeElement.scrollWidth,
        height: resumeElement.scrollHeight,
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
       console.error("Error generating preview:", error);
       toast({
        variant: "destructive",
        title: "Preview Failed",
        description: "There was an issue creating the preview. Please try again.",
      });
      return null;
    } finally {
        setIsGenerating(false);
    }
  }

  const handlePreviewClick = async () => {
    const imageUrl = await generatePreview();
    if (imageUrl) {
      setPreviewImageUrl(imageUrl);
      setIsPreviewOpen(true);
    }
  };

  const handleDownload = async () => {
    const resumeElement = document.getElementById("resume-preview")?.firstChild as HTMLElement;
     if (!resumeElement) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not find the resume element to generate a PDF.",
      });
      return;
    }

    setIsGenerating(true);
    try {
       const canvas = await html2canvas(resumeElement, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        logging: false,
        width: resumeElement.scrollWidth,
        height: resumeElement.scrollHeight,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      
      const scaledCanvasHeight = pdfWidth / ratio;
      const totalPages = Math.ceil(scaledCanvasHeight / pdfHeight);

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        const yPosition = -pdfHeight * i;
        pdf.addImage(imgData, 'PNG', 0, yPosition, pdfWidth, scaledCanvasHeight);
      }
      
      pdf.save(`${resumeData.personalInfo.name.replace(/ /g, '_')}_Resume.pdf`);
      setIsPreviewOpen(false); // Close preview after download
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "There was an issue creating the PDF. Please try again.",
      });
    } finally {
      setIsGenerating(false);
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
      case "classic":
        return <ClassicTemplate data={resumeData} />;
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
                    <SelectItem value="classic">Classic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ThemeCustomizer />
              <FontSizer onSizeChange={setFontSize} defaultValue={fontSize} />
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handlePreviewClick} variant="outline" disabled={isGenerating}>
                {isGenerating && !isPreviewOpen ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="mr-2 h-4 w-4" />
                )}
                Preview & Download
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex-grow overflow-auto flex justify-center py-4 print-container">
            <div id="resume-preview" className="bg-white shadow-lg rounded-lg" style={{ fontSize: `${fontSize}px`, width: '794px' }}>
                {renderTemplate()}
            </div>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>PDF Preview</DialogTitle>
            <DialogDescription>
              This is a preview of your final PDF. If it looks good, confirm the download.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow my-4 bg-gray-200 dark:bg-gray-900 rounded-md overflow-auto flex justify-center p-4">
            {isGenerating && !previewImageUrl ? (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                </div>
            ) : previewImageUrl && (
              <Image 
                src={previewImageUrl} 
                alt="Resume Preview"
                width={794}
                height={1123}
                style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                }}
                className="shadow-lg"
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsPreviewOpen(false)}>Cancel</Button>
            <Button onClick={handleDownload} disabled={isGenerating || !previewImageUrl}>
               {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Confirm Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
