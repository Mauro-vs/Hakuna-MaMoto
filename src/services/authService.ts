import { AuthUser, mockAuthUsers } from "../types/types";

export async function loginService(email: string, password: string): Promise<AuthUser> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const entry = mockAuthUsers[email.toLowerCase()];
  if (!entry || entry.password !== password) {
    throw new Error("Email o contraseña incorrectos");
  }
  return entry.user;
}

export async function logoutService(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));
}
