import { auth } from "../config/firebase";
import type {
  Transaction,
  Expense,
  InterestTransaction,
  PersonalEarning,
  OtherBalance,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Helper to get Firebase ID token
const getAuthToken = async (): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  return await user.getIdToken();
};

// Helper for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};

// Transactions
export const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    const data = await apiCall("/transactions");
    return data.map((t: any) => ({
      ...t,
      id: t._id,
      date: new Date(t.date),
    }));
  } catch (error) {
    console.error("Error loading transactions:", error);
    return [];
  }
};

export const createTransaction = async (
  transaction: Omit<Transaction, "id">
): Promise<Transaction> => {
  const data = await apiCall("/transactions", {
    method: "POST",
    body: JSON.stringify(transaction),
  });
  return {
    ...data,
    id: data._id,
    date: new Date(data.date),
  };
};

export const updateTransaction = async (
  id: string,
  updates: Partial<Transaction>
): Promise<Transaction> => {
  const data = await apiCall(`/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return {
    ...data,
    id: data._id,
    date: new Date(data.date),
  };
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await apiCall(`/transactions/${id}`, {
    method: "DELETE",
  });
};

// Expenses
export const loadExpenses = async (): Promise<Expense[]> => {
  try {
    const data = await apiCall("/expenses");
    return data.map((e: any) => ({
      ...e,
      id: e._id,
      date: new Date(e.date),
    }));
  } catch (error) {
    console.error("Error loading expenses:", error);
    return [];
  }
};

export const createExpense = async (
  expense: Omit<Expense, "id">
): Promise<Expense> => {
  const data = await apiCall("/expenses", {
    method: "POST",
    body: JSON.stringify(expense),
  });
  return {
    ...data,
    id: data._id,
    date: new Date(data.date),
  };
};

export const updateExpense = async (
  id: string,
  updates: Partial<Expense>
): Promise<Expense> => {
  const data = await apiCall(`/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return {
    ...data,
    id: data._id,
    date: new Date(data.date),
  };
};

export const deleteExpense = async (id: string): Promise<void> => {
  await apiCall(`/expenses/${id}`, {
    method: "DELETE",
  });
};

// Interest Transactions

export const loadInterestTransactions = async (): Promise<
  InterestTransaction[]
> => {
  try {
    const data = await apiCall("/interest");
    return data.map((t: any) => ({
      ...t,
      id: t._id,
      date: new Date(t.date),
    }));
  } catch (error) {
    console.error("Error loading interest transactions:", error);
    return [];
  }
};

export const createInterestTransaction = async (
  transaction: Omit<InterestTransaction, "id">
): Promise<InterestTransaction> => {
  const data = await apiCall("/interest", {
    method: "POST",
    body: JSON.stringify(transaction),
  });
  return {
    ...data,
    id: data._id,
    date: new Date(data.date),
  };
};

export const updateInterestTransaction = async (
  id: string,
  updates: Partial<InterestTransaction>
): Promise<InterestTransaction> => {
  const data = await apiCall(`/interest/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return {
    ...data,
    id: data._id,
    date: new Date(data.date),
  };
};

export const deleteInterestTransaction = async (id: string): Promise<void> => {
  await apiCall(`/interest/${id}`, {
    method: "DELETE",
  });
};

// Personal Earnings
export const loadEarnings = async (): Promise<PersonalEarning[]> => {
  try {
    const data = await apiCall("/earnings");
    return data.map((e: any) => ({
      ...e,
      id: e._id,
      date: new Date(e.date),
    }));
  } catch (error) {
    console.error("Error loading earnings:", error);
    return [];
  }
};

export const createEarning = async (
  earning: Omit<PersonalEarning, "id">
): Promise<PersonalEarning> => {
  const data = await apiCall("/earnings", {
    method: "POST",
    body: JSON.stringify(earning),
  });
  return {
    ...data,
    id: data._id,
    date: new Date(data.date),
  };
};

export const updateEarning = async (
  id: string,
  updates: Partial<PersonalEarning>
): Promise<PersonalEarning> => {
  const data = await apiCall(`/earnings/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return {
    ...data,
    id: data._id,
    date: new Date(data.date),
  };
};

export const deleteEarning = async (id: string): Promise<void> => {
  await apiCall(`/earnings/${id}`, {
    method: "DELETE",
  });
};

// Other Balances
export const loadOtherBalances = async (): Promise<OtherBalance[]> => {
  try {
    const data = await apiCall("/other-balances");
    return data.map((b: any) => ({
      ...b,
      id: b._id,
      updatedAt: new Date(b.updatedAt),
      transactions: b.transactions.map((t: any) => ({
        ...t,
        date: new Date(t.date),
      })),
    }));
  } catch (error) {
    console.error("Error loading other balances:", error);
    return [];
  }
};

export const createOtherBalance = async (
  balance: Omit<OtherBalance, "id">
): Promise<OtherBalance> => {
  const data = await apiCall("/other-balances", {
    method: "POST",
    body: JSON.stringify(balance),
  });
  return {
    ...data,
    id: data._id,
    updatedAt: new Date(data.updatedAt),
    transactions: data.transactions.map((t: any) => ({
      ...t,
      date: new Date(t.date),
    })),
  };
};

export const updateOtherBalance = async (
  id: string,
  updates: Partial<OtherBalance>
): Promise<OtherBalance> => {
  const data = await apiCall(`/other-balances/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return {
    ...data,
    id: data._id,
    updatedAt: new Date(data.updatedAt),
    transactions: data.transactions.map((t: any) => ({
      ...t,
      date: new Date(t.date),
    })),
  };
};

export const deleteOtherBalance = async (id: string): Promise<void> => {
  await apiCall(`/other-balances/${id}`, {
    method: "DELETE",
  });
};

// User Profile (keeping for compatibility, but not needed with MongoDB)
export const saveUserProfile = async (_profile: any) => {
  // Not needed - user info comes from Firebase Auth
  console.log("Profile saved to localStorage only");
};

export const getUserProfile = async (_userId: string) => {
  // Not needed - user info comes from Firebase Auth
  return null;
};
