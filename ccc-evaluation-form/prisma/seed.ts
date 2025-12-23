import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

// Database is at project root (file:./dev.db in DATABASE_URL)
const dbPath = path.join(process.cwd(), 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

const AGE_GROUPS = ['13-19', '20-29', '30-39', '40-49', '50-59', '60+'];
const GENDERS = ['Male', 'Female'];
const SERVICES = ['1st Service (6:00–8:00am)', '2nd Service (8:00–10:00am)', '3rd Service (10:00am–12:00noon)'];
const RATINGS = ['Excellent', 'Good', 'Fair', 'Needs Improvement'];
const ACTIVITY_LEVELS = ['Very Active', 'Active', 'Not Active'];
const YES_NO_SOMETIMES = ['Yes', 'No', 'Sometimes'];
const YES_NO = ['Yes', 'No'];
const ATMOSPHERES = ['Vibrant', 'Encouraging', 'Neutral', 'Needs Revival'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

async function main() {
  console.log('🌱 Seeding database...');
  console.log('📍 Database path:', dbPath);

  // Create admin account
  const adminPassword = await bcrypt.hash('AdminCCC2024!', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'admin',
    },
  });
  console.log('✅ Admin account created');

  // Create volunteer account
  const volunteerPassword = await bcrypt.hash('volunteer2024', 10);
  await prisma.user.upsert({
    where: { username: 'volunteer' },
    update: {},
    create: {
      username: 'volunteer',
      password: volunteerPassword,
      role: 'volunteer',
    },
  });
  console.log('✅ Volunteer account created');

  // Check if we already have responses
  const responseCount = await prisma.response.count();
  if (responseCount > 10) {
    console.log(`ℹ️ Database already has ${responseCount} responses. Skipping mock data generation.`);
    return;
  }

  console.log('📝 Generating mock responses...');

  const responses = [];

  // Generate 50 mock responses
  for (let i = 0; i < 50; i++) {
    const isMember = getRandomBoolean();
    const hasChildren = getRandomBoolean();

    responses.push({
      enteredBy: 'volunteer',
      ageGroup: getRandomElement(AGE_GROUPS),
      gender: getRandomElement(GENDERS),
      serviceAttendance: getRandomElement(SERVICES),
      isMember: isMember,
      membershipCode: isMember ? `MEM-${Math.floor(Math.random() * 10000)}` : null,
      isRegularVisitor: !isMember ? getRandomBoolean() : null,
      hasChildren: hasChildren,
      childrenDepartments: hasChildren ? JSON.stringify(['Children Ministry']) : '[]',

      overallRating: getRandomElement(RATINGS),
      transitionSmooth: getRandomElement(YES_NO_SOMETIMES),
      enjoyMost: 'Worship and the word',
      improveAspects: 'AC is too cold sometimes',
      timesConvenient: getRandomBoolean(),
      timeSuggestions: '',

      departmentsInvolved: isMember ? 'Ushering' : '',
      departmentActivity: getRandomElement(ACTIVITY_LEVELS),
      departmentEffectiveness: getRandomElement(RATINGS),
      departmentImprovements: '',

      ministriesServing: '',
      ministryTeamwork: getRandomElement(RATINGS),
      ministrySupport: getRandomElement(YES_NO_SOMETIMES),
      ministryImprovements: '',

      spiritualAtmosphere: getRandomElement(ATMOSPHERES),
      exceptionalAreas: 'Hospitality',
      urgentImprovements: 'Parking space',
      additionalThoughts: 'Great service overall',
    });
  }

  // Insert in batches
  for (const resp of responses) {
    await prisma.response.create({ data: resp });
  }

  console.log(`✅ Added 50 mock responses`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
