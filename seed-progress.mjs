// Seed some test data for the progress dashboard verification
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
const email = 'progress-test@astrokalki.local';

async function main() {
  // MicroReading
  await db.microReading.create({
    data: {
      email,
      birthMonth: 7,
      emotionalPattern: 'the-rescuer',
      relationshipFrustration: 'I keep choosing emotionally unavailable partners',
      resultHint: 'A pattern of rescue as love',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    },
  });
  await db.microReading.create({
    data: {
      email,
      birthMonth: 7,
      emotionalPattern: 'the-abandonment',
      relationshipFrustration: 'I leave before they can leave me',
      resultHint: 'Preemptive exit',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
  });

  // Journal entries — 8 consecutive days to trigger Week One milestone
  for (let i = 0; i < 8; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(9, 0, 0, 0);
    await db.journalEntry.create({
      data: {
        email,
        date: d,
        mood: ['heavy', 'tender', 'clear', 'anxious', 'numb'][i % 5],
        energy: 2 + (i % 3),
        trigger: i === 0 ? 'a phone call with my mother' : null,
        pattern: i === 4 ? 'the-rescuer' : null,
        note: 'Another day, another look at the pattern.',
        createdAt: d,
      },
    });
  }
  // Add 22 more scattered entries (over older dates) to reach 30 total (Consistent milestone)
  for (let i = 8; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i * 3);
    d.setHours(10, 0, 0, 0);
    await db.journalEntry.create({
      data: {
        email,
        date: d,
        mood: 'heavy',
        energy: 2,
        createdAt: d,
      },
    });
  }

  // Booking — one completed, one upcoming
  await db.booking.create({
    data: {
      name: 'Progress Test',
      email,
      phone: '+919999999999',
      duration: 60,
      price: '₹2,999',
      contexts: '[]',
      status: 'completed',
      scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
    },
  });
  await db.booking.create({
    data: {
      name: 'Progress Test',
      email,
      phone: '+919999999999',
      duration: 90,
      price: '₹4,499',
      contexts: '["shadow work","abandonment"]',
      status: 'confirmed',
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
  });

  // ChartAnalysis
  await db.chartAnalysis.create({
    data: {
      email,
      imageUrl: '/tmp/chart.png',
      analysis: 'A strong 6th house emphasis...',
      identifiedPatterns: JSON.stringify(['the-rescuer', 'the-emotional-caretaker']),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
    },
  });

  // PatternPortrait
  await db.patternPortrait.create({
    data: {
      email,
      pattern: 'the-rescuer',
      prompt: 'A figure offering hands to a shadow',
      imageUrl: '/tmp/portrait.png',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    },
  });

  // ChatConversation — 11 to trigger Deep Diver
  for (let i = 0; i < 11; i++) {
    await db.chatConversation.create({
      data: {
        email,
        title: `Conversation ${i + 1}`,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * i),
      },
    });
  }

  // EmailCourseEnrollment — complete
  await db.emailCourseEnrollment.create({
    data: {
      email,
      stage: 6,
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
    },
  });

  // Membership
  await db.membership.create({
    data: {
      email,
      name: 'Progress Test',
      plan: 'monthly',
      status: 'active',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35),
    },
  });

  console.log('Seed complete');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
