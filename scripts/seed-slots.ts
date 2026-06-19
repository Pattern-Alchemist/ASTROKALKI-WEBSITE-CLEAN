import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seedSlots() {
  console.log("[seed-slots] Starting availability slot seeding...");

  try {
    // Delete existing slots to start fresh
    await db.availabilitySlot.deleteMany({});
    console.log("[seed-slots] Cleared existing slots");

    // Generate 40+ slots across the next 30 days
    const slots = [];
    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(9, 0, 0, 0); // Start at 9 AM IST

    // Define slot times (in hours IST)
    const slotTimes = [
      { hour: 9, minute: 0 },   // 9:00 AM
      { hour: 10, minute: 0 },  // 10:00 AM
      { hour: 11, minute: 0 },  // 11:00 AM
      { hour: 2, minute: 0 },   // 2:00 PM
      { hour: 3, minute: 0 },   // 3:00 PM
      { hour: 4, minute: 0 },   // 4:00 PM
      { hour: 5, minute: 0 },   // 5:00 PM
      { hour: 6, minute: 30 },  // 6:30 PM
    ];

    // Generate slots for each day
    for (let day = 0; day < 30; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + day);

      // Skip past dates
      if (currentDate < now) continue;

      // Vary number of slots per day (3-7 slots)
      const numSlots = Math.floor(Math.random() * 5) + 3;
      const shuffledTimes = slotTimes.sort(() => Math.random() - 0.5).slice(0, numSlots);

      for (const time of shuffledTimes) {
        // Generate all three durations for each time slot
        for (const duration of [30, 60, 90]) {
          const start = new Date(currentDate);
          start.setHours(time.hour, time.minute, 0, 0);

          // Skip if in the past
          if (start < now) continue;

          const end = new Date(start);
          end.setMinutes(end.getMinutes() + duration);

          // Randomly make some slots "held" (being considered) vs "open"
          const status = Math.random() > 0.85 ? "held" : "open";

          slots.push({
            start,
            end,
            duration,
            status,
          });
        }
      }
    }

    // Create all slots
    const created = await db.availabilitySlot.createMany({
      data: slots,
    });

    console.log(`[seed-slots] ✅ Created ${created.count} availability slots`);
    console.log(
      `[seed-slots] Sample slots:\n${slots
        .slice(0, 5)
        .map(
          (s) =>
            `  - ${s.start.toISOString().split("T")[0]} ${s.start
              .toISOString()
              .split("T")[1]
              .slice(0, 5)} (${s.duration}min, ${s.status})`
        )
        .join("\n")}`
    );
  } catch (error) {
    console.error("[seed-slots] ❌ Error seeding slots:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

seedSlots();
