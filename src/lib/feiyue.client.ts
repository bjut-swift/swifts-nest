import {
  ApplicationResult,
  Datapoint,
  FeiyueStats,
  ProgramSummary,
} from '@/types/feiyue';

export function generateProgramSlug(
  school: string,
  program: string,
  degree: string
): string {
  return [school, program, degree]
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

type ResultDisplay = {
  emoji: string;
  label: string;
  colorClass: string;
  bgClass: string;
};

const RESULT_MAP: Record<ApplicationResult, ResultDisplay> = {
  admit: {
    emoji: '🟢',
    label: 'Admit',
    colorClass: 'text-green-600 dark:text-green-400',
    bgClass: 'bg-green-100 dark:bg-green-900/30',
  },
  reject: {
    emoji: '🔴',
    label: 'Reject',
    colorClass: 'text-red-600 dark:text-red-400',
    bgClass: 'bg-red-100 dark:bg-red-900/30',
  },
  pending: {
    emoji: '🟡',
    label: 'Pending',
    colorClass: 'text-yellow-600 dark:text-yellow-400',
    bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
  withdraw: {
    emoji: '🟠',
    label: 'Withdraw',
    colorClass: 'text-orange-600 dark:text-orange-400',
    bgClass: 'bg-orange-100 dark:bg-orange-900/30',
  },
  waitlist: {
    emoji: '🔵',
    label: 'Waitlist',
    colorClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
  },
  unknown: {
    emoji: '⚪',
    label: 'Unknown',
    colorClass: 'text-gray-600 dark:text-gray-400',
    bgClass: 'bg-gray-100 dark:bg-gray-800',
  },
};

export function getResultDisplay(result: ApplicationResult): ResultDisplay {
  return RESULT_MAP[result];
}

export function computeStatsFromDatapoints(
  datapoints: Datapoint[]
): FeiyueStats {
  const applicantIds = new Set(datapoints.map((d) => d.applicant_id));
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

  const gpas = datapoints
    .filter((d) => d.applicant_gpa != null)
    .reduce<{ id: string; gpa: number }[]>((acc, d) => {
      if (!acc.some((e) => e.id === d.applicant_id)) {
        const scale = d.applicant_gpa_scale || 4.0;
        const gpa = d.applicant_gpa as number;
        acc.push({
          id: d.applicant_id,
          gpa: scale === 4.0 ? gpa : (gpa / scale) * 4.0,
        });
      }
      return acc;
    }, [])
    .map((e) => e.gpa);

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

  const programMap = new Map<string, Datapoint[]>();
  for (const dp of datapoints) {
    const existing = programMap.get(dp.program_slug) || [];
    existing.push(dp);
    programMap.set(dp.program_slug, existing);
  }

  const programs: ProgramSummary[] = Array.from(programMap.entries()).map(
    ([slug, dps]) => ({
      slug,
      school: dps[0].school,
      program: dps[0].program,
      degree: dps[0].degree,
      datapoints: dps,
      admit_count: dps.filter((d) => d.result === 'admit').length,
      reject_count: dps.filter((d) => d.result === 'reject').length,
      total_count: dps.length,
    })
  );

  const top_programs = [...programs]
    .sort((a, b) => b.total_count - a.total_count)
    .slice(0, 10);

  return {
    total_applicants: applicantIds.size,
    total_applications: datapoints.length,
    total_programs: programs.length,
    total_schools: schools.size,
    admit_rate: datapoints.length > 0 ? admitCount / datapoints.length : 0,
    by_term,
    top_programs,
    gpa_distribution,
  };
}
