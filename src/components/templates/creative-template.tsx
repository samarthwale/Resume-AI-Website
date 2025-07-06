import type { ResumeData } from "@/types/resume";
import { Mail, Phone, Linkedin, Github, Globe, Briefcase, GraduationCap } from "lucide-react";
import Image from 'next/image';

const formatDate = (dateString: string) => {
  if (!dateString || dateString.toLowerCase() === 'present') return "Present";
  const [year, month] = dateString.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const TimelineItem: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
    <div className="flex gap-4">
        <div className="flex flex-col items-center">
            <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center z-10">
                {icon}
            </div>
            <div className="w-px h-full bg-primary/30"></div>
        </div>
        <div className="pb-8">{children}</div>
    </div>
);


export default function CreativeTemplate({ data }: { data: ResumeData }) {
    const { personalInfo, summary, experience, education, skills, projects } = data;

    return (
        <div className="p-8 font-body bg-slate-50 text-slate-800 w-[794px] min-h-[1123px]">
            <header className="grid grid-cols-3 gap-8 items-center mb-8">
                <div className="col-span-1">
                    <div className="w-32 h-32 rounded-full overflow-hidden mx-auto bg-slate-200">
                      <Image 
                        src={`https://placehold.co/128x128.png`} 
                        alt="Profile picture"
                        width={128}
                        height={128}
                        className="object-cover"
                        data-ai-hint="person portrait"
                      />
                    </div>
                </div>
                <div className="col-span-2 text-right">
                    <h1 className="text-5xl font-extrabold text-primary font-headline">{personalInfo.name}</h1>
                    {summary && <>
                      <p className="text-xl text-slate-500 mt-1">Professional Summary</p>
                      <p className="text-sm mt-4 text-slate-600">{summary}</p>
                    </>}
                </div>
            </header>
            
            <div className="w-full h-px bg-slate-300 my-8"></div>

            <div className="grid grid-cols-3 gap-8">
                {/* Left col */}
                <div className="col-span-1 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-primary mb-4">Contact</h2>
                        <div className="text-sm space-y-2 text-slate-700">
                           <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 hover:text-primary transition-colors"><Mail size={14} /><span>{personalInfo.email}</span></a>
                           <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors"><Phone size={14} /><span>{personalInfo.phone}</span></a>
                           <a href={`https://` + personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors"><Linkedin size={14} /><span>{personalInfo.linkedin}</span></a>
                           <a href={`https://` + personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors"><Github size={14} /><span>{personalInfo.github}</span></a>
                        </div>
                    </section>
                    {skills && skills.length > 0 && (
                      <section>
                          <h2 className="text-xl font-bold text-primary mb-4">Skills</h2>
                          <div className="flex flex-wrap gap-2">
                              {skills.map(skill => (
                                  <span key={skill} className="bg-primary/10 text-primary-800 text-xs font-semibold px-3 py-1 rounded-md">{skill}</span>
                              ))}
                          </div>
                      </section>
                    )}
                    {projects && projects.length > 0 && (
                      <section>
                          <h2 className="text-xl font-bold text-primary mb-4">Projects</h2>
                          <div className="space-y-4">
                          {projects.map(proj => (
                              <div key={proj.id}>
                                  <div className="flex items-center gap-2">
                                      <h3 className="font-semibold text-base text-slate-800">{proj.name}</h3>
                                      <a href={`https://` + proj.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                          <Globe size={14} />
                                      </a>
                                  </div>
                                  <p className="mt-1 text-sm text-slate-600">{proj.description}</p>
                              </div>
                          ))}
                          </div>
                      </section>
                    )}
                </div>

                {/* Right col */}
                <div className="col-span-2">
                    {experience && experience.length > 0 && (
                      <section>
                           <h2 className="text-2xl font-bold text-primary mb-6 font-headline">Career Timeline</h2>
                           {experience.map(exp => (
                              <TimelineItem key={exp.id} icon={<Briefcase size={20} />}>
                                   <p className="text-xs text-slate-500 -mt-8 mb-2">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                                  <h3 className="font-bold text-lg text-slate-900">{exp.jobTitle}</h3>
                                  <p className="text-md font-medium text-slate-600 italic">{exp.company}</p>
                                  <div className="mt-2 text-sm text-slate-700 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: exp.description.replace(/•/g, '<span class="text-primary mr-2">&#8227;</span>') }} />
                              </TimelineItem>
                           ))}
                      </section>
                    )}
                    {education && education.length > 0 && (
                      <section className="mt-8">
                           <h2 className="text-2xl font-bold text-primary mb-6 font-headline">Education</h2>
                           {education.map(edu => (
                              <TimelineItem key={edu.id} icon={<GraduationCap size={20} />}>
                                   <p className="text-xs text-slate-500 -mt-8 mb-2">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                                  <h3 className="font-bold text-lg text-slate-900">{edu.institution}</h3>
                                  <p className="text-md font-medium text-slate-600">{edu.degree}</p>
                              </TimelineItem>
                           ))}
                      </section>
                    )}
                </div>
            </div>
        </div>
    );
}
