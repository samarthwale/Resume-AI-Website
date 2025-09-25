
import type { ResumeData } from "@/types/resume";

const formatDate = (dateString: string) => {
    if (!dateString || dateString.toLowerCase() === 'present') return "Present";
    const [year] = dateString.split('-');
    return year;
};

export default function MinimalistTemplate({ data }: { data: ResumeData }) {
    const { personalInfo, summary, experience, education, skills, projects, customSections } = data;
    
    const contactInfo = [
        personalInfo.email,
        personalInfo.phone,
        personalInfo.linkedin,
        personalInfo.github,
    ].filter(Boolean).filter(s => s.trim() !== '');

    return (
        <div className="p-10 bg-white text-gray-900 w-[794px] min-h-[1123px]">
            <header className="mb-10 text-center">
                <h1 className="text-[2.25em] font-bold tracking-tight">{personalInfo.name}</h1>
                 {contactInfo.length > 0 && (
                    <p className="mt-2 text-[0.875em] text-gray-500">
                        {contactInfo.join(' | ')}
                    </p>
                )}
            </header>

            <main>
                {summary && (
                  <section className="mb-8">
                      <h2 className="text-[0.875em] font-bold uppercase tracking-widest text-gray-500 mb-3">Summary</h2>
                      <p className="text-[0.875em] text-gray-700 leading-relaxed">{summary}</p>
                  </section>
                )}

                {experience && experience.length > 0 && (
                  <section className="mb-8">
                      <h2 className="text-[0.875em] font-bold uppercase tracking-widest text-gray-500 mb-4">Experience</h2>
                      <div className="space-y-5">
                          {experience.map(exp => (
                              <div key={exp.id}>
                                  <div className="flex justify-between items-start">
                                      <div>
                                          <h3 className="text-[1em] font-semibold">{exp.jobTitle}</h3>
                                          <p className="text-[0.875em] text-gray-600">{exp.company}</p>
                                      </div>
                                      <p className="text-[0.75em] text-gray-500 text-right shrink-0 ml-4">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                                  </div>
                                  <div className="mt-1.5 text-[0.875em] text-gray-700 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: exp.description.replace(/•/g, '<span class="mr-2">&ndash;</span>') }} />
                              </div>
                          ))}
                      </div>
                  </section>
                )}

                {projects && projects.length > 0 && (
                  <section className="mb-8">
                      <h2 className="text-[0.875em] font-bold uppercase tracking-widest text-gray-500 mb-4">Projects</h2>
                      <div className="space-y-4">
                          {projects.map(proj => (
                              <div key={proj.id}>
                                  <div className="flex justify-between items-start">
                                      <h3 className="text-[1em] font-semibold">{proj.name}</h3>
                                       {proj.url && proj.url.trim() && <a href={`https://` + proj.url} target="_blank" rel="noopener noreferrer" className="text-[0.75em] text-primary hover:underline shrink-0 ml-4">
                                          View Project
                                       </a>}
                                  </div>
                                  <p className="mt-1 text-[0.875em] text-gray-700">{proj.description}</p>
                              </div>
                          ))}
                      </div>
                  </section>
                )}

                {customSections && customSections.length > 0 && customSections.map(section => (
                    <section key={section.id} className="mb-8">
                        <h2 className="text-[0.875em] font-bold uppercase tracking-widest text-gray-500 mb-4">{section.title}</h2>
                        <div className="text-[0.875em] text-gray-700 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: section.description.replace(/•/g, '<span class="mr-2">&ndash;</span>') }} />
                    </section>
                ))}

                <div className="grid grid-cols-2 gap-x-12">
                     {education && education.length > 0 && (
                       <section>
                          <h2 className="text-[0.875em] font-bold uppercase tracking-widest text-gray-500 mb-4">Education</h2>
                          <div className="space-y-3">
                              {education.map(edu => (
                                  <div key={edu.id}>
                                      <h3 className="text-[1em] font-semibold">{edu.institution}</h3>
                                      <p className="text-[0.875em] text-gray-600">{edu.degree}</p>
                                      <p className="text-[0.75em] text-gray-500 mt-0.5">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                                  </div>
                              ))}
                          </div>
                      </section>
                     )}

                    {skills && skills.length > 0 && (
                      <section>
                          <h2 className="text-[0.875em] font-bold uppercase tracking-widest text-gray-500 mb-4">Skills</h2>
                          <p className="text-[0.875em] text-gray-700 leading-relaxed">
                              {skills.join(' • ')}
                          </p>
                      </section>
                    )}
                </div>

            </main>
        </div>
    );
}
