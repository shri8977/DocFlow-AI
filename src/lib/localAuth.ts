export interface LocalUser {
  id: string;
  email: string;
  password: string;
  full_name?: string;
  avatar_url?: string;
}

const USERS_KEY = "docflow_ai_users";
const SESSION_KEY = "docflow_ai_session";

const defaultAvatar = "https://api.dicebear.com/7.x/adventurer/svg?seed=A";

function safeJSONParse<T>(value: string | null, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function getUsers(): LocalUser[] {
  return safeJSONParse<LocalUser[]>(localStorage.getItem(USERS_KEY), []);
}

function saveUsers(users: LocalUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): LocalUser | null {
  return safeJSONParse<LocalUser | null>(localStorage.getItem(SESSION_KEY), null);
}

function setCurrentUser(user: LocalUser | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function registerUser(email: string, password: string, fullName?: string) {
  const users = getUsers();
  const existing = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error("A user with this email already exists.");
  }

  const user: LocalUser = {
    id: createId(),
    email,
    password,
    full_name: fullName || "",
    avatar_url: defaultAvatar,
  };
  users.push(user);
  saveUsers(users);
  setCurrentUser(user);
  return user;
}

export async function authenticateUser(email: string, password: string) {
  const users = getUsers();
  const user = users.find(
    (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
  );
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  setCurrentUser(user);
  return user;
}

export async function signOutUser() {
  setCurrentUser(null);
}

export async function updatePassword(userId: string, password: string) {
  const users = getUsers();
  const user = users.find((item) => item.id === userId);
  if (!user) {
    throw new Error("User not found.");
  }
  user.password = password;
  saveUsers(users);
  setCurrentUser(user);
  return user;
}

export async function loadUserProfile(userId: string) {
  const users = getUsers();
  const user = users.find((item) => item.id === userId);
  if (!user) return { full_name: "", avatar_url: defaultAvatar };
  return {
    full_name: user.full_name || "",
    avatar_url: user.avatar_url || defaultAvatar,
  };
}

export async function updateUserProfile(userId: string, profile: { full_name?: string; avatar_url?: string }) {
  const users = getUsers();
  const user = users.find((item) => item.id === userId);
  if (!user) {
    throw new Error("User not found.");
  }
  if (profile.full_name !== undefined) {
    user.full_name = profile.full_name;
  }
  if (profile.avatar_url !== undefined) {
    user.avatar_url = profile.avatar_url;
  }
  saveUsers(users);
  setCurrentUser(user);
  return user;
}
