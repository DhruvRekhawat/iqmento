import type { AvailabilitySlot } from "@/types/availability";

export function generateWeeklySlots(options?: {
  startDate?: Date;
  days?: number;
}): AvailabilitySlot[] {
  const start = options?.startDate ? new Date(options.startDate) : new Date();
  start.setHours(0, 0, 0, 0);

  const days = options?.days ?? 14;
  const slots: AvailabilitySlot[] = [];

  for (let d = 0; d < days; d++) {
    const day = new Date(start);
    day.setDate(start.getDate() + d);

    // 3 slots/day: 11:00, 15:00, 19:00 local time
    for (const hour of [11, 15, 19]) {
      const s = new Date(day);
      s.setHours(hour, 0, 0, 0);
      const e = new Date(day);
      e.setHours(hour, 30, 0, 0);

      slots.push({
        id: `slot_${day.toISOString().slice(0, 10)}_${hour}`,
        startTime: s.toISOString(),
        endTime: e.toISOString(),
        isBooked: false,
      });
    }
  }

  return slots;
}


