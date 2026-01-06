import type { User } from "./auth";
import type { Service } from "./services";
import type { AvailabilitySlot } from "./availability";

export interface AlumniStats {
  sessions: number;
  rating: number;
}

export interface College {
  id: string;
  name: string;
  slug: string;
  location: string;
  rating?: number;
}

export interface Alumni {
  id: string;
  slug: string;
  name: string;
  headline?: string;
  currentCompany?: string;
  currentJobRole?: string;
  graduationYear?: number;
  college: College;
  isBookable: boolean;
  services: Service[];
  stats: AlumniStats;
}

export interface Booking {
  id: string;
  student: User;
  educator: Alumni;
  service: Service;
  slot: AvailabilitySlot;
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
}


