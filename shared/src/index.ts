// Shared types and utilities barrel export stub
export const SHARED_CONSTANT = "FINOVA_SHARED";
export function formatCurrencyINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}
export interface UserProfile {
  name: string;
  email: string;
  memberSince: string;
  theme: 'light' | 'dark';
}
