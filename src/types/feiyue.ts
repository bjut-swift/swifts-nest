export type ApplicationResult =
  | 'admit'
  | 'reject'
  | 'withdraw'
  | 'pending'
  | 'waitlist'
  | 'unknown';

export type DegreeType = string;

export type Undergraduate = {
  major: string;
  gpa?: number;
  gpa_scale?: number;
  ranking?: string;
};

export type Scores = {
  toefl?: number | null;
  ielts?: number | null;
  gre?: number | null;
  gmat?: number | null;
  duolingo?: number | null;
};

export type ApplicationRecord = {
  school: string;
  program: string;
  degree: DegreeType;
  term: string;
  result: ApplicationResult;
  final: boolean;
  scholarship?: string | null;
  note?: string | null;
};

export type Applicant = {
  id: string;
  name: string;
  undergraduate: Undergraduate;
  scores: Scores;
  directions: string[];
  contact?: string;
  homepage?: string;
  offers?: string[];
  applications: ApplicationRecord[];
  tags: string[];
  disclosure?: 'full' | 'partial';
  application_via?: 'diy' | 'agency' | 'mixed';
};

export type ApplicantSummary = {
  id: string;
  name: string;
  major: string;
  directions: string[];
  destination: string | null;
  destination_slug: string | null;
  term: string;
};

export type Datapoint = {
  school: string;
  program: string;
  degree: DegreeType;
  term: string;
  result: ApplicationResult;
  final: boolean;
  scholarship?: string | null;
  note?: string | null;
  applicant_id: string;
  applicant_name: string;
  applicant_major: string;
  applicant_gpa?: number | null;
  applicant_gpa_scale?: number | null;
  program_slug: string;
};

export type ProgramSummary = {
  slug: string;
  school: string;
  program: string;
  degree: DegreeType;
  datapoints: Datapoint[];
  admit_count: number;
  reject_count: number;
  total_count: number;
};

export type MajorSummary = {
  name: string;
  applicant_count: number;
  applicants_by_term: Record<string, ApplicantSummary[]>;
};

export type FeiyueStats = {
  total_applicants: number;
  total_applications: number;
  total_programs: number;
  total_schools: number;
  admit_rate: number;
  by_term: Record<
    string,
    { applicants: number; applications: number; admit_rate: number }
  >;
  top_programs: ProgramSummary[];
  gpa_distribution: { range: string; count: number }[];
};
