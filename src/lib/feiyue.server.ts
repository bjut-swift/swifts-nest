import { existsSync, readdirSync, readFileSync } from 'fs';
import matter from 'gray-matter';
import { join } from 'path';

import { generateProgramSlug } from '@/lib/feiyue.client';
import { applicantSchema } from '@/lib/feiyue.schema';

import {
  Applicant,
  ApplicantSummary,
  Datapoint,
  FeiyueStats,
  MajorSummary,
  ProgramSummary,
} from '@/types/feiyue';

const FEIYUE_DIR = join(process.cwd(), 'src', 'contents', 'feiyue');

function parseApplicantFile(filePath: string): {
  applicant: Applicant;
  content: string;
} {
  const raw = readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const applicant = applicantSchema.parse(data) as Applicant;
  return { applicant, content: content.trim() };
}

export async function getAllApplicants(): Promise<Applicant[]> {
  if (!existsSync(FEIYUE_DIR)) return [];

  const files = readdirSync(FEIYUE_DIR).filter(
    (f) => f.endsWith('.md') && !f.startsWith('_')
  );

  return files.map((file) => {
    const { applicant } = parseApplicantFile(join(FEIYUE_DIR, file));
    return applicant;
  });
}

export async function getApplicantById(id: string): Promise<Applicant | null> {
  const filePath = join(FEIYUE_DIR, `${id}.md`);
  if (!existsSync(filePath)) return null;

  const { applicant } = parseApplicantFile(filePath);
  return applicant;
}

function buildApplicantSummary(applicant: Applicant): ApplicantSummary {
  const dest = applicant.applications.find((a) => a.final);
  return {
    id: applicant.id,
    name: applicant.anonymous ? '匿名' : applicant.name,
    major: applicant.undergraduate.major,
    directions: applicant.directions,
    destination: dest ? `${dest.program} @ ${dest.school}` : null,
    destination_slug: dest
      ? generateProgramSlug(dest.school, dest.program, dest.degree)
      : null,
    term: applicant.applications[0]?.term || '',
  };
}

export async function getApplicantSummaries(): Promise<ApplicantSummary[]> {
  const applicants = await getAllApplicants();
  return applicants.map(buildApplicantSummary);
}

export async function getApplicantsByTerm(): Promise<
  Record<string, ApplicantSummary[]>
> {
  const summaries = await getApplicantSummaries();
  const byTerm: Record<string, ApplicantSummary[]> = {};

  for (const s of summaries) {
    if (!byTerm[s.term]) byTerm[s.term] = [];
    byTerm[s.term].push(s);
  }

  return byTerm;
}

export async function getAllDatapoints(): Promise<Datapoint[]> {
  const applicants = await getAllApplicants();

  return applicants.flatMap((applicant) =>
    applicant.applications.map((app) => ({
      ...app,
      applicant_id: applicant.id,
      applicant_name: applicant.anonymous ? '匿名' : applicant.name,
      applicant_major: applicant.undergraduate.major,
      applicant_gpa: applicant.undergraduate.gpa,
      applicant_gpa_scale: applicant.undergraduate.gpa_scale,
      program_slug: generateProgramSlug(app.school, app.program, app.degree),
    }))
  );
}

export async function getAllPrograms(): Promise<ProgramSummary[]> {
  const datapoints = await getAllDatapoints();
  const programMap = new Map<string, Datapoint[]>();

  for (const dp of datapoints) {
    const existing = programMap.get(dp.program_slug) || [];
    existing.push(dp);
    programMap.set(dp.program_slug, existing);
  }

  const entries: Array<[string, Datapoint[]]> = Array.from(
    programMap.entries()
  );
  return entries.map(([slug, dps]) => ({
    slug,
    school: dps[0].school,
    program: dps[0].program,
    degree: dps[0].degree,
    datapoints: dps,
    admit_count: dps.filter((d) => d.result === 'admit').length,
    reject_count: dps.filter((d) => d.result === 'reject').length,
    total_count: dps.length,
  }));
}

export async function getProgramsBySchool(): Promise<
  Record<string, ProgramSummary[]>
> {
  const programs = await getAllPrograms();
  const bySchool: Record<string, ProgramSummary[]> = {};

  for (const p of programs) {
    if (!bySchool[p.school]) bySchool[p.school] = [];
    bySchool[p.school].push(p);
  }

  return bySchool;
}

export async function getAllMajors(): Promise<MajorSummary[]> {
  const applicants = await getAllApplicants();
  const majorMap = new Map<string, Applicant[]>();

  for (const a of applicants) {
    const major = a.undergraduate.major;
    const existing = majorMap.get(major) || [];
    existing.push(a);
    majorMap.set(major, existing);
  }

  return Array.from(majorMap.entries()).map(([name, apps]) => {
    const byTerm: Record<string, ApplicantSummary[]> = {};
    for (const a of apps) {
      const summary = buildApplicantSummary(a);
      if (!byTerm[summary.term]) byTerm[summary.term] = [];
      byTerm[summary.term].push(summary);
    }
    return {
      name,
      applicant_count: apps.length,
      applicants_by_term: byTerm,
    };
  });
}

