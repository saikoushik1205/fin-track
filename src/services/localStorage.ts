import type {
  Transaction,
  Expense,
  InterestTransaction,
  PersonalEarning,
  OtherBalance,
} from "../types";
import type { User } from "../types/auth";

// Storage keys
const getKey = (userId: string, type: string) => `fintrack_${userId}_${type}`;
const USERS_KEY = "fintrack_users";

// User Management
export const saveUser = (user: User, password: string): void => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  users[user.email] = { ...user, password };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUser = (email: string, password: string): User | null => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  const userData = users[email];
  
  if (userData && userData.password === password) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...user } = userData;
    return user as User;
  }
  
  return null;
};

export const userExists = (email: string): boolean => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  return !!users[email];
};

// Transactions
export const saveTransactions = (userId: string, transactions: Transaction[]): void => {
  localStorage.setItem(getKey(userId, "transactions"), JSON.stringify(transactions));
};

export const loadTransactions = (userId: string): Transaction[] => {
  const data = localStorage.getItem(getKey(userId, "transactions"));
  if (!data) return [];
  
  return JSON.parse(data).map((t: Transaction) => ({
    ...t,
    date: new Date(t.date),
  }));
};

// Expenses
export const saveExpenses = (userId: string, expenses: Expense[]): void => {
  localStorage.setItem(getKey(userId, "expenses"), JSON.stringify(expenses));
};

export const loadExpenses = (userId: string): Expense[] => {
  const data = localStorage.getItem(getKey(userId, "expenses"));
  if (!data) return [];
  
  return JSON.parse(data).map((e: Expense) => ({
    ...e,
    date: new Date(e.date),
  }));
};

// Interest Transactions
export const saveInterestTransactions = (userId: string, interestTransactions: InterestTransaction[]): void => {
  localStorage.setItem(getKey(userId, "interest"), JSON.stringify(interestTransactions));
};

export const loadInterestTransactions = (userId: string): InterestTransaction[] => {
  const data = localStorage.getItem(getKey(userId, "interest"));
  if (!data) return [];
  
  return JSON.parse(data).map((i: InterestTransaction) => ({
    ...i,
    date: new Date(i.date),
  }));
};

// Personal Earnings
export const saveEarnings = (userId: string, earnings: PersonalEarning[]): void => {
  localStorage.setItem(getKey(userId, "earnings"), JSON.stringify(earnings));
};

export const loadEarnings = (userId: string): PersonalEarning[] => {
  const data = localStorage.getItem(getKey(userId, "earnings"));
  if (!data) return [];
  
  return JSON.parse(data).map((e: PersonalEarning) => ({
    ...e,
    date: new Date(e.date),
  }));
};

// Other Balances
export const saveOtherBalances = (userId: string, balances: OtherBalance[]): void => {
  localStorage.setItem(getKey(userId, "otherBalances"), JSON.stringify(balances));
};

export const loadOtherBalances = (userId: string): OtherBalance[] => {
  const data = localStorage.getItem(getKey(userId, "otherBalances"));
  if (!data) return [];
  
  return JSON.parse(data).map((b: OtherBalance) => ({
    ...b,
    updatedAt: new Date(b.updatedAt),
    transactions: b.transactions.map((t) => ({
      ...t,
      date: new Date(t.date),
    })),
  }));
};

// User Profile
export const saveUserProfile = (user: User): void => {
  localStorage.setItem(getKey(user.id, "profile"), JSON.stringify(user));
};

export const getUserProfile = (userId: string): User | null => {
  const data = localStorage.getItem(getKey(userId, "profile"));
  return data ? JSON.parse(data) : null;
};
