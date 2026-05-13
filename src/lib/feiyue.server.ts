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
    name: applicant.name,
    major: applicant.undergraduate.major,
    directions: applicant.directions,
    destination: dest
      ? `${dest.program} @ ${getSchoolShortName(dest.school)}`
      : null,
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
  aliases: string;
  href: string;
};

const SCHOOL_ALIASES: Record<string, string> = {
  // North America - Ivy League
  'Harvard University': 'Harvard 哈佛',
  'Yale University': 'Yale 耶鲁',
  'Princeton University': 'Princeton 普林',
  'Columbia University': 'Columbia 哥大',
  'University of Pennsylvania': 'UPenn 宾大',
  'Cornell University': 'Cornell 康奈尔',
  'Brown University': 'Brown 布朗',
  'Dartmouth College': 'Dartmouth 达特茅斯',
  // North America - Top CS/EE
  'Massachusetts Institute of Technology': 'MIT 麻省理工',
  'Stanford University': 'Stanford 斯坦福',
  'Carnegie Mellon University': 'CMU 卡梅',
  'California Institute of Technology': 'Caltech 加州理工',
  'Georgia Institute of Technology': 'GaTech 佐治亚理工',
  'University of Illinois Urbana-Champaign': 'UIUC 伊利诺伊香槟',
  'University of Michigan, Ann Arbor': 'UMich 密歇根安娜堡',
  'University of Michigan': 'UMich 密歇根',
  'University of Texas at Austin': 'UT Austin 德州奥斯汀',
  'University of Washington': 'UW 华大西雅图',
  'University of Wisconsin-Madison': 'UW-Madison 威斯康星麦迪逊',
  // North America - UC System
  'University of California, Berkeley': 'UCB 伯克利',
  'University of California Berkeley': 'UCB 伯克利',
  'University of California, Los Angeles': 'UCLA 加州洛杉矶',
  'University of California, San Diego': 'UCSD 加州圣地亚哥',
  'University of California San Diego': 'UCSD 加州圣地亚哥',
  'University of California, Davis': 'UCD 加州戴维斯',
  'University of California, Irvine': 'UCI 加州尔湾',
  'University of California, Santa Barbara': 'UCSB 加州圣芭',
  'University of California, Santa Cruz': 'UCSC 加州圣克鲁兹',
  'University of California, Riverside': 'UCR 加州河滨',
  // North America - Other Top
  'University of Southern California': 'USC 南加大',
  'New York University': 'NYU 纽大',
  'Duke University': 'Duke 杜克',
  'Northwestern University': 'Northwestern 西北大学',
  'Johns Hopkins University': 'JHU 约翰霍普金斯',
  'Rice University': 'Rice 莱斯',
  'University of Chicago': 'UChicago 芝加哥',
  'Washington University in St. Louis': 'WashU 圣路易斯华盛顿',
  'University of Maryland, College Park': 'UMD 马里兰',
  'Purdue University': 'Purdue 普渡',
  'University of Minnesota, Twin Cities': 'UMN 明尼苏达',
  'Ohio State University': 'OSU 俄亥俄州立',
  'Pennsylvania State University': 'PSU 宾州州立',
  'University of Florida': 'UF 佛罗里达',
  'University of North Carolina at Chapel Hill': 'UNC 北卡教堂山',
  'Virginia Tech': 'VT 弗吉尼亚理工',
  'University of Virginia': 'UVA 弗吉尼亚',
  'Boston University': 'BU 波士顿大学',
  'Northeastern University': 'NEU 东北大学',
  'University of Massachusetts Amherst': 'UMass 麻省大学',
  'Stony Brook University': 'SBU 石溪',
  'Rutgers University': 'Rutgers 罗格斯',
  'University of Pittsburgh': 'UPitt 匹兹堡',
  'University of Colorado Boulder': 'CU Boulder 科罗拉多博尔德',
  'Arizona State University': 'ASU 亚利桑那州立',
  'Texas A&M University': 'TAMU 德州农工',
  'Emory University': 'Emory 埃默里',
  'Vanderbilt University': 'Vanderbilt 范德堡',
  // Canada
  'University of Toronto': 'UofT 多大',
  'University of British Columbia': 'UBC 英属哥伦比亚',
  'McGill University': 'McGill 麦吉尔',
  'University of Waterloo': 'UWaterloo 滑铁卢',
  'University of Alberta': 'UAlberta 阿尔伯塔',
  'Simon Fraser University': 'SFU 西蒙弗雷泽',
  'McMaster University': 'McMaster 麦克马斯特',
  // UK
  'University of Oxford': 'Oxford 牛津',
  'University of Cambridge': 'Cambridge 剑桥',
  'Imperial College London': 'IC 帝国理工',
  'University College London': 'UCL 伦敦大学学院',
  'University of Edinburgh': 'Edinburgh 爱丁堡',
  'University of Manchester': 'Manchester 曼大',
  "King's College London": 'KCL 伦敦国王学院',
  'University of Warwick': 'Warwick 华威',
  'University of Bristol': 'Bristol 布里斯托',
  'University of Glasgow': 'Glasgow 格拉斯哥',
  'University of Leeds': 'Leeds 利兹',
  'University of Southampton': 'Southampton 南安普顿',
  'University of Bath': 'Bath 巴斯',
  'London School of Economics and Political Science': 'LSE 伦敦政经',
  'University of Birmingham': 'Birmingham 伯明翰',
  'University of Sheffield': 'Sheffield 谢菲尔德',
  'University of Nottingham': 'Nottingham 诺丁汉',
  'Durham University': 'Durham 杜伦',
  // Europe
  'ETH Zurich': 'ETH ETHz 苏黎世联邦理工',
  EPFL: 'EPFL 洛桑联邦理工',
  'Technical University of Munich': 'TUM 慕尼黑工大',
  'Delft University of Technology': 'TU Delft 代尔夫特理工',
  'KTH Royal Institute of Technology': 'KTH 皇家理工',
  'Aalto University': 'Aalto 阿尔托',
  'Technical University of Berlin': 'TU Berlin 柏林工大',
  'University of Amsterdam': 'UvA 阿姆斯特丹大学',
  'Politecnico di Milano': 'PoliMi 米兰理工',
  'Ludwig Maximilian University of Munich': 'LMU 慕尼黑大学',
  'RWTH Aachen University': 'RWTH 亚琛工大',
  'Karlsruhe Institute of Technology': 'KIT 卡尔斯鲁厄理工',
  'Eindhoven University of Technology': 'TU/e 埃因霍温理工',
  // Hong Kong
  'The University of Hong Kong': 'HKU 港大',
  'The Chinese University of Hong Kong': 'CUHK 港中文 中大',
  'The Hong Kong University of Science and Technology': 'HKUST 港科大',
  'Hong Kong University of Science and Technology': 'HKUST 港科大 港科',
  'City University of Hong Kong': 'CityU 城大',
  'The Hong Kong Polytechnic University': 'PolyU 理大',
  'Hong Kong Polytechnic University': 'PolyU 理大',
  'Hong Kong Baptist University': 'HKBU 浸会',
  // Singapore
  'National University of Singapore': 'NUS 新国立',
  'Nanyang Technological University': 'NTU 南洋理工',
  'Singapore Management University': 'SMU 新加坡管理大学',
  // Japan
  'The University of Tokyo': 'UTokyo 东大',
  'Kyoto University': 'Kyoto 京大',
  'Tokyo Institute of Technology': 'Tokyo Tech 东工大',
  'Osaka University': 'Osaka 阪大',
  'Tohoku University': 'Tohoku 东北大',
  // South Korea
  'Seoul National University': 'SNU 首尔国立',
  'Korea Advanced Institute of Science and Technology': 'KAIST 韩科院',
  KAIST: 'KAIST 韩科院',
  'Pohang University of Science and Technology': 'POSTECH 浦项科技',
  'Yonsei University': 'Yonsei 延世',
  'Korea University': 'KU 高丽大学',
  // Australia
  'The University of Melbourne': 'Melbourne 墨尔本大学',
  'University of Melbourne': 'Melbourne 墨尔本大学',
  'The University of Sydney': 'Sydney 悉尼大学',
  'University of Sydney': 'Sydney 悉尼大学',
  'University of New South Wales': 'UNSW 新南威尔士',
  'Australian National University': 'ANU 澳国立',
  'The University of Queensland': 'UQ 昆士兰大学',
  'Monash University': 'Monash 莫纳什',
  'The University of Adelaide': 'Adelaide 阿德莱德',
  'The University of Western Australia': 'UWA 西澳大学',
  // Macau
  'University of Macau': 'UM 澳门大学',
  'Macau University of Science and Technology': 'MUST 澳科大',
};

