import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, GraduationCap, Code, Award, Mail, Phone, MapPin, Globe, Linkedin, Download, X } from "lucide-react";
import { motion } from "framer-motion";

interface ResumePreviewProps {
  resume: any;
  onClose: () => void;
  onEdit?: () => void;
}

export function ResumePreview({ resume, onClose, onEdit }: ResumePreviewProps) {
  if (!resume) return null;

  const personalInfo = resume.personalInfo || {};
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];

  const formatDate = (dateStr: string, current: boolean) => {
    if (current) return "Present";
    if (!dateStr) return "";
    const date = new Date(dateStr + "-01");
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-slate-900 text-white">
          <h2 className="text-xl font-bold">Resume Preview</h2>
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button variant="outline" onClick={onEdit} className="border-slate-700 text-white">
                Edit
              </Button>
            )}
            <Button variant="outline" onClick={onClose} className="border-slate-700 text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Personal Info */}
            <div className="text-center pb-6 border-b-2 border-slate-200">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {personalInfo.fullName || "Your Name"}
              </h1>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 mt-3">
                {personalInfo.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {personalInfo.email}
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {personalInfo.phone}
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {personalInfo.location}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 mt-2">
                {personalInfo.linkedin && (
                  <div className="flex items-center gap-1">
                    <Linkedin className="h-4 w-4" />
                    {personalInfo.linkedin}
                  </div>
                )}
                {personalInfo.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {personalInfo.website}
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            {personalInfo.summary && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">Professional Summary</h2>
                <p className="text-slate-700 leading-relaxed">{personalInfo.summary}</p>
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-slate-600" />
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {experience.map((exp: any) => (
                    <div key={exp.id} className="border-l-2 border-slate-300 pl-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-900">{exp.position}</h3>
                        <span className="text-sm text-slate-600 whitespace-nowrap ml-4">
                          {formatDate(exp.startDate, false)} - {formatDate(exp.endDate, exp.current)}
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium mb-1">{exp.company}</p>
                      {exp.location && (
                        <p className="text-sm text-slate-600 mb-2">{exp.location}</p>
                      )}
                      {exp.description && (
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-slate-600" />
                  Education
                </h2>
                <div className="space-y-4">
                  {education.map((edu: any) => (
                    <div key={edu.id} className="border-l-2 border-slate-300 pl-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-900">{edu.degree} in {edu.field}</h3>
                        <span className="text-sm text-slate-600 whitespace-nowrap ml-4">
                          {formatDate(edu.startDate, false)} - {formatDate(edu.endDate, edu.current)}
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium mb-1">{edu.institution}</p>
                      {edu.location && (
                        <p className="text-sm text-slate-600">{edu.location}</p>
                      )}
                      {edu.gpa && (
                        <p className="text-sm text-slate-600 mt-1">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Code className="h-5 w-5 text-slate-600" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-slate-200 text-slate-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-slate-600" />
                  Projects
                </h2>
                <div className="space-y-4">
                  {projects.map((proj: any) => (
                    <div key={proj.id} className="border-l-2 border-slate-300 pl-4">
                      <h3 className="font-bold text-slate-900 mb-1">{proj.name}</h3>
                      {proj.description && (
                        <p className="text-slate-700 leading-relaxed mb-2">{proj.description}</p>
                      )}
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {proj.technologies.map((tech: string) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {proj.link}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
