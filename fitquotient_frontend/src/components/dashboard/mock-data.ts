export type Candidate = {
  id: string;
  name: string;
  fitScore: number;
  matchedSkills: { skill: string; score: number }[];
  summary: string;
  appliedDate: string;
  location?: string;
  experienceMonths?: number;
};

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
