import type { ResumeData } from "@/types/resume";
import { Mail, Phone, Linkedin, Github, Globe } from "lucide-react";

const formatDate = (dateString: string) => {
    if (!dateString || dateString.toLowerCase() === 'present') return "Present";
    const [year, month] = dateString.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export default function ModernTemplate({ data }: { data: ResumeData }) {
    const { personalInfo, summary, experience, education, skills, projects } = data;

    return (
        <div className="font-body bg-white text-gray-800 flex w-[794px] min-h-[1123px]">
            {/* Left Sidebar */}
            <aside className="w-1/3 bg-gray-800 text-white p-8">
                <h1 className="text-3xl font-bold text-white mb-2 font-headline">{personalInfo.name}</h1>
                
                <section className="mt-8">
                    <h2 className="text-lg font-semibold text-primary uppercase tracking-wider mb-3">Contact</h2>
                    <div className="text-sm space-y-2 text-gray-300">
                        {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 hover:text-primary transition-colors"><Mail size={14} /><span>{personalInfo.email}</span></a>}
                        {personalInfo.phone && <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors"><Phone size={14} /><span>{personalInfo.phone}</span></a>}
                        {personalInfo.linkedin && <a href={`https://` + personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors"><Linkedin size={14} /><span>LinkedIn</span></a>}
                        {personalInfo.github && <a href={`https://` + personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors"><Github size={14} /><span>GitHub</span></a>}
                    </div>
                </section>

                {skills && skills.length > 0 && (
                  <section className="mt-8">
                      <h2 className="text-lg font-semibold text-primary uppercase tracking-wider mb-3">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                          {skills.map(skill => (
                              <span key={skill} className="bg-gray-700 text-white text-xs font-medium px-3 py-1 rounded-md">{skill}</span>
                          ))}
                      </div>
                  </section>
                )}

                {education && education.length > 0 && (
                  <section className="mt-8">
                      <h2 className="text-lg font-semibold text-primary uppercase tracking-wider mb-3">Education</h2>
                      <div className="space-y-4 text-sm">
                          {education.map(edu => (
                              <div key={edu.id}>
                                  <h3 className="font-semibold text-base text-white">{edu.institution}</h3>
                                  <p className="text-gray-300">{edu.degree}</p>
                                  <p className="text-xs text-gray-400 mt-1">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                              </div>
                          ))}
                      </div>
                  </section>
                )}
            </aside>

            {/* Main Content */}
            <main className="w-2/3 p-8">
                {summary && (
                  <section className="mb-8">
                      <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-4 font-headline">Summary</h2>
                      <p className="text-sm text-gray-700">{summary}</p>
                  </section>
                )}
                
                {experience && experience.length > 0 && (
                  <section className="mb-8">
                      <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-4 font-headline">Experience</h2>
                      <div className="space-y-5">
                          {experience.map(exp => (
                              <div key={exp.id}>
                                  <div className="flex justify-between items-baseline">
                                      <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h3>
                                      <p className="text-sm text-gray-500">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                                  </div>
                                  <p className="text-md font-medium text-primary italic">{exp.company}</p>
                                  <div className="mt-2 text-sm text-gray-600 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: exp.description.replace(/•/g, '<span class="text-primary mr-2">&#8227;</span>') }} />
                              </div>
                          ))}
                      </div>
                  </section>
                )}

                {projects && projects.length > 0 && (
                  <section>
                      <h2 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-4 font-headline">Projects</h2>
                      <div className="space-y-4">
                          {projects.map(proj => (
                              <div key={proj.id}>
                                  <div className="flex items-center gap-2">
                                      <h3 className="font-semibold text-lg text-gray-900">{proj.name}</h3>
                                      {proj.url && <a href={`https://` + proj.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                          <Globe size={16} />
                                      </a>}
                                  </div>
                                  <p className="mt-1 text-sm text-gray-600">{proj.description}</p>
                              </div>
                          ))}
                      </div>
                  </section>
                )}
            </main>
        </div>
    );
}
