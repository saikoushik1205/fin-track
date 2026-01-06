import {
  doc,
  setDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import type {
  Transaction,
  Expense,
  InterestTransaction,
  PersonalEarning,
  OtherBalance,
} from "../types";
import type { User } from "../types/auth";

// Helper to get current user ID
const getUserId = () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  return user.uid;
};

// Helper to remove undefined values and convert Dates to Timestamps
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const removeUndefined = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => removeUndefined(item));
  }
  if (obj instanceof Date) {
    // Convert Date to Firestore Timestamp
    if (isNaN(obj.getTime())) {
      // Invalid date - use current time
      return Timestamp.now();
    }
    return Timestamp.fromDate(obj);
  }
  if (obj !== null && typeof obj === "object") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleaned: any = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== undefined) {
        cleaned[key] = removeUndefined(obj[key]);
      }
    });
    return cleaned;
  }
  return obj;
};

// Helper to convert Firestore timestamp to Date
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertTimestamps = (data: any): any => {
  const converted = { ...data };
  Object.keys(converted).forEach((key) => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
    if (Array.isArray(converted[key])) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      converted[key] = converted[key].map((item: any) => {
        if (typeof item === "object" && item !== null) {
          return convertTimestamps(item);
        }
        return item;
      });
    }
  });
  return converted;
};

// Transactions
export const saveTransactions = async (transactions: Transaction[]) => {
  try {
    const userId = getUserId();
    const docRef = doc(db, "users", userId, "data", "transactions");
    const cleanedTransactions = removeUndefined(transactions);
    await setDoc(docRef, { transactions: cleanedTransactions });
  } catch (error) {
    console.error("Error saving transactions:", error);
    throw error;
  }
};

export const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    const userId = getUserId();
    const docRef = doc(db, "users", userId, "data", "transactions");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.transactions.map((t: any) => convertTimestamps(t));
    }
    return [];
  } catch (error) {
    console.error("Error loading transactions:", error);
    return [];
  }
};

// Expenses
export const saveExpenses = async (expenses: Expense[]) => {
  try {
    const userId = getUserId();
    const docRef = doc(db, "users", userId, "data", "expenses");
    const cleanedExpenses = removeUndefined(expenses);
    await setDoc(docRef, { expenses: cleanedExpenses });
  } catch (error) {
    console.error("Error saving expenses:", error);
    throw error;
  }
};

export const loadExpenses = async (): Promise<Expense[]> => {
  try {
    const userId = getUserId();
    const docRef = doc(db, "users", userId, "data", "expenses");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.expenses.map((e: any) => convertTimestamps(e));
    }
    return [];
  } catch (error) {
    console.error("Error loading expenses:", error);
    return [];
  }
};

// Interest Transactions
export const saveInterestTransactions = async (
  interestTransactions: InterestTransaction[]
) => {
  try {
    const userId = getUserId();
    const docRef = doc(db, "users", userId, "data", "interest");
    const cleanedInterest = removeUndefined(interestTransactions);
    await setDoc(docRef, { interestTransactions: cleanedInterest });
  } catch (error) {
    console.error("Error saving interest transactions:", error);
    throw error;
  }
};

export const loadInterestTransactions = async (): Promise<
  InterestTransaction[]
> => {
  try {
    const userId = getUserId();
    const docRef = doc(db, "users", userId, "data", "interest");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.interestTransactions.map((i: any) => convertTimestamps(i));
    }
    return [];
  } catch (error) {
    console.error("Error loading interest transactions:", error);
    return [];
  }
};

// Personal Earnings
export const saveEarnings = async (earnings: PersonalEarning[]) => {
  try {
    const userId = getUserId();
    const docRef = doc(db, "users", userId, "data", "earnings");
    const cleanedEarnings = removeUndefined(earnings);
    await setDoc(docRef, { earnings: cleanedEarnings });
  } catch (error) {
    console.error("Error saving earnings:", error);
    throw error;
  }
};

export const loadEarnings = async (): Promise<PersonalEarning[]> => {
  try {
    const userId = getUserId();
    const docRef = doc(db, "users", userId, "data", "earnings");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.earnings.map((e: any) => convertTimestamps(e));
    }
    return [];
  } catch (error) {
    console.error("Error loading earnings:", error);
    return [];
  }
};

// Other Balances
export const saveOtherBalances = async (balances: OtherBalance[]) => {
  try {
    const userId = getUserId();
    const docRef = doc(db, "users", userId, "data", "otherBalances");
    const cleanedBalances = removeUndefined(balances);
    await setDoc(docRef, { balances: cleanedBalances });
  } catch (error) {
    console.error("Error saving other balances:", error);
    throw error;
  }
};

export const loadOtherBalances = async (): Promise<OtherBalance[]> => {
  try {
    const userId = getUserId();
    const docRef = doc(db, "users", userId, "data", "otherBalances");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.balances.map((b: any) => convertTimestamps(b));
    }
    return [];
  } catch (error) {
    console.error("Error loading other balances:", error);
    return [];
  }
};

// User Profile Management
export const saveUserProfile = async (user: User): Promise<void> => {
  try {
    const docRef = doc(db, "users", user.id, "profile", "info");
    await setDoc(docRef, {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      provider: user.provider,
      createdAt: user.createdAt,
      updatedAt: new Date().toISOString(),
    });
    console.log("User profile saved to Firestore");
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const docRef = doc(db, "users", userId, "profile", "info");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("User profile loaded from Firestore:", data);
      return {
        id: userId,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        provider: data.provider,
        createdAt: data.createdAt,
      } as User;
    }

    console.log("No existing profile found for user:", userId);
    return null;
  } catch (error) {
    console.error("Error loading user profile:", error);
    return null;
  }
};
