import type { Booking } from "@/types/bookings";
import { mockAlumni } from "./alumni";
import { mockStudent } from "./users";

// Generate dates relative to today for demo
const today = new Date();
today.setHours(0, 0, 0, 0);

// Tomorrow at 11:00 AM - UPCOMING booking
const tomorrowSlot = new Date(today);
tomorrowSlot.setDate(today.getDate() + 1);
tomorrowSlot.setHours(11, 0, 0, 0);
const tomorrowSlotEnd = new Date(tomorrowSlot);
tomorrowSlotEnd.setMinutes(30);

// Today at 3:00 PM - UPCOMING booking (if current time is before 3 PM)
const todaySlot = new Date(today);
todaySlot.setHours(15, 0, 0, 0);
const todaySlotEnd = new Date(todaySlot);
todaySlotEnd.setMinutes(30);

// Yesterday at 11:00 AM - COMPLETED booking
const yesterdaySlot = new Date(today);
yesterdaySlot.setDate(today.getDate() - 1);
yesterdaySlot.setHours(11, 0, 0, 0);
const yesterdaySlotEnd = new Date(yesterdaySlot);
yesterdaySlotEnd.setMinutes(30);

// 2 days ago at 3:00 PM - COMPLETED booking
const twoDaysAgoSlot = new Date(today);
twoDaysAgoSlot.setDate(today.getDate() - 2);
twoDaysAgoSlot.setHours(15, 0, 0, 0);
const twoDaysAgoSlotEnd = new Date(twoDaysAgoSlot);
twoDaysAgoSlotEnd.setMinutes(30);

// 3 days from now at 7:00 PM - UPCOMING booking
const futureSlot = new Date(today);
futureSlot.setDate(today.getDate() + 3);
futureSlot.setHours(19, 0, 0, 0);
const futureSlotEnd = new Date(futureSlot);
futureSlotEnd.setMinutes(30);

// 5 days ago at 7:00 PM - CANCELLED booking
const cancelledSlot = new Date(today);
cancelledSlot.setDate(today.getDate() - 5);
cancelledSlot.setHours(19, 0, 0, 0);
const cancelledSlotEnd = new Date(cancelledSlot);
cancelledSlotEnd.setMinutes(30);

export const mockBookings: Booking[] = [
  {
    id: "b1",
    student: mockStudent,
    educator: mockAlumni[0],
    service: mockAlumni[0].services[0],
    slot: {
      id: `slot_${tomorrowSlot.toISOString().slice(0, 10)}_11`,
      startTime: tomorrowSlot.toISOString(),
      endTime: tomorrowSlotEnd.toISOString(),
      isBooked: true,
    },
    status: "UPCOMING",
  },
  {
    id: "b2",
    student: mockStudent,
    educator: mockAlumni[1],
    service: mockAlumni[1].services[1],
    slot: {
      id: `slot_${yesterdaySlot.toISOString().slice(0, 10)}_11`,
      startTime: yesterdaySlot.toISOString(),
      endTime: yesterdaySlotEnd.toISOString(),
      isBooked: true,
    },
    status: "COMPLETED",
  },
  {
    id: "b3",
    student: mockStudent,
    educator: mockAlumni[0],
    service: mockAlumni[0].services[2],
    slot: {
      id: `slot_${twoDaysAgoSlot.toISOString().slice(0, 10)}_15`,
      startTime: twoDaysAgoSlot.toISOString(),
      endTime: twoDaysAgoSlotEnd.toISOString(),
      isBooked: true,
    },
    status: "COMPLETED",
  },
  {
    id: "b4",
    student: mockStudent,
    educator: mockAlumni[1],
    service: mockAlumni[1].services[0],
    slot: {
      id: `slot_${futureSlot.toISOString().slice(0, 10)}_19`,
      startTime: futureSlot.toISOString(),
      endTime: futureSlotEnd.toISOString(),
      isBooked: true,
    },
    status: "UPCOMING",
  },
  {
    id: "b5",
    student: mockStudent,
    educator: mockAlumni[0],
    service: mockAlumni[0].services[1],
    slot: {
      id: `slot_${cancelledSlot.toISOString().slice(0, 10)}_19`,
      startTime: cancelledSlot.toISOString(),
      endTime: cancelledSlotEnd.toISOString(),
      isBooked: true,
    },
    status: "CANCELLED",
  },
];


