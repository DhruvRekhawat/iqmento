export type UserRole = "STUDENT" | "EDUCATOR" | "ADMIN";

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string;
  role: UserRole;
}


