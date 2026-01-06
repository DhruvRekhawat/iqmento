"use client";

import type { Booking } from "@/types/bookings";
import type { Service } from "@/types/services";
import type { AvailabilitySlot } from "@/types/availability";

import { mockBookings } from "@/mocks/bookings";
import { mockServices } from "@/mocks/services";
import { generateWeeklySlots } from "@/mocks/availability";

type KycStatus = "PENDING" | "APPROVED" | "REJECTED";

type MockStoreState = {
  bookings: Booking[];
  servicesByEducatorSlug: Record<string, Service[]>;
  availabilityByEducatorSlug: Record<string, AvailabilitySlot[]>;
  kycStatusByEducatorSlug: Record<string, KycStatus>;
};

const STORAGE_KEY = "iqmento.mockStore.v1";

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function seed(): MockStoreState {
  // Generate slots starting from today for demo
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return {
    bookings: mockBookings,
    servicesByEducatorSlug: {
      "rahul-iit-bombay": mockServices,
      "priya-nid-ahmedabad": mockServices,
    },
    availabilityByEducatorSlug: {
      "rahul-iit-bombay": generateWeeklySlots({ startDate: today, days: 14 }),
      "priya-nid-ahmedabad": generateWeeklySlots({ startDate: today, days: 14 }),
    },
    kycStatusByEducatorSlug: {
      "rahul-iit-bombay": "APPROVED",
      "priya-nid-ahmedabad": "PENDING",
    },
  };
}

export function readMockStore(): MockStoreState {
  if (typeof window === "undefined") return seed();
  const stored = safeParse<MockStoreState>(window.localStorage.getItem(STORAGE_KEY));
  return stored ?? seed();
}

export function writeMockStore(next: MockStoreState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function getBookings(): Booking[] {
  return readMockStore().bookings;
}

export function upsertBooking(booking: Booking) {
  const store = readMockStore();
  const idx = store.bookings.findIndex((b) => b.id === booking.id);
  const nextBookings =
    idx === -1
      ? [booking, ...store.bookings]
      : store.bookings.map((b) => (b.id === booking.id ? booking : b));
  writeMockStore({ ...store, bookings: nextBookings });
}

export function getServicesForEducator(educatorSlug: string): Service[] {
  const store = readMockStore();
  return store.servicesByEducatorSlug[educatorSlug] ?? [];
}

export function setServicesForEducator(educatorSlug: string, services: Service[]) {
  const store = readMockStore();
  writeMockStore({
    ...store,
    servicesByEducatorSlug: { ...store.servicesByEducatorSlug, [educatorSlug]: services },
  });
}

export function getAvailabilityForEducator(educatorSlug: string): AvailabilitySlot[] {
  const store = readMockStore();
  return store.availabilityByEducatorSlug[educatorSlug] ?? [];
}

export function setAvailabilityForEducator(educatorSlug: string, slots: AvailabilitySlot[]) {
  const store = readMockStore();
  writeMockStore({
    ...store,
    availabilityByEducatorSlug: { ...store.availabilityByEducatorSlug, [educatorSlug]: slots },
  });
}

export function getKycStatus(educatorSlug: string): KycStatus {
  const store = readMockStore();
  return store.kycStatusByEducatorSlug[educatorSlug] ?? "PENDING";
}

export function setKycStatus(educatorSlug: string, status: KycStatus) {
  const store = readMockStore();
  writeMockStore({
    ...store,
    kycStatusByEducatorSlug: { ...store.kycStatusByEducatorSlug, [educatorSlug]: status },
  });
}


