import type { User } from "@/types/auth";

export const mockStudent: User = {
  id: "u_student",
  name: "Demo Student",
  email: "student@demo.com",
  role: "STUDENT",
};

export const mockEducatorUser: User = {
  id: "u_educator",
  name: "Demo Educator",
  email: "educator@demo.com",
  role: "EDUCATOR",
};

export const mockAdmin: User = {
  id: "u_admin",
  name: "Demo Admin",
  email: "admin@demo.com",
  role: "ADMIN",
};


