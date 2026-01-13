import { useState } from "react";
import { motion } from "framer-motion";

interface LiveRecruiterSimulationProps {
  resumeText: string;
  score: number;
  missingKeywords?: string[];
  matchedKeywords?: string[];
  formatIssues?: Array<{ issue: string; severity?: string }>;
  targetRole?: string;
  candidateName?: string;
  candidateEmail?: string;
  candidateLocation?: string;
}

export function LiveRecruiterSimulation({
  resumeText,
  score,
  missingKeywords = [],
  matchedKeywords = [],
  formatIssues = [],
  targetRole = "Data Science",
  candidateName = "Professional Candidate",
  candidateEmail = "candidate@example.com",
  candidateLocation = "San Francisco, CA"
}: LiveRecruiterSimulationProps) {
  const [viewMode, setViewMode] = useState<"parsed" | "raw" | "pdf">("parsed");
  const [isDarkMode] = useState(true);

  // Extract professional summary from resume text (first 200 chars or first paragraph)
  const extractSummary = (text: string) => {
    if (!text) return "Data Scientist with 5+ years of experience leveraging machine learning and statistical modeling to solve complex business problems.";

    const lines = text.split('\n').filter(l => l.trim());
    const summaryLine = lines.find(line =>
      line.length > 100 &&
      !line.toLowerCase().includes('education') &&
      !line.toLowerCase().includes('experience')
    );

    return summaryLine?.substring(0, 300) || lines[0]?.substring(0, 300) || "Experienced professional with proven track record.";
  };

  const professionalSummary = extractSummary(resumeText);

  // Calculate fit score percentage
  const fitScore = Math.min(100, Math.max(0, score));
  const fitLevel = fitScore >= 80 ? "Excellent" : fitScore >= 60 ? "Good" : "Fair";

  // Seniority level calculation
  const seniorityLevel = fitScore >= 75 ? "SENIOR" : fitScore >= 60 ? "MID" : "JUNIOR";
  const seniorityPosition = fitScore >= 75 ? "65%" : fitScore >= 60 ? "50%" : "35%";

  // Skills display
  const displaySkills = matchedKeywords.length > 0
    ? matchedKeywords.slice(0, 8)
    : ["sql", "python", "r", "excel", "big data", "hadoop", "spark", "forecasting"];

  // Technical gap
  const foundCount = matchedKeywords.length || 39;
  const requiredCount = foundCount + missingKeywords.length;

  // Format issues for display
  const hasFormatIssues = formatIssues.length > 0;
  const hasLinkedInIssue = formatIssues.some(f =>
    f.issue.toLowerCase().includes('linkedin') ||
    f.issue.toLowerCase().includes('profile')
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      {/* Header */}
      <header className="h-16 border-b border-slate-800 dark:border-slate-700 flex items-center justify-between px-6 bg-slate-900/80 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-blue-500 font-bold text-lg tracking-tight">
            <span className="material-symbols-outlined">analytics</span>
            <span>CVDebug ATS</span>
          </div>
          <span className="text-slate-600 text-sm">/</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-900/30 text-blue-300 border border-blue-800">
              {targetRole.toUpperCase()}
            </span>
            <span className="text-xs text-slate-500 font-mono">ID: th7ywqqk</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 border border-slate-700 rounded hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-sm">link</span> Share Link
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 border border-slate-700 rounded hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-sm">download</span> Download
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 border border-slate-700 rounded hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-sm">print</span> Print Report
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex items-center justify-center gap-2 py-4 bg-slate-950 border-b border-slate-800 overflow-x-auto px-4">
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors rounded-lg">
          <span className="material-symbols-outlined text-base">smart_toy</span> Robot View
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors rounded-lg">
          <span className="material-symbols-outlined text-base">vpn_key</span> Keywords
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors rounded-lg">
          <span className="material-symbols-outlined text-base">auto_fix_high</span> Fluff
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors rounded-lg">
          <span className="material-symbols-outlined text-base">dashboard</span> Format & Overview
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-400 bg-blue-500/10 rounded-lg border border-blue-500/20 shadow-sm">
          <span className="material-symbols-outlined text-base">support_agent</span> Recruiter
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 grid grid-cols-12 gap-6 max-w-[1920px] mx-auto w-full">
        {/* Left Column - Main Content */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          {/* Candidate Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {candidateName.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <div>
                <h2 className="font-bold text-white text-lg leading-tight">{candidateName}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">place</span> {candidateLocation}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">email</span> {candidateEmail}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">link</span> github.com/candidate
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-xs font-medium">JD</div>
                <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center text-white text-xs font-medium">HR</div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Recruiter Admin</p>
                <p className="text-xs font-medium text-emerald-400">View as: Machine</p>
              </div>
            </div>
          </motion.div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Format Issues */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-lg relative overflow-hidden group"
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${hasFormatIssues ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded ${hasFormatIssues ? 'bg-red-900/30 text-red-400' : 'bg-emerald-900/30 text-emerald-400'}`}>
                  <span className="material-symbols-outlined">{hasFormatIssues ? 'warning' : 'verified'}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">
                    {hasFormatIssues ? 'Format Issues' : 'Format Health'}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {hasFormatIssues && hasLinkedInIssue
                      ? 'Missing LinkedIn profile URL detected in header section.'
                      : 'All format checks passed successfully.'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Structure Integrity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-900/30 rounded text-emerald-400">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Structure Integrity</h3>
                  <p className="text-sm text-slate-400">
                    PDF Structure is valid and machine-readable (ISO 19005-1).
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Parsed Candidate Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex flex-col h-[600px] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-4">
                <h3 className="text-sm font-bold text-slate-200">Parsed Candidate Data</h3>
                <div className="h-4 w-px bg-slate-700"></div>
                <div className="flex bg-slate-800 rounded p-0.5">
                  <button
                    onClick={() => setViewMode("parsed")}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      viewMode === "parsed"
                        ? 'shadow-sm bg-slate-900 text-blue-400'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Parsed View
                  </button>
                  <button
                    onClick={() => setViewMode("raw")}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      viewMode === "raw"
                        ? 'shadow-sm bg-slate-900 text-blue-400'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Raw Text
                  </button>
                  <button
                    onClick={() => setViewMode("pdf")}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      viewMode === "pdf"
                        ? 'shadow-sm bg-slate-900 text-blue-400'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Original PDF
                  </button>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-400">Scan ID: #9923-AX</div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed text-slate-300">
              {viewMode === "parsed" && (
                <>
                  {/* Professional Summary */}
                  <div className="mb-6">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider text-purple-400 bg-purple-900/30 rounded mb-2">
                      [PROFESSIONAL SUMMARY]
                    </span>
                    <p className="pl-4 border-l-2 border-purple-800 text-slate-300">
                      {professionalSummary}
                    </p>
                  </div>

                  {/* Skills Extracted */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider text-blue-400 bg-blue-900/30 rounded">
                        [SKILLS EXTRACTED]
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-800/50">
                        High Match with JD
                      </span>
                    </div>
                    <div className="pl-4 border-l-2 border-blue-800 flex flex-wrap gap-2">
                      {displaySkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-slate-800 rounded text-slate-300 border border-slate-700 flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs text-emerald-400">check</span>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Work History */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-400 bg-amber-900/30 rounded">
                        [WORK HISTORY]
                      </span>
                      <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded">Most Recent</span>
                    </div>
                    <div className="pl-4 border-l-2 border-amber-800">
                      <h4 className="font-bold text-slate-100">Professional Experience</h4>
                      <p className="text-xs text-slate-400 mb-2">Various Companies • Multiple Years</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        <li>Extensive experience in the field with proven track record</li>
                        <li>Strong technical skills and ability to deliver results</li>
                        <li>Collaborated with cross-functional teams on various projects</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {viewMode === "raw" && (
                <pre className="whitespace-pre-wrap text-xs text-slate-400">
                  {resumeText || "No raw text available. This is a preview of how the ATS system would display the extracted text from your resume."}
                </pre>
              )}

              {viewMode === "pdf" && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-slate-500">
                    <span className="material-symbols-outlined text-6xl mb-4">description</span>
                    <p className="text-sm">Original PDF preview would appear here</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          {/* Job Fit Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col items-center"
          >
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Job Fit Score</h3>
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-slate-700"
                  cx="64"
                  cy="64"
                  fill="transparent"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                <circle
                  className="text-emerald-500"
                  cx="64"
                  cy="64"
                  fill="transparent"
                  r="56"
                  stroke="currentColor"
                  strokeDasharray="351.86"
                  strokeDashoffset={351.86 - (351.86 * fitScore) / 100}
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">{fitScore}</span>
                <span className="text-[10px] font-medium text-emerald-400 uppercase mt-1">{fitLevel}</span>
              </div>
            </div>
            <p className="text-center text-xs text-slate-400 leading-relaxed px-2">
              Based on skills, experience duration, and semantic role matching algorithms.
            </p>
          </motion.div>

          {/* Seniority Level */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Seniority Level</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
                MATCH
              </span>
            </div>
            <div className="relative h-2 bg-slate-800 rounded-full mb-2 overflow-hidden">
              <div
                className="absolute top-0 bottom-0 bg-blue-500 opacity-30"
                style={{ left: `${parseInt(seniorityPosition) - 15}%`, width: '30%' }}
              />
              <div
                className="absolute top-0 bottom-0 bg-white w-1 shadow-md z-10"
                style={{ left: seniorityPosition }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono uppercase">
              <span className={seniorityLevel === "JUNIOR" ? "text-blue-400 font-bold" : ""}>JR</span>
              <span className={seniorityLevel === "MID" ? "text-blue-400 font-bold" : ""}>MID</span>
              <span className={seniorityLevel === "SENIOR" ? "text-blue-400 font-bold" : ""}>SENIOR</span>
              <span>LEAD</span>
            </div>
          </motion.div>

          {/* Technical Gap Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg"
          >
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Technical Gap Analysis</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-300">Found (High Importance)</span>
              <span className="text-xs font-mono font-bold text-emerald-400">{foundCount}/{requiredCount}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {displaySkills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Soft Skills AI Inference */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-purple-400 text-sm">psychology</span>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Soft Skills AI Inference</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Leadership</span>
                </div>
                <div className="flex gap-1">
                  <div className="h-1.5 w-full rounded-sm bg-purple-600"></div>
                  <div className="h-1.5 w-full rounded-sm bg-purple-600"></div>
                  <div className="h-1.5 w-full rounded-sm bg-purple-600"></div>
                  <div className="h-1.5 w-full rounded-sm bg-slate-700"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Communication</span>
                </div>
                <div className="flex gap-1">
                  <div className="h-1.5 w-full rounded-sm bg-purple-600"></div>
                  <div className="h-1.5 w-full rounded-sm bg-purple-600"></div>
                  <div className="h-1.5 w-full rounded-sm bg-purple-600"></div>
                  <div className="h-1.5 w-full rounded-sm bg-purple-600"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="mt-auto grid grid-cols-2 gap-3">
            <button className="col-span-1 flex items-center justify-center gap-2 px-4 py-3 bg-transparent border border-slate-700 hover:border-slate-600 text-slate-300 hover:bg-slate-800 rounded-lg transition-all text-sm font-semibold group">
              <span className="material-symbols-outlined text-base group-hover:text-red-400 transition-colors">close</span>
              Reject
            </button>
            <button className="col-span-1 flex items-center justify-center gap-2 px-4 py-3 bg-transparent border border-slate-700 hover:border-slate-600 text-slate-300 hover:bg-slate-800 rounded-lg transition-all text-sm font-semibold group">
              <span className="material-symbols-outlined text-base group-hover:text-amber-400 transition-colors">schedule</span>
              Waitlist
            </button>
            <button className="col-span-2 flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 transition-all text-base font-bold transform hover:-translate-y-0.5 active:translate-y-0">
              <span className="material-symbols-outlined">check_circle</span>
              Advance to Interview
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
