import { z } from 'zod';

// Section A: Personal Information
export const sectionASchema = z.object({
    ageGroup: z.string().min(1, 'Age group is required'),
    gender: z.enum(['Male', 'Female'] as const, { message: 'Please select your gender' }),
    serviceAttendance: z.array(z.string()).min(1, 'Please select at least one service'),
    isMember: z.enum(['Yes', 'No'] as const, { message: 'Please indicate if you are a member' }),
    membershipCode: z.string().optional(),
    isRegularVisitor: z.enum(['Yes', 'No'] as const).optional(),
    hasChildren: z.enum(['Yes', 'No'] as const, { message: 'Please indicate if you have children' }),
    childrenDepartments: z.array(z.string()).optional(),
});

// Section B: Service Experience
export const sectionBSchema = z.object({
    overallRating: z.enum(['Excellent', 'Good', 'Fair', 'Needs Improvement'] as const, { message: 'Please rate the service' }),
    transitionSmooth: z.enum(['Yes', 'Somewhat', 'No'] as const, { message: 'Please rate the transition' }),
    enjoyMost: z.string().min(1, 'Please share what you enjoy most').max(2000),
    improveAspects: z.string().min(1, 'Please share improvement suggestions').max(2000),
    timesConvenient: z.enum(['Yes', 'No'] as const, { message: 'Please indicate if times are convenient' }),
    timeSuggestions: z.string().max(2000).optional(),
});

// Section C: Departmental Involvement
export const sectionCSchema = z.object({
    departmentsInvolved: z.string().min(1, 'Please list your departments').max(2000),
    departmentActivity: z.enum(['Very Active', 'Active', 'Not Active'] as const, { message: 'Please rate activity level' }),
    departmentEffectiveness: z.enum(['Excellent', 'Good', 'Fair', 'Needs Improvement'] as const, { message: 'Please rate effectiveness' }),
    departmentImprovements: z.string().min(1, 'Please share improvement suggestions').max(2000),
});

// Section D: Ministry Functionality
export const sectionDSchema = z.object({
    ministriesServing: z.string().min(1, 'Please list your ministries').max(2000),
    ministryTeamwork: z.enum(['Excellent', 'Good', 'Fair', 'Needs Improvement'] as const, { message: 'Please rate teamwork' }),
    ministrySupport: z.enum(['Yes', 'Sometimes', 'No'] as const, { message: 'Please rate support' }),
    ministryImprovements: z.string().min(1, 'Please share improvement suggestions').max(2000),
});

// Section E: Overall Feedback
export const sectionESchema = z.object({
    spiritualAtmosphere: z.enum(['Vibrant', 'Encouraging', 'Neutral', 'Needs Revival'] as const, { message: 'Please rate the atmosphere' }),
    exceptionalAreas: z.string().min(1, 'Please share what CCC does well').max(2000),
    urgentImprovements: z.string().min(1, 'Please share urgent improvements').max(2000),
    additionalThoughts: z.string().min(1, 'Please share additional thoughts').max(2000),
});

// Combined form schema
export const formSchema = z.object({
    ...sectionASchema.shape,
    ...sectionBSchema.shape,
    ...sectionCSchema.shape,
    ...sectionDSchema.shape,
    ...sectionESchema.shape,
});

export type SectionAData = z.infer<typeof sectionASchema>;
export type SectionBData = z.infer<typeof sectionBSchema>;
export type SectionCData = z.infer<typeof sectionCSchema>;
export type SectionDData = z.infer<typeof sectionDSchema>;
export type SectionEData = z.infer<typeof sectionESchema>;
export type FormData = z.infer<typeof formSchema>;
