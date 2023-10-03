import { readStorage, removeStorage, writeStorage } from "@/services/mockStorage";
import type { AccountType, UserAccount } from "@/types/compliance";

const usersKey = "users";
const sessionKey = "session";

const defaultUser: UserAccount = {
  id: "USR-DEMO-001",
  fullName: "Demo Reviewer",
  email: "demo@packagecheck.local",
  password: "Demo123!",
  accountType: "normal",
};

function getUsers(): UserAccount[] {
  const users = readStorage<UserAccount[]>(usersKey, []);
  if (users.length === 0) {
    writeStorage(usersKey, [defaultUser]);
    return [defaultUser];
  }
  return users;
}

export function getCurrentUser(): UserAccount | null {
  return readStorage<UserAccount | null>(sessionKey, null);
}

export async function loginUser(email: string, password: string, accountType: AccountType): Promise<UserAccount> {
  await delay(450);
  const user = getUsers().find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password && item.accountType === accountType);
  if (!user) throw new Error("We could not match those credentials. Check your email, password, and account type.");
  writeStorage(sessionKey, user);
  return user;
}

export async function registerUser(input: Omit<UserAccount, "id">): Promise<UserAccount> {
  await delay(500);
  const users = getUsers();
  if (users.some((user) => user.email.toLowerCase() === input.email.trim().toLowerCase())) throw new Error("An account with this email already exists.");
  const user = { ...input, id: `USR-${Date.now()}` };
  writeStorage(usersKey, [...users, user]);
  return user;
}

export function logoutUser(): void {
  removeStorage(sessionKey);
}

export async function updateUser(userId: string, updates: Pick<UserAccount, "fullName" | "email" | "accountType">): Promise<UserAccount> {
  await delay(350);
  const users = getUsers().map((user) => user.id === userId ? { ...user, ...updates } : user);
  const updated = users.find((user) => user.id === userId);
  if (!updated) throw new Error("Account could not be updated.");
  writeStorage(usersKey, users);
  writeStorage(sessionKey, updated);
  return updated;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}