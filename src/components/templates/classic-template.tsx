
import type { ResumeData } from "@/types/resume";
import { Mail, Phone, Linkedin, Github, Globe } from "lucide-react";

const formatDate = (dateString: string) => {
    if (!dateString || dateString.toLowerCase() === 'present') return "Present";
    const [year] = dateString.split('-');
    return year;
};

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <section className={`mb-6 ${className}`}>
    <h2 className="text-[1.1em] font-bold uppercase tracking-wider pb-1 border-b-2 border-gray-800 dark:border-gray-300 mb-3">{title}</h2>
    <div className="text-[1em]">{children}</div>
  </section>
);


export default function ClassicTemplate({ data }: { data: ResumeData }) {
    const { personalInfo, summary, experience, education, skills, projects, customSections } = data;

    return (
        <div className="p-8 bg-white text-gray-800 w-[794px] min-h-[1123px] font-times">
            <header className="text-center mb-8">
                <h1 className="text-[2.5em] font-bold tracking-wider">{personalInfo.name}</h1>
                <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 text-[0.85em] mt-2 text-gray-600">
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.linkedin && personalInfo.linkedin.trim() && <a href={`https://` + personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{personalInfo.linkedin}</a>}
                    {personalInfo.github && personalInfo.github.trim() && <a href={`https://` + personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{personalInfo.github}</a>}
                </div>
            </header>

            <main>
                {summary && (
                  <Section title="Summary">
                      <p className="text-[0.9em] leading-relaxed">{summary}</p>
                  </Section>
                )}
                
                {education && education.length > 0 && (
                  <Section title="Education">
                    <div className="space-y-4">
                      {education.map(edu => (
                        <div key={edu.id}>
                          <div className="flex justify-between items-start">
                            <div>
                               <h3 className="text-[1em] font-bold">{edu.institution}</h3>
                               <p className="text-[0.9em]">{edu.degree}</p>
                            </div>
                            <p className="text-[0.9em] text-gray-600 shrink-0 ml-4">{edu.endDate.toLowerCase() === 'present' ? 'Pursuing' : `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {experience && experience.length > 0 && (
                  <Section title="Experience">
                      <div className="space-y-4">
                          {experience.map(exp => (
                              <div key={exp.id}>
                                  <div className="flex justify-between items-start">
                                      <div>
                                          <h3 className="text-[1em] font-bold">{exp.company}</h3>
                                          <p className="text-[0.9em] italic">{exp.jobTitle}</p>
                                      </div>
                                      <p className="text-[0.9em] text-gray-600 shrink-0 ml-4">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                                  </div>
                                  <div className="mt-1.5 text-[0.9em] whitespace-pre-line pl-4" dangerouslySetInnerHTML={{ __html: exp.description.replace(/•/g, '- ') }} />
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
                           <h3 className="text-[1em] font-bold">{proj.name}</h3>
                           <p className="mt-1 text-[0.9em]">{proj.description}</p>
                           {proj.url && proj.url.trim() && <a href={`https://` + proj.url} target="_blank" rel="noopener noreferrer" className="text-[0.9em] text-primary hover:underline">
                              {proj.url}
                           </a>}
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {skills && skills.length > 0 && (
                  <Section title="Skills">
                      <p className="text-[0.9em] leading-relaxed">
                          {skills.join(', ')}
                      </p>
                  </Section>
                )}

                {customSections && customSections.length > 0 && customSections.map(section => (
                    <Section key={section.id} title={section.title}>
                        <div className="mt-1.5 text-[0.9em] whitespace-pre-line" dangerouslySetInnerHTML={{ __html: section.description.replace(/•/g, '- ') }} />
                    </Section>
                ))}
            </main>
        </div>
    );
}