export async function getAllDirections(): Promise<
  Record<string, ApplicantSummary[]>
> {
  const applicants = await getAllApplicants();
  const dirMap: Record<string, ApplicantSummary[]> = {};

  for (const a of applicants) {
    const summary = buildApplicantSummary(a);
    for (const dir of a.directions) {
      if (!dirMap[dir]) dirMap[dir] = [];
      dirMap[dir].push(summary);
    }
  }

  return dirMap;
}

export async function getApplicantStoryContent(
  id: string
): Promise<string | null> {
  const filePath = join(FEIYUE_DIR, `${id}.md`);
  if (!existsSync(filePath)) return null;

  const { content } = parseApplicantFile(filePath);
  return content || null;
}

export async function getStats(): Promise<FeiyueStats> {
  const applicants = await getAllApplicants();
  const datapoints = await getAllDatapoints();
  const programs = await getAllPrograms();

  const schools = new Set(datapoints.map((d) => d.school));
  const admitCount = datapoints.filter((d) => d.result === 'admit').length;

  const termMap = new Map<
    string,
    { applicantIds: Set<string>; total: number; admits: number }
  >();
  for (const dp of datapoints) {
    const entry = termMap.get(dp.term) || {
      applicantIds: new Set<string>(),
      total: 0,
      admits: 0,
    };
    entry.applicantIds.add(dp.applicant_id);
    entry.total++;
    if (dp.result === 'admit') entry.admits++;
    termMap.set(dp.term, entry);
  }

  const by_term: FeiyueStats['by_term'] = {};
  Array.from(termMap.entries()).forEach(([term, entry]) => {
    by_term[term] = {
      applicants: entry.applicantIds.size,
      applications: entry.total,
      admit_rate: entry.total > 0 ? entry.admits / entry.total : 0,
    };
  });

  const gpas = applicants
    .filter((a) => a.undergraduate.gpa != null)
    .map((a) => {
      const gpa = a.undergraduate.gpa as number;
      const scale = a.undergraduate.gpa_scale || 4.0;
      return scale === 4.0 ? gpa : (gpa / scale) * 4.0;
    });

  const ranges = ['< 3.0', '3.0-3.3', '3.3-3.5', '3.5-3.7', '3.7-4.0'];
  const gpa_distribution = ranges.map((range) => ({
    range,
    count: gpas.filter((g) => {
      if (range === '< 3.0') return g < 3.0;
      if (range === '3.0-3.3') return g >= 3.0 && g < 3.3;
      if (range === '3.3-3.5') return g >= 3.3 && g < 3.5;
      if (range === '3.5-3.7') return g >= 3.5 && g < 3.7;
      return g >= 3.7;
    }).length,
  }));

  const top_programs = [...programs]
    .sort((a, b) => b.total_count - a.total_count)
    .slice(0, 10);

  return {
    total_applicants: applicants.length,
    total_applications: datapoints.length,
    total_programs: programs.length,
    total_schools: schools.size,
    admit_rate: datapoints.length > 0 ? admitCount / datapoints.length : 0,
    by_term,
    top_programs,
    gpa_distribution,
  };
}

export type SearchEntry = {
  type: 'applicant' | 'program' | 'school';
  title: string;
  subtitle: string;
  href: string;
};

export async function getSearchIndex(): Promise<SearchEntry[]> {
  const applicants = await getAllApplicants();
  const programs = await getAllPrograms();
  const entries: SearchEntry[] = [];

  for (const a of applicants) {
    const dest = a.applications.find((app) => app.final);
    entries.push({
      type: 'applicant',
      title: a.anonymous ? '匿名' : a.name,
      subtitle: [
        a.undergraduate.major,
        ...a.directions,
        dest ? `→ ${dest.program} @ ${dest.school}` : '',
      ]
        .filter(Boolean)
        .join(' · '),
      href: `/feiyue/applicant/${a.id}`,
    });
  }

  for (const p of programs) {
    entries.push({
      type: 'program',
      title: `${p.program} (${p.degree})`,
      subtitle: `${p.school} · ${p.total_count} 条申请`,
      href: `/feiyue/program/${p.slug}`,
    });
  }

  const schoolMap = new Map<string, number>();
  for (const p of programs) {
    schoolMap.set(p.school, (schoolMap.get(p.school) || 0) + p.total_count);
  }
  Array.from(schoolMap.entries()).forEach(([school, count]) => {
    entries.push({
      type: 'school',
      title: school,
      subtitle: `${count} 条申请`,
      href: `/feiyue/program#school-${school}`,
    });
  });

  return entries;
}
