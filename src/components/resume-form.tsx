
"use client";

import type { ResumeData, Experience, Education, Project, CustomSection } from "@/types/resume";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle } from "lucide-react";
import SummaryGenerator from "@/components/ai/summary-generator";
import DescriptionRewriter from "@/components/ai/description-rewriter";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import ResumeImporter from "@/components/ai/resume-importer";
import JobMatcher from "@/components/ai/job-matcher";
import { useToast } from "@/hooks/use-toast";

interface ResumeFormProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>;
}

export default function ResumeForm({ resumeData, setResumeData }: ResumeFormProps) {
  const [newSkill, setNewSkill] = useState("");
  const { toast } = useToast();

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setResumeData) return;
    const { id, value } = e.target;
    setResumeData(prev => prev ? { ...prev, personalInfo: { ...prev.personalInfo, [id]: value } } : null);
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!setResumeData) return;
    setResumeData(prev => prev ? { ...prev, summary: e.target.value } : null);
  };

  const handleDynamicChange = <T extends Experience | Education | Project | CustomSection>(
    section: keyof ResumeData,
    id: string,
    field: keyof T,
    value: string
  ) => {
    if (!setResumeData) return;
    setResumeData(prev => {
      if (!prev) return null;
      const list = prev[section] as T[];
      const updatedList = list.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      );
      return { ...prev, [section]: updatedList };
    });
  };

  const addDynamicItem = <T extends { id: string }>(section: keyof ResumeData, newItem: T) => {
    if (!setResumeData) return;
    setResumeData(prev => {
        if (!prev) return null;
        const list = prev[section] as T[];
        return { ...prev, [section]: [...list, newItem] };
    });
  };
  
  const removeDynamicItem = (section: keyof ResumeData, id: string) => {
    if (!setResumeData) return;
    setResumeData(prev => {
        if (!prev) return null;
        const list = prev[section] as { id: string }[];
        return { ...prev, [section]: list.filter(item => item.id !== id) };
    });
    const sectionName = section.charAt(0).toUpperCase() + section.slice(1);
    toast({
      title: `${sectionName} Entry Removed`,
      description: `The item has been successfully deleted.`,
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && setResumeData) {
      if (resumeData && resumeData.skills.some(s => s.toLowerCase() === newSkill.trim().toLowerCase())) {
         toast({
            title: "Skill Exists",
            description: `"${newSkill.trim()}" is already in your skills list.`,
        });
        return;
      }
      setResumeData(prev => prev ? { ...prev, skills: [...prev.skills, newSkill.trim()] } : null);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!setResumeData) return;
    setResumeData(prev => prev ? { ...prev, skills: prev.skills.filter(skill => skill !== skillToRemove) } : null);
    toast({
      title: `Skill Removed`,
      description: `"${skillToRemove}" has been removed from your skills.`,
    });
  };

  const addSkillFromMatcher = (skillToAdd: string): boolean => {
    if (!skillToAdd.trim() || !setResumeData || !resumeData) return false;

    if (resumeData.skills.some(s => s.toLowerCase() === skillToAdd.trim().toLowerCase())) {
        toast({
            title: "Skill Exists",
            description: `"${skillToAdd}" is already in your skills list.`,
        });
        return false;
    }

    setResumeData(prev => prev ? { ...prev, skills: [...prev.skills, skillToAdd.trim()] } : null);
    return true;
  };
  
  if (!resumeData) return null;

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-1">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline">ResumeFlow AI</h1>
            <p className="text-muted-foreground">Fill in your details below or import an existing resume.</p>
          </div>
          <ResumeImporter onImport={(data) => setResumeData(data)} />
        </div>
      </header>

      <Accordion type="multiple" defaultValue={["item-1"]} className="w-full space-y-4">
        
        <AccordionItem value="item-1" className="border-none">
           <Card>
            <AccordionTrigger className="p-6 text-lg font-semibold">Personal Information</AccordionTrigger>
            <AccordionContent className="px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={resumeData.personalInfo.name} onChange={handlePersonalInfoChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  <Input id="linkedin" value={resumeData.personalInfo.linkedin} onChange={handlePersonalInfoChange} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="github">GitHub Profile</Label>
                  <Input id="github" value={resumeData.personalInfo.github} onChange={handlePersonalInfoChange} />
                </div>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="item-2" className="border-none">
          <Card>
            <AccordionTrigger className="p-6 text-lg font-semibold">Professional Summary</AccordionTrigger>
            <AccordionContent className="px-6">
              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea id="summary" value={resumeData.summary} onChange={handleSummaryChange} rows={5} />
                <SummaryGenerator
                  currentSummary={resumeData.summary}
                  onSummaryGenerated={(summary) => setResumeData(prev => prev ? { ...prev, summary } : null)}
                  userInfo={{name: resumeData.personalInfo.name, skills: resumeData.skills.join(', ')}}
                />
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="item-3" className="border-none">
           <Card>
            <AccordionTrigger className="p-6 text-lg font-semibold">Work Experience</AccordionTrigger>
            <AccordionContent className="px-6 space-y-4">
              {resumeData.experience.map((exp, index) => (
                <Card key={exp.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Experience #{index + 1}</h4>
                      <Button variant="ghost" size="icon" onClick={() => removeDynamicItem('experience', exp.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`jobTitle-${exp.id}`}>Job Title</Label>
                        <Input id={`jobTitle-${exp.id}`} value={exp.jobTitle} onChange={(e) => handleDynamicChange('experience', exp.id, 'jobTitle', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`company-${exp.id}`}>Company</Label>
                        <Input id={`company-${exp.id}`} value={exp.company} onChange={(e) => handleDynamicChange('experience', exp.id, 'company', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`startDate-${exp.id}`}>Start Date</Label>
                        <Input id={`startDate-${exp.id}`} type="month" value={exp.startDate} onChange={(e) => handleDynamicChange('experience', exp.id, 'startDate', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`endDate-${exp.id}`}>End Date</Label>
                        <Input id={`endDate-${exp.id}`} type="text" placeholder="Present or YYYY-MM" value={exp.endDate} onChange={(e) => handleDynamicChange('experience', exp.id, 'endDate', e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`description-${exp.id}`}>Description</Label>
                      <Textarea id={`description-${exp.id}`} value={exp.description} onChange={(e) => handleDynamicChange('experience', exp.id, 'description', e.target.value)} rows={4} />
                       <DescriptionRewriter
                          jobDescription={exp.description}
                          onRewrite={(newDesc) => handleDynamicChange('experience', exp.id, 'description', newDesc)}
                        />
                    </div>
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={() => addDynamicItem('experience', { id: crypto.randomUUID(), jobTitle: '', company: '', startDate: '', endDate: '', description: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Add Experience</Button>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="item-4" className="border-none">
          <Card>
            <AccordionTrigger className="p-6 text-lg font-semibold">Education</AccordionTrigger>
            <AccordionContent className="px-6 space-y-4">
              {resumeData.education.map((edu, index) => (
                <Card key={edu.id} className="p-4">
                   <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Education #{index + 1}</h4>
                      <Button variant="ghost" size="icon" onClick={() => removeDynamicItem('education', edu.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                        <Input id={`institution-${edu.id}`} value={edu.institution} onChange={(e) => handleDynamicChange('education', edu.id, 'institution', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`degree-${edu.id}`}>Degree/Certificate</Label>
                        <Input id={`degree-${edu.id}`} value={edu.degree} onChange={(e) => handleDynamicChange('education', edu.id, 'degree', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`startDate-edu-${edu.id}`}>Start Date</Label>
                        <Input id={`startDate-edu-${edu.id}`} type="month" value={edu.startDate} onChange={(e) => handleDynamicChange('education', edu.id, 'startDate', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`endDate-edu-${edu.id}`}>End Date</Label>
                        <Input id={`endDate-edu-${edu.id}`} type="month" value={edu.endDate} onChange={(e) => handleDynamicChange('education', edu.id, 'endDate', e.target.value)} />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={() => addDynamicItem('education', { id: crypto.randomUUID(), institution: '', degree: '', startDate: '', endDate: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Add Education</Button>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="item-5" className="border-none">
          <Card>
            <AccordionTrigger className="p-6 text-lg font-semibold">Skills</AccordionTrigger>
            <AccordionContent className="px-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="text-base">
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)} className="ml-2 text-primary hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t items-center">
                  <div className="flex-grow flex gap-2 w-full">
                      <Input placeholder="Add skill manually" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()} />
                      <Button onClick={handleAddSkill} className="shrink-0"><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
                  </div>
                  <span className="text-sm text-muted-foreground hidden sm:inline">OR</span>
                   <div className="shrink-0">
                     <JobMatcher currentSkills={resumeData.skills} onAddSkill={addSkillFromMatcher} />
                  </div>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="item-6" className="border-none">
           <Card>
            <AccordionTrigger className="p-6 text-lg font-semibold">Projects</AccordionTrigger>
            <AccordionContent className="px-6 space-y-4">
              {resumeData.projects.map((proj, index) => (
                <Card key={proj.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Project #{index + 1}</h4>
                        <Button variant="ghost" size="icon" onClick={() => removeDynamicItem('projects', proj.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`name-proj-${proj.id}`}>Project Name</Label>
                        <Input id={`name-proj-${proj.id}`} value={proj.name} onChange={(e) => handleDynamicChange('projects', proj.id, 'name', e.target.value)} />
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor={`url-proj-${proj.id}`}>Project URL</Label>
                        <Input id={`url-proj-${proj.id}`} value={proj.url} onChange={(e) => handleDynamicChange('projects', proj.id, 'url', e.target.value)} />
                      </div>
                    <div className="space-y-2">
                      <Label htmlFor={`description-proj-${proj.id}`}>Description</Label>
                      <Textarea id={`description-proj-${proj.id}`} value={proj.description} onChange={(e) => handleDynamicChange('projects', proj.id, 'description', e.target.value)} rows={3} />
                      <DescriptionRewriter
                        jobDescription={proj.description}
                        onRewrite={(newDesc) => handleDynamicChange('projects', proj.id, 'description', newDesc)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={() => addDynamicItem('projects', { id: crypto.randomUUID(), name: '', description: '', url: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Add Project</Button>
            </AccordionContent>
          </Card>
        </AccordionItem>
        
        <AccordionItem value="item-7" className="border-none">
           <Card>
            <AccordionTrigger className="p-6 text-lg font-semibold">Custom Sections</AccordionTrigger>
            <AccordionContent className="px-6 space-y-4">
              {resumeData.customSections.map((section, index) => (
                <Card key={section.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Custom Section #{index + 1}</h4>
                      <Button variant="ghost" size="icon" onClick={() => removeDynamicItem('customSections', section.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`title-custom-${section.id}`}>Section Title</Label>
                        <Input id={`title-custom-${section.id}`} value={section.title} onChange={(e) => handleDynamicChange('customSections', section.id, 'title', e.target.value)} />
                      </div>
                    <div className="space-y-2">
                      <Label htmlFor={`description-custom-${section.id}`}>Content</Label>
                      <Textarea id={`description-custom-${section.id}`} value={section.description} onChange={(e) => handleDynamicChange('customSections', section.id, 'description', e.target.value)} rows={4} />
                       <DescriptionRewriter
                          jobDescription={section.description}
                          onRewrite={(newDesc) => handleDynamicChange('customSections', section.id, 'description', newDesc)}
                        />
                    </div>
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={() => addDynamicItem('customSections', { id: crypto.randomUUID(), title: 'New Section', description: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Add Custom Section</Button>
            </AccordionContent>
          </Card>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
