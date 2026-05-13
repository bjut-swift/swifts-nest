import clsx from 'clsx';
import { InferGetStaticPropsType } from 'next';
import * as React from 'react';
import Markdown from 'react-markdown';

import { getResultDisplay } from '@/lib/feiyue.client';
import {
  getAllApplicants,
  getAllMajors,
  SCHOOL_ALIASES,
} from '@/lib/feiyue.server';
import useLoaded from '@/hooks/useLoaded';

import Accent from '@/components/Accent';
import FeiyueNav from '@/components/feiyue/FeiyueNav';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { ApplicationResult, DegreeType } from '@/types/feiyue';

const DEGREE_OPTIONS: DegreeType[] = [
  'MSc',
  'MA',
  'MEng',
  'MBA',
  'MPhil',
  'MRes',
  'PhD',
  'Other',
];
const RESULT_OPTIONS: ApplicationResult[] = [
  'admit',
  'reject',
  'withdraw',
  'pending',
  'waitlist',
  'unknown',
];

const SCHOLARSHIP_OPTIONS = [
  '全额奖学金',
  '半额奖学金',
  'TA',
  'RA',
  'Tuition Waiver',
  '部分奖学金',
];

function buildTermOptions(): string[] {
  const currentYear = new Date().getFullYear();
  const terms: string[] = [];
  for (let y = currentYear + 1; y >= currentYear - 4; y--) {
    terms.push(`${y} Fall`, `${y} Spring`);
  }
  return terms;
}
const TERM_OPTIONS = buildTermOptions();

const SUMMARY_DEFAULT = `## 背景

（请介绍你的 GPA、排名、语言成绩、科研/实习经历等基本情况）

## 申请过程

（请分享你的申请时间线、选校策略、面试经历等）

## 给学弟学妹的建议

1. （建议一）
2. （建议二）
`;

type AppEntry = {
  school: string;
  program: string;
  degree: DegreeType;
  degreeCustom: string;
  term: string;
  termCustom: string;
  result: ApplicationResult;
  final: boolean;
  scholarshipOption: string;
  scholarship: string;
  note: string;
};

type FormData = {
  name: string;
  major: string;
  gpa: string;
  gpa_scale: string;
  ranking: string;
  toefl: string;
  ielts: string;
  gre: string;
  gmat: string;
  directions: string;
  contact: string;
  homepage: string;
  offers: string;
  tags: string;
  applications: AppEntry[];
  summary: string;
};

const emptyApp: AppEntry = {
  school: '',
  program: '',
  degree: 'MSc',
  degreeCustom: '',
  term: TERM_OPTIONS[0],
  termCustom: '',
  result: 'pending',
  final: false,
  scholarshipOption: '',
  scholarship: '',
  note: '',
};

const defaultForm: FormData = {
  name: '',
  major: '',
  gpa: '',
  gpa_scale: '4.0',
  ranking: '',
  toefl: '',
  ielts: '',
  gre: '',
  gmat: '',
  directions: '',
  contact: '',
  homepage: '',
  offers: '',
  tags: '',
  applications: [{ ...emptyApp }],
  summary: SUMMARY_DEFAULT,
};

function deriveId(serialNumber: number): string {
  return `Applicant-${String(serialNumber).padStart(5, '0')}`;
}

