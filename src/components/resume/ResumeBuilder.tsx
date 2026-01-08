import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Save, Eye, X, FileText, Briefcase, GraduationCap, Code, Award, Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";

interface ResumeBuilderProps {
  resumeId?: Id<"resumes"> | null;
  onClose: () => void;
  onSave?: () => void;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
    summary: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Array<{ id: string; name: string; issuer: string; date: string }>;
  languages: Array<{ id: string; language: string; proficiency: string }>;
}

const apiAny = api as any;

export function ResumeBuilder({ resumeId, onClose, onSave }: ResumeBuilderProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
  });

  const createResume = useMutation(apiAny.resumes.createResumeManually);
  const updateResume = useMutation(apiAny.resumes.updateResumeManually);
  const existingResume = useQuery(apiAny.resumes.getResume, resumeId ? { id: resumeId } : "skip");

  useEffect(() => {
    if (existingResume) {
      setResumeData({
        personalInfo: existingResume.personalInfo || resumeData.personalInfo,
        experience: existingResume.experience || [],
        education: existingResume.education || [],
        skills: existingResume.skills || [],
        projects: existingResume.projects || [],
        certifications: existingResume.certifications || [],
        languages: existingResume.languages || [],
      });
    }
  }, [existingResume]);

  const handleSave = async () => {
    try {
      if (!resumeData.personalInfo.fullName) {
        toast.error("Please enter your full name");
        return;
      }

      if (resumeId) {
        await updateResume({
          id: resumeId,
          personalInfo: resumeData.personalInfo,
          experience: resumeData.experience,
          education: resumeData.education,
          skills: resumeData.skills,
          projects: resumeData.projects,
          certifications: resumeData.certifications,
          languages: resumeData.languages,
        });
        toast.success("Resume updated successfully!");
      } else {
        await createResume({
          fileName: `${resumeData.personalInfo.fullName}'s Resume`,
          personalInfo: resumeData.personalInfo,
          experience: resumeData.experience,
          education: resumeData.education,
          skills: resumeData.skills,
          projects: resumeData.projects,
          certifications: resumeData.certifications,
          languages: resumeData.languages,
        });
        toast.success("Resume created successfully!");
      }

      onSave?.();
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save resume");
    }
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          id: Date.now().toString(),
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    });
  };

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((exp) => exp.id !== id),
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          id: Date.now().toString(),
          institution: "",
          degree: "",
          field: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          gpa: "",
        },
      ],
    });
  };

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((edu) => edu.id !== id),
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        {
          id: Date.now().toString(),
          name: "",
          description: "",
          technologies: [],
          link: "",
        },
      ],
    });
  };

  const removeProject = (id: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter((proj) => proj.id !== id),
    });
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    });
  };

  const addSkill = (skill: string) => {
    if (skill && !resumeData.skills.includes(skill)) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, skill],
      });
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((s) => s !== skill),
    });
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
        className="bg-slate-900 rounded-2xl border border-slate-800 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {resumeId ? "Edit Resume" : "Create New Resume"}
              </h2>
              <p className="text-sm text-slate-400">Build your professional resume</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Full Name *</Label>
                      <Input
                        value={resumeData.personalInfo.fullName}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, fullName: e.target.value },
                          })
                        }
                        placeholder="John Doe"
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Email *</Label>
                      <Input
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                          })
                        }
                        placeholder="john@example.com"
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Phone</Label>
                      <Input
                        value={resumeData.personalInfo.phone}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
                          })
                        }
                        placeholder="+1 (555) 123-4567"
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Location</Label>
                      <Input
                        value={resumeData.personalInfo.location}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, location: e.target.value },
                          })
                        }
                        placeholder="San Francisco, CA"
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">LinkedIn</Label>
                      <Input
                        value={resumeData.personalInfo.linkedin}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value },
                          })
                        }
                        placeholder="linkedin.com/in/johndoe"
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Website</Label>
                      <Input
                        value={resumeData.personalInfo.website}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, website: e.target.value },
                          })
                        }
                        placeholder="johndoe.com"
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-300">Professional Summary</Label>
                    <Textarea
                      value={resumeData.personalInfo.summary}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, summary: e.target.value },
                        })
                      }
                      placeholder="A brief summary of your professional background and career objectives..."
                      rows={4}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Work Experience
                </h3>
                <Button onClick={addExperience} size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>

              {resumeData.experience.length === 0 ? (
                <Card className="bg-slate-800/30 border-slate-700 border-dashed">
                  <CardContent className="py-12 text-center">
                    <Briefcase className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No experience added yet</p>
                    <p className="text-sm text-slate-500 mt-1">Click "Add Experience" to get started</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {resumeData.experience.map((exp) => (
                    <Card key={exp.id} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <h4 className="text-white font-semibold">Experience Entry</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExperience(exp.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-slate-300">Company *</Label>
                            <Input
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                              placeholder="Tech Corp"
                              className="bg-slate-900 border-slate-700 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-slate-300">Position *</Label>
                            <Input
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                              placeholder="Senior Software Engineer"
                              className="bg-slate-900 border-slate-700 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-slate-300">Location</Label>
                            <Input
                              value={exp.location}
                              onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                              placeholder="New York, NY"
                              className="bg-slate-900 border-slate-700 text-white"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-slate-300">Start Date</Label>
                              <Input
                                type="month"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                                className="bg-slate-900 border-slate-700 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-slate-300">End Date</Label>
                              <Input
                                type="month"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                                disabled={exp.current}
                                className="bg-slate-900 border-slate-700 text-white disabled:opacity-50"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`current-${exp.id}`}
                            checked={exp.current}
                            onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                            className="rounded border-slate-700 bg-slate-900"
                          />
                          <Label htmlFor={`current-${exp.id}`} className="text-slate-300 cursor-pointer">
                            I currently work here
                          </Label>
                        </div>
                        <div>
                          <Label className="text-slate-300">Description</Label>
                          <Textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                            placeholder="Describe your responsibilities and achievements..."
                            rows={4}
                            className="bg-slate-900 border-slate-700 text-white"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Education
                </h3>
                <Button onClick={addEducation} size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </div>

              {resumeData.education.length === 0 ? (
                <Card className="bg-slate-800/30 border-slate-700 border-dashed">
                  <CardContent className="py-12 text-center">
                    <GraduationCap className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No education added yet</p>
                    <p className="text-sm text-slate-500 mt-1">Click "Add Education" to get started</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {resumeData.education.map((edu) => (
                    <Card key={edu.id} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <h4 className="text-white font-semibold">Education Entry</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(edu.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-slate-300">Institution *</Label>
                            <Input
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                              placeholder="University Name"
                              className="bg-slate-900 border-slate-700 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-slate-300">Degree *</Label>
                            <Input
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                              placeholder="Bachelor of Science"
                              className="bg-slate-900 border-slate-700 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-slate-300">Field of Study *</Label>
                            <Input
                              value={edu.field}
                              onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                              placeholder="Computer Science"
                              className="bg-slate-900 border-slate-700 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-slate-300">Location</Label>
                            <Input
                              value={edu.location}
                              onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                              placeholder="Boston, MA"
                              className="bg-slate-900 border-slate-700 text-white"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-slate-300">Start Date</Label>
                              <Input
                                type="month"
                                value={edu.startDate}
                                onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                                className="bg-slate-900 border-slate-700 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-slate-300">End Date</Label>
                              <Input
                                type="month"
                                value={edu.endDate}
                                onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                                disabled={edu.current}
                                className="bg-slate-900 border-slate-700 text-white disabled:opacity-50"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-slate-300">GPA (Optional)</Label>
                            <Input
                              value={edu.gpa}
                              onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                              placeholder="3.8/4.0"
                              className="bg-slate-900 border-slate-700 text-white"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`edu-current-${edu.id}`}
                            checked={edu.current}
                            onChange={(e) => updateEducation(edu.id, "current", e.target.checked)}
                            className="rounded border-slate-700 bg-slate-900"
                          />
                          <Label htmlFor={`edu-current-${edu.id}`} className="text-slate-300 cursor-pointer">
                            Currently enrolled
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      id="skill-input"
                      placeholder="Add a skill (press Enter)"
                      className="bg-slate-900 border-slate-700 text-white"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const input = e.currentTarget;
                          addSkill(input.value);
                          input.value = "";
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById("skill-input") as HTMLInputElement;
                        addSkill(input.value);
                        input.value = "";
                      }}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill) => (
                      <div
                        key={skill}
                        className="px-3 py-1.5 bg-primary/20 text-primary rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="hover:text-primary/70"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {resumeData.skills.length === 0 && (
                    <p className="text-slate-500 text-sm text-center py-4">
                      No skills added yet. Type a skill and press Enter to add.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Projects
                </h3>
                <Button onClick={addProject} size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>

              {resumeData.projects.length === 0 ? (
                <Card className="bg-slate-800/30 border-slate-700 border-dashed">
                  <CardContent className="py-12 text-center">
                    <Award className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No projects added yet</p>
                    <p className="text-sm text-slate-500 mt-1">Click "Add Project" to showcase your work</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {resumeData.projects.map((proj) => (
                    <Card key={proj.id} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <h4 className="text-white font-semibold">Project Entry</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProject(proj.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <Label className="text-slate-300">Project Name *</Label>
                            <Input
                              value={proj.name}
                              onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                              placeholder="My Awesome Project"
                              className="bg-slate-900 border-slate-700 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-slate-300">Description *</Label>
                            <Textarea
                              value={proj.description}
                              onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                              placeholder="Describe what the project does and your role..."
                              rows={3}
                              className="bg-slate-900 border-slate-700 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-slate-300">Technologies (comma-separated)</Label>
                            <Input
                              value={proj.technologies.join(", ")}
                              onChange={(e) =>
                                updateProject(
                                  proj.id,
                                  "technologies",
                                  e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                                )
                              }
                              placeholder="React, TypeScript, Node.js"
                              className="bg-slate-900 border-slate-700 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-slate-300">Project Link (Optional)</Label>
                            <Input
                              value={proj.link}
                              onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                              placeholder="https://github.com/username/project"
                              className="bg-slate-900 border-slate-700 text-white"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex items-center justify-between">
          <Button variant="outline" onClick={onClose} className="border-slate-700 text-slate-300">
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 font-bold">
              <Save className="h-4 w-4 mr-2" />
              {resumeId ? "Update Resume" : "Create Resume"}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
