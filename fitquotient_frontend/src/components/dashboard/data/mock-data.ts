export interface Candidate {
  id: string;
  name: string;
  fitScore: number;
  matchedSkills: { skill: string; score: number }[];
  summary: string;
  appliedDate: string;
  location?: string;
  experienceMonths?: number;
}

export const candidates: Candidate[] = [
  {
    id: "c1",
    name: "Alya Putri",
    fitScore: 87,
    matchedSkills: [
      { skill: "React", score: 0.9 },
      { skill: "TypeScript", score: 0.85 },
      { skill: "Testing", score: 0.75 },
    ],
    summary:
      "Senior frontend engineer with strong experience in modern React stacks.",
    appliedDate: "2025-10-01",
    location: "Jakarta, ID",
    experienceMonths: 60,
  },
  {
    id: "c2",
    name: "Budi Santoso",
    fitScore: 73,
    matchedSkills: [
      { skill: "Node.js", score: 0.8 },
      { skill: "Databases", score: 0.75 },
      { skill: "CI/CD", score: 0.6 },
    ],
    summary: "Back-end engineer with experience in building infra and APIs.",
    appliedDate: "2025-10-02",
    location: "Bandung, ID",
    experienceMonths: 36,
  },
];

export interface Job {
  id: string;
  title: string;
  details?: {
    company?: string;
    requirements?: string;
    benefits?: string[];
    salary?: string | null;
  };
}

export const jobs: Job[] = [
  {
    id: "job-1",
    title: "Senior Frontend Engineer",
    details: {
      company: "FitQuotient Inc",
      requirements: "React, TypeScript, TailwindCSS",
      benefits: ["PTO", "Device allowance"],
      salary: "IDR 20-30M",
    },
  },
  {
    id: "job-2",
    title: "Backend Engineer",
    details: {
      company: "FitQuotient Inc",
      requirements: "Node.js, Postgres, Docker",
      benefits: ["Health insurance"],
      salary: "IDR 20-30M",
    },
  },
];

export interface CV {
  id: string;
  name?: string;
  filename?: string;
  fileType?: string;
  fileData?: string | null;
  text?: string;
}

export const cvs: CV[] = [
  {
    id: "cv-1",
    name: "Alya CV",
    filename: "alya_cv.pdf",
    fileType: "application/pdf",
    fileData: null,
    text: "Experienced frontend engineer with React and TypeScript",
  },
  {
    id: "cv-2",
    name: "Budi CV",
    filename: "budi_cv.pdf",
    fileType: "application/pdf",
    fileData: null,
    text: "Experienced backend engineer with Node.js",
  },
];

// Mock data for CVCompareModal
export interface ApiKey {
  id: string;
  label: string;
}

export const apiKeys: ApiKey[] = [
  { id: "key1", label: "OpenAI (prod)" },
  { id: "key2", label: "OpenAI (staging)" },
];

export const embeddingModels: string[] = [
  "text-embedding-3-small",
  "text-embedding-3-large",
];