function getValidationErrors(form: FormData): string[] {
  const errors: string[] = [];
  if (!form.name.trim()) errors.push('姓名未填写');
  if (!form.major.trim()) errors.push('专业未填写');
  if (form.applications.length === 0) errors.push('至少需要一条申请记录');
  for (let i = 0; i < form.applications.length; i++) {
    const app = form.applications[i];
    if (!app.school.trim()) errors.push(`申请 #${i + 1}：学校未填写`);
    if (!app.program.trim()) errors.push(`申请 #${i + 1}：项目未填写`);
    const actualTerm =
      app.term === 'Other' ? app.termCustom.trim() : app.term.trim();
    if (!actualTerm) errors.push(`申请 #${i + 1}：学期未填写`);
  }
  const finals = form.applications.filter((a) => a.final);
  if (finals.length > 1) errors.push('最终去向只能有一条');
  if (form.gpa && toNum(form.gpa) === null) errors.push('GPA 格式不正确');
  if (form.toefl && toNum(form.toefl) === null) errors.push('TOEFL 格式不正确');
  if (form.ielts && toNum(form.ielts) === null) errors.push('IELTS 格式不正确');
  if (form.gre && toNum(form.gre) === null) errors.push('GRE 格式不正确');
  if (form.gmat && toNum(form.gmat) === null) errors.push('GMAT 格式不正确');
  if (!form.summary.trim() || form.summary.trim() === SUMMARY_DEFAULT.trim())
    errors.push('申请总结未填写（请替换模板中的括号内容）');
  return errors;
}

