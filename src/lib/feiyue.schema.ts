import { z } from 'zod';

const applicationResultSchema = z.enum([
  'admit',
  'reject',
  'withdraw',
  'pending',
  'waitlist',
  'unknown',
]);

const undergraduateSchema = z.object({
  major: z.string().min(1),
  gpa: z.coerce.number().optional(),
  gpa_scale: z.coerce.number().default(4.0).optional(),
  ranking: z.string().optional(),
});

const scoresSchema = z
  .object({
    toefl: z.coerce.number().nullable().optional(),
    ielts: z.coerce.number().nullable().optional(),
    gre: z.coerce.number().nullable().optional(),
    gmat: z.coerce.number().nullable().optional(),
    duolingo: z.coerce.number().nullable().optional(),
  })
  .default({});

const applicationRecordSchema = z.object({
  school: z.string().min(1),
  program: z.string().min(1),
  degree: z.string().min(1),
  term: z.string().min(1),
  result: applicationResultSchema,
  final: z.boolean().default(false),
  scholarship: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
});

export const applicantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  undergraduate: undergraduateSchema,
  scores: scoresSchema,
  directions: z.array(z.string()).default([]),
  contact: z.string().optional(),
  homepage: z
    .string()
    .refine(
      (v) => !v || /^https?:\/\/|^mailto:/.test(v),
      'homepage must start with http://, https://, or mailto:'
    )
    .optional(),
  offers: z.array(z.string()).optional(),
  applications: z.array(applicationRecordSchema).min(1),
  tags: z.array(z.string()).default([]),
});
