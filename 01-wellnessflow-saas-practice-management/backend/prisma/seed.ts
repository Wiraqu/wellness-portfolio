import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);

  const practitioner = await prisma.user.create({
    data: {
      email: 'demo@wellnessflow.com',
      password: hashedPassword,
      name: 'Dr. Sarah Chen',
      role: 'PRACTITIONER',
      subscriptionTier: 'PROFESSIONAL',
      stripeCustomerId: 'cus_demo_001',
      practitionerProfile: {
        create: {
          specialty: 'Nutrition & Wellness',
          bio: 'Board-certified nutritionist with 10+ years of experience.',
          phone: '+1 555-0199',
        },
      },
    },
  });

  const clients = await Promise.all([
    prisma.user.create({ data: { email: 'emma@example.com', password: hashedPassword, name: 'Emma Wilson', role: 'CLIENT' } }),
    prisma.user.create({ data: { email: 'james@example.com', password: hashedPassword, name: 'James Miller', role: 'CLIENT' } }),
    prisma.user.create({ data: { email: 'sophia@example.com', password: hashedPassword, name: 'Sophia Lee', role: 'CLIENT' } }),
  ]);

  const clientRecords = await Promise.all([
    prisma.client.create({
      data: { userId: clients[0].id, practitionerId: practitioner.id, healthGoals: ['Weight Loss', 'Nutrition'], notes: 'First time client, motivated', status: 'ACTIVE', lastSessionAt: new Date('2024-01-10') },
    }),
    prisma.client.create({
      data: { userId: clients[1].id, practitionerId: practitioner.id, healthGoals: ['Muscle Gain', 'Strength'], status: 'ACTIVE', lastSessionAt: new Date('2024-01-12') },
    }),
    prisma.client.create({
      data: { userId: clients[2].id, practitionerId: practitioner.id, healthGoals: ['Stress Management'], status: 'ONBOARDING', lastSessionAt: new Date('2024-01-08') },
    }),
  ]);

  await prisma.appointment.createMany({
    data: [
      { practitionerId: practitioner.id, clientId: clientRecords[0].id, title: 'Initial Consultation', date: new Date('2024-01-15T09:00:00Z'), duration: 60, type: 'INITIAL', status: 'SCHEDULED', notes: 'First consultation - nutrition plan' },
      { practitionerId: practitioner.id, clientId: clientRecords[1].id, title: 'Follow-up Session', date: new Date('2024-01-15T11:00:00Z'), duration: 45, type: 'FOLLOWUP', status: 'SCHEDULED' },
      { practitionerId: practitioner.id, clientId: clientRecords[2].id, title: 'Telehealth Check-in', date: new Date('2024-01-15T14:00:00Z'), duration: 60, type: 'TELEHEALTH', status: 'SCHEDULED' },
    ],
  });

  await prisma.invoice.createMany({
    data: [
      { practitionerId: practitioner.id, clientId: clientRecords[0].id, amount: 150.00, currency: 'USD', status: 'PAID', service: 'Initial Consultation', paidAt: new Date('2024-01-10') },
      { practitionerId: practitioner.id, clientId: clientRecords[1].id, amount: 120.00, currency: 'USD', status: 'PAID', service: 'Follow-up Session', paidAt: new Date('2024-01-12') },
      { practitionerId: practitioner.id, clientId: clientRecords[2].id, amount: 200.00, currency: 'USD', status: 'PENDING', service: '3-Session Package' },
    ],
  });

  console.log('Seed completed successfully');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