function getSchoolAliases(school: string): string {
  return SCHOOL_ALIASES[school] || '';
}

export function getSchoolShortName(school: string): string {
  const aliases = SCHOOL_ALIASES[school];
  if (!aliases) return school;
  const abbr = aliases.split(' ')[0];
  return abbr || school;
}

export async function getSearchIndex(): Promise<SearchEntry[]> {
  const applicants = await getAllApplicants();
  const programs = await getAllPrograms();
  const entries: SearchEntry[] = [];

  for (const a of applicants) {
    const dest = a.applications.find((app) => app.final);
    const schools = a.applications.map((app) => app.school);
    const schoolAliases = schools.map(getSchoolAliases).filter(Boolean);
    entries.push({
      type: 'applicant',
      title: a.name,
      subtitle: [
        a.undergraduate.major,
        ...a.directions,
        dest ? `→ ${dest.program} @ ${getSchoolShortName(dest.school)}` : '',
      ]
        .filter(Boolean)
        .join(' · '),
      aliases: schoolAliases.join(' '),
      href: `/feiyue/applicant/${a.id}`,
    });
  }

  for (const p of programs) {
    entries.push({
      type: 'program',
      title: `${p.program} (${p.degree})`,
      subtitle: `${p.school} · ${p.total_count} 条申请`,
      aliases: getSchoolAliases(p.school),
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
      aliases: getSchoolAliases(school),
      href: `/feiyue/program#school-${encodeURIComponent(school)}`,
    });
  });

  return entries;
}
