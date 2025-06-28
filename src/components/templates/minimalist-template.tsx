import type { ResumeData } from "@/types/resume";

const formatDate = (dateString: string) => {
    if (!dateString || dateString.toLowerCase() === 'present') return "Present";
    const [year, month] = dateString.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export default function MinimalistTemplate({ data }: { data: ResumeData }) {
    const { personalInfo, summary, experience, education, skills, projects } = data;

    return (
        <div className="p-10 font-body bg-white text-gray-900 w-[794px] min-h-[1123px]">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight font-headline">{personalInfo.name}</h1>
                <p className="mt-2 text-sm text-gray-500">
                    {personalInfo.email} | {personalInfo.phone} | {personalInfo.linkedin} | {personalInfo.github}
                </p>
            </header>

            <main>
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Summary</h2>
                    <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Experience</h2>
                    <div className="space-y-5">
                        {experience.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-base font-semibold">{exp.jobTitle}</h3>
                                        <p className="text-sm text-gray-600">{exp.company}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 text-right shrink-0 ml-4">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                                </div>
                                <div className="mt-1.5 text-sm text-gray-700 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: exp.description.replace(/•/g, '<span class="mr-2">&ndash;</span>') }} />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Projects</h2>
                    <div className="space-y-4">
                        {projects.map(proj => (
                            <div key={proj.id}>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-base font-semibold">{proj.name}</h3>
                                     <a href={`https://` + proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline shrink-0 ml-4">
                                        View Project
                                     </a>
                                </div>
                                <p className="mt-1 text-sm text-gray-700">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-x-12">
                     <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Education</h2>
                        <div className="space-y-3">
                            {education.map(edu => (
                                <div key={edu.id}>
                                    <h3 className="text-base font-semibold">{edu.institution}</h3>
                                    <p className="text-sm text-gray-600">{edu.degree}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Skills</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {skills.join(' • ')}
                        </p>
                    </section>
                </div>

            </main>
        </div>
    );
}
