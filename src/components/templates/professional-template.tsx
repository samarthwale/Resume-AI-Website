
import type { ResumeData } from "@/types/resume";
import { Mail, Phone, Linkedin, Github, Globe } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
}

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <section className={`mb-6 ${className}`}>
    <h2 className="text-[1.25em] font-bold text-primary mb-3 pb-1.5 border-b-2 border-primary/30 font-headline">{title}</h2>
    <div className="text-[0.875em] text-gray-700">{children}</div>
  </section>
);

const formatDate = (dateString: string) => {
  if (!dateString || dateString.toLowerCase() === 'present') return "Present";
  const [year] = dateString.split('-');
  return year;
};


export default function ProfessionalTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, customSections } = data;

  return (
    <div className="p-8 font-body bg-white text-gray-800 w-[794px] min-h-[1123px]">
      <header className="text-center mb-8">
        <h1 className="text-[2.25em] font-bold text-primary font-headline">{personalInfo.name}</h1>
        <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-2 text-[0.75em] mt-2 text-gray-600">
          {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors"><Mail size={12} />{personalInfo.email}</a>}
          {personalInfo.phone && <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors"><Phone size={12} />{personalInfo.phone}</a>}
          {personalInfo.linkedin && <a href={`https://` + personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors"><Linkedin size={12} />{personalInfo.linkedin}</a>}
          {personalInfo.github && <a href={`https://` + personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors"><Github size={12} />{personalInfo.github}</a>}
        </div>
      </header>
      
      {summary && <Section title="Professional Summary">
        <p className="text-[0.875em]">{summary}</p>
      </Section>}
      
      {experience && experience.length > 0 && (
        <Section title="Work Experience">
          <div className="space-y-4">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-[1em] text-gray-800">{exp.jobTitle}</h3>
                  <p className="text-[0.75em] text-gray-500">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                </div>
                <p className="text-[0.875em] font-medium text-gray-600 italic">{exp.company}</p>
                <div className="mt-1.5 text-[0.875em] text-gray-700 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: exp.description.replace(/•/g, '<span class="text-primary mr-2">•</span>') }} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {projects && projects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-4">
            {projects.map(proj => (
              <div key={proj.id}>
                <div className="flex items-center gap-2">
                   <h3 className="font-semibold text-[1em] text-gray-800">{proj.name}</h3>
                   {proj.url && <a href={`https://` + proj.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      <Globe size={14} />
                   </a>}
                </div>
                <p className="mt-1 text-[0.875em]">{proj.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {customSections && customSections.length > 0 && customSections.map(section => (
        <Section key={section.id} title={section.title}>
          <div className="mt-1.5 text-[0.875em] text-gray-700 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: section.description.replace(/•/g, '<span class="text-primary mr-2">•</span>') }} />
        </Section>
      ))}
      
      <div className="grid grid-cols-2 gap-8">
        {education && education.length > 0 && (
          <Section title="Education">
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id}>
                  <h3 className="font-semibold text-[1em] text-gray-800">{edu.institution}</h3>
                  <p className="text-[0.875em] font-medium text-gray-600">{edu.degree}</p>
                  <p className="text-[0.75em] text-gray-500 mt-1">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                </div>
              ))}
            </div>
          </Section>
        )}
        
        {skills && skills.length > 0 && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill} className="bg-primary/10 text-primary text-[0.75em] font-medium px-2.5 py-1 rounded-full">{skill}</span>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
