import { z } from 'zod';

const applicationResultSchema = z.enum([
  'admit',
  'reject',
  'withdraw',
  'pending',
  'waitlist',
]);

const degreeTypeSchema = z.enum([
  'MSc',
  'MPhil',
  'MRes',
  'PhD',
  'MA',
  'MEng',
  'MBA',
  'Other',
]);

const undergraduateSchema = z.object({
  major: z.string().min(1),
  gpa: z.number().optional(),
  gpa_scale: z.number().default(4.0).optional(),
  ranking: z.string().optional(),
});

const scoresSchema = z
  .object({
    toefl: z.number().nullable().optional(),
    ielts: z.number().nullable().optional(),
    gre: z.number().nullable().optional(),
    gmat: z.number().nullable().optional(),
    duolingo: z.number().nullable().optional(),
  })
  .default({});

const applicationRecordSchema = z.object({
  school: z.string().min(1),
  program: z.string().min(1),
  degree: degreeTypeSchema,
  term: z.string().min(1),
  result: applicationResultSchema,
  final: z.boolean().default(false),
  scholarship: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
});

export const applicantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  anonymous: z.boolean().default(false),
  undergraduate: undergraduateSchema,
  scores: scoresSchema,
  directions: z.array(z.string()).default([]),
  contact: z.string().optional(),
  homepage: z.string().optional(),
  offers: z.array(z.string()).optional(),
  applications: z.array(applicationRecordSchema).min(1),
  tags: z.array(z.string()).default([]),
});
