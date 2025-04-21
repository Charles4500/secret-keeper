interface StoredPassword {
  id: string;
  service: string;
  password: string;
}

const STORAGE_KEY = process.env.NEXT_STORAGE_KEY ?? '';

export function getPasswords(): StoredPassword[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse stored password', error);
    return [];
  }
}

export function savePassword(service: string, password: string): void {
  if (typeof window === 'undefined') return;

  const passwords = getPasswords();

  const newPassword: StoredPassword = {
    id: generateId(),
    service: service.trim(),
    password,
  };

  passwords.push(newPassword);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(passwords));
}

export function updatePassword(
  id: string,
  service: string,
  password: string
): void {
  if (typeof window === 'undefined') return;

  const passwords = getPasswords();
  const index = passwords.findIndex((p) => p.id === id);

  if (index !== -1) {
    passwords[index] = {
      ...passwords[index],
      service: service.trim(),
      password,
    };
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(passwords));
}

export function deletePassword(id: string): void {
  if (typeof window === 'undefined') return;

  const passwords = getPasswords();
  const filtered = passwords.filter((p) => p.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
