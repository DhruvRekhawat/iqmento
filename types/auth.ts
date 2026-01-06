export type UserRole = "STUDENT" | "EDUCATOR" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}