function splitComma(s: string): string[] {
  return s
    .replace(/，/g, ',')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

function yamlStr(s: string): string {
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function yamlListStr(items: string[]): string {
  return `[${items.map((i) => yamlStr(i)).join(', ')}]`;
}

function toNum(s: string): number | null {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

function generateMarkdown(form: FormData, id: string): string {
  const lines: string[] = ['---'];
  lines.push(`id: ${yamlStr(id)}`);
  lines.push(`name: ${yamlStr(form.name)}`);
  lines.push('undergraduate:');
  lines.push(`  major: ${yamlStr(form.major)}`);
  const gpa = toNum(form.gpa);
  if (gpa !== null) lines.push(`  gpa: ${gpa}`);
  if (form.ranking) lines.push(`  ranking: ${yamlStr(form.ranking)}`);
  const scoreFields = [
    ['toefl', form.toefl],
    ['ielts', form.ielts],
    ['gre', form.gre],
    ['gmat', form.gmat],
  ] as const;
  const validScores = scoreFields.filter(([, v]) => toNum(v) !== null);
  if (validScores.length > 0) {
    lines.push('scores:');
    for (const [key, val] of validScores) {
      lines.push(`  ${key}: ${toNum(val)}`);
    }
  }
  if (form.directions.trim())
    lines.push(`directions: ${yamlListStr(splitComma(form.directions))}`);
  if (form.contact.trim()) lines.push(`contact: ${yamlStr(form.contact)}`);
  if (form.homepage.trim()) lines.push(`homepage: ${yamlStr(form.homepage)}`);
  if (form.offers.trim())
    lines.push(`offers: ${yamlListStr(splitComma(form.offers))}`);
  if (form.tags.trim())
    lines.push(`tags: ${yamlListStr(splitComma(form.tags))}`);
  lines.push('applications:');
  for (const app of form.applications) {
    lines.push(`  - school: ${yamlStr(app.school)}`);
    lines.push(`    program: ${yamlStr(app.program)}`);
    const deg =
      app.degree === 'Other' && app.degreeCustom.trim()
        ? app.degreeCustom.trim()
        : app.degree;
    lines.push(`    degree: ${yamlStr(deg)}`);
    const actualTerm =
      app.term === 'Other' && app.termCustom.trim()
        ? app.termCustom.trim()
        : app.term;
    lines.push(`    term: ${yamlStr(actualTerm)}`);
    lines.push(`    result: ${app.result}`);
    lines.push(`    final: ${app.final}`);
    const actualScholarship =
      app.scholarshipOption === 'Other'
        ? app.scholarship.trim()
        : app.scholarshipOption;
    if (actualScholarship)
      lines.push(`    scholarship: ${yamlStr(actualScholarship)}`);
    if (app.note.trim()) lines.push(`    note: ${yamlStr(app.note)}`);
  }
  lines.push('---');
  if (form.summary.trim()) {
    lines.push('');
    lines.push(form.summary.trim());
  }
  return lines.join('\n') + '\n';
}

function buildGitHubUrl(id: string, markdown: string): string {
  const filename = `${id || 'untitled'}.md`;
  const encoded = encodeURIComponent(markdown);
  return `https://github.com/bjut-swift/swifts-nest/new/main/src/contents/feiyue?filename=${filename}&value=${encoded}`;
}

type SchoolOption = { name: string; aliases: string };

export default function ContributePage({
  existingMajors,
  nextSerial,
  schools,
  existingPrograms,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const isLoaded = useLoaded();
  const STORAGE_KEY = 'feiyue-contribute-draft';

  const [form, setForm] = React.useState<FormData>(() => {
    if (typeof window === 'undefined') return { ...defaultForm };
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultForm,
          ...parsed,
          applications:
            Array.isArray(parsed.applications) && parsed.applications.length > 0
              ? parsed.applications
              : defaultForm.applications,
        };
      }
    } catch {
      /* ignore */
    }
    return { ...defaultForm };
  });

  const [majorSuggestions, setMajorSuggestions] = React.useState<string[]>([]);
  const [showMajorList, setShowMajorList] = React.useState(false);

  const schoolOptions = React.useMemo(
    () =>
      schools.map((s) => ({
        label: s.name,
        searchText: `${s.name} ${s.aliases}`,
      })),
    [schools]
  );

  const programOptions = React.useMemo(
    () =>
      existingPrograms.map((p) => ({
        label: p,
        searchText: p,
      })),
    [existingPrograms]
  );

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      /* ignore */
    }
  }, [form]);

  const errors = getValidationErrors(form);
  const id = deriveId(nextSerial);
  const markdown = generateMarkdown(form, id);

  const clearDraft = () => {
    setForm({ ...defaultForm });
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateField = <K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateMajor = (value: string) => {
    updateField('major', value);
    if (value.trim()) {
      const matches = existingMajors.filter((m) => m.includes(value));
      setMajorSuggestions(matches);
      setShowMajorList(matches.length > 0);
    } else {
      setShowMajorList(false);
    }
  };

  const selectMajor = (m: string) => {
    updateField('major', m);
    setShowMajorList(false);
  };

  const updateApp = (index: number, partial: Partial<AppEntry>) => {
    setForm((prev) => {
      const apps = [...prev.applications];
      apps[index] = { ...apps[index], ...partial };
      return { ...prev, applications: apps };
    });
  };

  const addApp = () =>
    setForm((prev) => ({
      ...prev,
      applications: [...prev.applications, { ...emptyApp }],
    }));
  const removeApp = (i: number) =>
    setForm((prev) => ({
      ...prev,
      applications: prev.applications.filter((_, j) => j !== i),
    }));

  const download = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openGitHub = () => window.open(buildGitHubUrl(id, markdown), '_blank');

  const sendEmail = () => {
    const subject = encodeURIComponent(`飞跃手册投稿：${id}`);
    const body = encodeURIComponent(
      `Hi BJUT SWIFT，\n\n以下是我的飞跃手册投稿，请帮忙代为提交（匿名）。\n\n` +
        `--- 请将以下内容保存为 ${id}.md ---\n\n` +
        markdown
    );
    window.open(
      `mailto:bjutswift.cn@gmail.com?subject=${subject}&body=${body}`
    );
  };

  return (
    <Layout>
      <Seo
        templateTitle='贡献数据 — 飞跃手册'
        description='在线编辑你的申请数据，一键提交 PR。'
      />
      <main>
        <section className={clsx(isLoaded && 'fade-in-start')}>
          <div className='layout py-12'>
            <h1 className='text-3xl md:text-5xl' data-fade='0'>
              <Accent>贡献数据</Accent>
            </h1>
            <p className='mt-2 text-gray-600 dark:text-gray-300' data-fade='1'>
              填写信息 → 撰写申请总结 → 一键提交到 GitHub
            </p>

            <div className='mt-4' data-fade='2'>
              <FeiyueNav />
            </div>

            {/* Collapsible form sections */}
            <div className='mt-8 space-y-3' data-fade='3'>
              <Collapsible title='基本信息' defaultOpen>
                <Field label='姓名 / 昵称 *'>
                  <Input
                    value={form.name}
                    onChange={(v) => updateField('name', v)}
                    placeholder='张三（或昵称）'
                  />
                </Field>
                <p className='text-xs text-gray-400'>
                  文件名：<code>{id}.md</code>
                </p>
                <p className='text-xs text-gray-400'>
                  想匿名？名字填昵称或"匿名"即可。
                </p>
              </Collapsible>

              <Collapsible title='本科信息'>
                <Field label='专业 *'>
                  <div className='relative'>
                    <Input
                      value={form.major}
                      onChange={updateMajor}
                      placeholder='计算机科学与技术'
                    />
                    {showMajorList && (
                      <ul className='absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-dark'>
                        {majorSuggestions.map((m) => (
                          <li key={m}>
                            <button
                              type='button'
                              onClick={() => selectMajor(m)}
                              className='w-full px-3 py-2 text-left text-sm hover:bg-primary-300/10'
                            >
                              {m}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Field>
                <Row>
                  <Field label='GPA' hint='满分 4.0'>
                    <Input
                      value={form.gpa}
                      onChange={(v) => updateField('gpa', v)}
                      placeholder='3.7'
                    />
                  </Field>
                  <Field label='排名'>
                    <Input
                      value={form.ranking}
                      onChange={(v) => updateField('ranking', v)}
                      placeholder='5/120'
                    />
                  </Field>
                </Row>
              </Collapsible>

              <Collapsible title='标化成绩（可选）'>
                <Row>
                  <Field label='TOEFL'>
                    <Input
                      value={form.toefl}
                      onChange={(v) => updateField('toefl', v)}
                      placeholder='105'
                    />
                  </Field>
                  <Field label='IELTS'>
                    <Input
                      value={form.ielts}
                      onChange={(v) => updateField('ielts', v)}
                      placeholder='7.5'
                    />
                  </Field>
                  <Field label='GRE'>
                    <Input
                      value={form.gre}
                      onChange={(v) => updateField('gre', v)}
                      placeholder='325'
                    />
                  </Field>
                  <Field label='GMAT'>
                    <Input
                      value={form.gmat}
                      onChange={(v) => updateField('gmat', v)}
                      placeholder='720'
                    />
                  </Field>
                </Row>
              </Collapsible>

              <Collapsible title='方向与联系方式（可选）'>
                <Field label='申请方向' hint='英文缩写，逗号分隔'>
                  <CommaInput
                    value={form.directions}
                    onChange={(v) => updateField('directions', v)}
                    placeholder='CS, AI'
                  />
                </Field>
                <Row>
                  <Field label='联系方式'>
                    <Input
                      value={form.contact}
                      onChange={(v) => updateField('contact', v)}
                      placeholder='email@example.com'
                    />
                  </Field>
                  <Field label='个人主页'>
                    <Input
                      value={form.homepage}
                      onChange={(v) => updateField('homepage', v)}
                      placeholder='https://...'
                    />
                  </Field>
                </Row>
                <Field label='可提供的帮助' hint='逗号分隔'>
                  <CommaInput
                    value={form.offers}
                    onChange={(v) => updateField('offers', v)}
                    placeholder='选校咨询, 文书修改'
                  />
                </Field>
                <Field label='标签' hint='逗号分隔'>
                  <CommaInput
                    value={form.tags}
                    onChange={(v) => updateField('tags', v)}
                    placeholder='港新, 欧陆'
                  />
                </Field>
              </Collapsible>

              <Collapsible
                title={`申请记录 (${form.applications.length})`}
                defaultOpen
              >
                {form.applications.map((app, i) => (
                  <div
                    key={i}
                    className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'
                  >
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        #{i + 1}
                      </span>
                      {form.applications.length > 1 && (
                        <button
                          onClick={() => removeApp(i)}
                          className='text-xs text-red-500 hover:text-red-700'
                        >
                          删除
                        </button>
                      )}
                    </div>
                    <Row className='mt-3'>
                      <Field label='学校 *'>
                        <AutocompleteInput
                          value={app.school}
                          onChange={(v) => updateApp(i, { school: v })}
                          placeholder='输入校名、缩写或中文'
                          options={schoolOptions}
                        />
                      </Field>
                      <Field label='项目 *'>
                        <AutocompleteInput
                          value={app.program}
                          onChange={(v) => updateApp(i, { program: v })}
                          placeholder='Computer Science'
                          options={programOptions}
                        />
                      </Field>
                    </Row>
                    <Row className='mt-2'>
                      <Field label='学位 *'>
                        <select
                          value={app.degree}
                          onChange={(e) =>
                            updateApp(i, {
                              degree: e.target.value as DegreeType,
                              degreeCustom: '',
                            })
                          }
                          className={selectClass}
                        >
                          {DEGREE_OPTIONS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        {app.degree === 'Other' && (
                          <Input
                            value={app.degreeCustom}
                            onChange={(v) => updateApp(i, { degreeCustom: v })}
                            placeholder='如 JD, LLM'
                          />
                        )}
                      </Field>
                      <Field label='学期 *'>
                        <select
                          value={app.term}
                          onChange={(e) =>
                            updateApp(i, {
                              term: e.target.value,
                              termCustom: '',
                            })
                          }
                          className={selectClass}
                        >
                          {TERM_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                          <option value='Other'>Other</option>
                        </select>
                        {app.term === 'Other' && (
                          <Input
                            value={app.termCustom}
                            onChange={(v) => updateApp(i, { termCustom: v })}
                            placeholder='如 2020 Fall'
                          />
                        )}
                      </Field>
                      <Field label='结果 *'>
                        <select
                          value={app.result}
                          onChange={(e) =>
                            updateApp(i, {
                              result: e.target.value as ApplicationResult,
                            })
                          }
                          className={selectClass}
                        >
                          {RESULT_OPTIONS.map((r) => (
                            <option key={r} value={r}>
                              {getResultDisplay(r).emoji} {r}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </Row>
                    <Row className='mt-2'>
                      <Field label='奖学金'>
                        <select
                          value={app.scholarshipOption}
                          onChange={(e) =>
                            updateApp(i, {
                              scholarshipOption: e.target.value,
                              scholarship: '',
                            })
                          }
                          className={selectClass}
                        >
                          <option value=''>无</option>
                          {SCHOLARSHIP_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                          <option value='Other'>Other</option>
                        </select>
                        {app.scholarshipOption === 'Other' && (
                          <Input
                            value={app.scholarship}
                            onChange={(v) => updateApp(i, { scholarship: v })}
                            placeholder='请填写奖学金名称'
                          />
                        )}
                      </Field>
                      <Field label='备注'>
                        <Input
                          value={app.note}
                          onChange={(v) => updateApp(i, { note: v })}
                          placeholder='一句话备注'
                        />
                      </Field>
                    </Row>
                    <label className='mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                      <input
                        type='checkbox'
                        checked={app.final}
                        onChange={(e) =>
                          updateApp(i, { final: e.target.checked })
                        }
                      />
                      最终去向
                    </label>
                  </div>
                ))}
                <button
                  onClick={addApp}
                  className='mt-2 rounded-md border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-primary-400 hover:text-primary-500 dark:border-gray-600 dark:text-gray-400'
                >
                  + 添加申请记录
                </button>
              </Collapsible>
            </div>

            {/* Summary: full-width left-right split */}
            <div className='mt-8' data-fade='4'>
              <h2 className='text-lg font-bold text-gray-900 dark:text-gray-100'>
                申请总结 *
              </h2>
              <p className='mt-1 text-xs text-gray-400'>
                支持 Markdown：## 标题、**加粗**、- 列表、1.
                有序列表、[链接](url)、{'>'} 引用
              </p>
              <div className='mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <div>
                  <p className='mb-1 text-xs font-medium text-gray-500'>编辑</p>
                  <textarea
                    value={form.summary}
                    onChange={(e) => updateField('summary', e.target.value)}
                    className={clsx(
                      'h-[32rem] w-full resize-y rounded-md dark:bg-dark',
                      'border border-gray-300 dark:border-gray-600',
                      'focus:border-primary-300 focus:outline-none focus:ring-0 dark:focus:border-primary-300',
                      'font-mono text-sm'
                    )}
                  />
                </div>
                <div>
                  <p className='mb-1 text-xs font-medium text-gray-500'>预览</p>
                  <div
                    className={clsx(
                      'h-[32rem] overflow-auto rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900',
                      'prose prose-sm max-w-none dark:prose-invert',
                      'prose-headings:text-gray-900 dark:prose-headings:text-gray-100'
                    )}
                  >
                    {form.summary.trim() ? (
                      <Markdown>{form.summary}</Markdown>
                    ) : (
                      <p className='text-gray-400'>
                        在左侧输入 Markdown 内容，这里实时渲染预览
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Errors + Actions */}
            <div
              className='mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-dark'
              data-fade='5'
            >
              {errors.length > 0 && (
                <div className='mb-4 rounded-md bg-red-50 p-3 dark:bg-red-900/20'>
                  <p className='text-xs font-medium text-red-800 dark:text-red-300'>
                    缺少必要信息：
                  </p>
                  <ul className='mt-1 list-inside list-disc text-xs text-red-700 dark:text-red-400'>
                    {errors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick summary — only show when there's meaningful data */}
              {form.name && form.major && (
                <div className='mb-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400'>
                  <span>
                    {form.name} · {form.major}
                  </span>
                  <span>{form.applications.length} 条申请</span>
                  {form.applications
                    .filter((a) => a.final && a.program && a.school)
                    .map((a) => (
                      <span key='dest'>
                        → {a.program} @ {a.school}
                      </span>
                    ))}
                </div>
              )}

              <div className='flex flex-wrap gap-3'>
                <button
                  onClick={openGitHub}
                  disabled={errors.length > 0}
                  className={clsx(
                    'rounded-md px-6 py-2 text-sm font-medium',
                    errors.length > 0
                      ? 'cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700'
                      : 'bg-primary-400 text-white hover:bg-primary-500'
                  )}
                >
                  提交到 GitHub →
                </button>
                <button
                  onClick={sendEmail}
                  disabled={errors.length > 0}
                  className={clsx(
                    'rounded-md border px-6 py-2 text-sm font-medium',
                    errors.length > 0
                      ? 'cursor-not-allowed border-gray-200 text-gray-400 dark:border-gray-700'
                      : 'border-gray-300 text-gray-700 hover:border-primary-400 hover:text-primary-500 dark:border-gray-600 dark:text-gray-300'
                  )}
                >
                  邮件匿名投稿
                </button>
                <button
                  onClick={download}
                  disabled={errors.length > 0}
                  className={clsx(
                    'rounded-md border px-6 py-2 text-sm font-medium',
                    errors.length > 0
                      ? 'cursor-not-allowed border-gray-200 text-gray-400 dark:border-gray-700'
                      : 'border-gray-300 text-gray-700 hover:border-primary-400 hover:text-primary-500 dark:border-gray-600 dark:text-gray-300'
                  )}
                >
                  下载 .md
                </button>
                <button
                  onClick={clearDraft}
                  className='px-4 py-2 text-xs text-gray-400 hover:text-red-500'
                >
                  清空草稿
                </button>
                <details className='ml-auto'>
                  <summary className='cursor-pointer text-xs text-gray-400'>
                    查看原始 Markdown
                  </summary>
                  <pre className='mt-2 max-h-48 overflow-auto rounded bg-gray-50 p-2 text-xs dark:bg-gray-900'>
                    {markdown}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

const selectClass = clsx(
  'w-full rounded-md dark:bg-dark',
  'border border-gray-300 dark:border-gray-600',
  'focus:border-primary-300 focus:outline-none focus:ring-0 dark:focus:border-primary-300',
  'text-sm'
);

function Collapsible({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen ?? true);
  return (
    <div className='rounded-lg border border-gray-200 dark:border-gray-700'>
      <button
        type='button'
        onClick={() => setOpen((p) => !p)}
        className='flex w-full items-center justify-between px-4 py-3 text-left'
      >
        <span className='text-sm font-bold text-gray-900 dark:text-gray-100'>
          {title}
        </span>
        <span
          className={clsx(
            'text-gray-400 transition-transform',
            open && 'rotate-180'
          )}
        >
          ▾
        </span>
      </button>
      {open && (
        <div className='space-y-3 border-t border-gray-100 px-4 pb-4 pt-3 dark:border-gray-800'>
          {children}
        </div>
      )}
    </div>
  );
}

function Row({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('grid grid-cols-2 gap-3 sm:grid-cols-3', className)}>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className='block'>
      <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
        {label}
      </span>
      {hint && <span className='ml-1 text-xs text-gray-400'>({hint})</span>}
      <div className='mt-1'>{children}</div>
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type='text'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={clsx(
        'w-full rounded-md dark:bg-dark',
        'border border-gray-300 dark:border-gray-600',
        'focus:border-primary-300 focus:outline-none focus:ring-0 dark:focus:border-primary-300',
        'text-sm'
      )}
    />
  );
}

function AutocompleteInput({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  options: { label: string; searchText: string }[];
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = React.useMemo(() => {
    if (!value.trim()) return options.slice(0, 8);
    const q = value.trim().toLowerCase();
    return options
      .filter((o) => o.searchText.toLowerCase().includes(q))
      .slice(0, 8);
  }, [value, options]);

  return (
    <div className='relative' ref={ref}>
      <input
        type='text'
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={clsx(
          'w-full rounded-md dark:bg-dark',
          'border border-gray-300 dark:border-gray-600',
          'focus:border-primary-300 focus:outline-none focus:ring-0 dark:focus:border-primary-300',
          'text-sm'
        )}
      />
      {open && filtered.length > 0 && (
        <ul className='absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-dark'>
          {filtered.map((o) => (
            <li key={o.label}>
              <button
                type='button'
                onClick={() => {
                  onChange(o.label);
                  setOpen(false);
                }}
                className='w-full px-3 py-2 text-left text-sm hover:bg-primary-300/10'
              >
                <span className='font-medium'>{o.label}</span>
                {o.searchText !== o.label && (
                  <span className='ml-2 text-xs text-gray-400'>
                    {o.searchText.replace(o.label, '').trim()}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CommaInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const hasCnComma = /，/.test(value);
  return (
    <div>
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={clsx(
          'w-full rounded-md dark:bg-dark',
          'border dark:border-gray-600',
          'focus:border-primary-300 focus:outline-none focus:ring-0 dark:focus:border-primary-300',
          'text-sm',
          hasCnComma ? 'border-yellow-400' : 'border-gray-300'
        )}
      />
      {hasCnComma && (
        <p className='mt-1 text-xs text-yellow-600 dark:text-yellow-400'>
          检测到中文逗号，请使用英文逗号 , 分隔
        </p>
      )}
    </div>
  );
}

export async function getStaticProps() {
  const majors = await getAllMajors();
  const applicants = await getAllApplicants();

  const schools: SchoolOption[] = Object.entries(SCHOOL_ALIASES).map(
    ([name, aliases]) => ({ name, aliases })
  );

  const programSet = new Set<string>();
  for (const a of applicants) {
    for (const app of a.applications) {
      programSet.add(app.program);
    }
  }

  return {
    props: {
      existingMajors: majors.map((m) => m.name).sort(),
      nextSerial: applicants.length + 1,
      schools,
      existingPrograms: Array.from(programSet).sort(),
    },
  };
}
