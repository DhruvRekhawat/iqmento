import type { Alumni } from "@/types/bookings";
import { mockServices } from "./services";

export const mockAlumni: Alumni[] = [
  {
    id: "a1",
    slug: "rahul-iit-bombay",
    name: "Rahul Sharma",
    headline: "SWE @ Google",
    currentCompany: "Google",
    currentJobRole: "Software Engineer",
    graduationYear: 2019,
    isBookable: true,
    college: {
      id: "c1",
      name: "IIT Bombay",
      slug: "iit-bombay",
      location: "Mumbai",
      rating: 4.7,
    },
    services: mockServices,
    stats: { sessions: 120, rating: 4.8 },
  },
  {
    id: "a2",
    slug: "priya-nid-ahmedabad",
    name: "Priya Verma",
    headline: "Product Designer @ Notion",
    currentCompany: "Notion",
    currentJobRole: "Product Designer",
    graduationYear: 2020,
    isBookable: true,
    college: {
      id: "c2",
      name: "NID Ahmedabad",
      slug: "nid-ahmedabad",
      location: "Ahmedabad",
      rating: 4.6,
    },
    services: mockServices,
    stats: { sessions: 64, rating: 4.9 },
  },
];


