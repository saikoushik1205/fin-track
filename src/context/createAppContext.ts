import { createContext } from "react";
import type {
  Transaction,
  Person,
  DashboardStats,
  ChartDataPoint,
  Expense,
  ExpenseStats,
  InterestTransaction,
  InterestStats,
  PersonalEarning,
  PersonalEarningsStats,
  OtherBalance,
  OtherTransaction,
} from "../types";

export interface AppContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getDashboardStats: () => DashboardStats;
  getPeople: (type: "borrower" | "lender") => Person[];
  getChartData: () => ChartDataPoint[];
  getRecentTransactions: (limit?: number) => Transaction[];
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getExpenseStats: () => ExpenseStats;
  interestTransactions: InterestTransaction[];
  addInterestTransaction: (
    transaction: Omit<InterestTransaction, "id">
  ) => void;
  updateInterestTransaction: (
    id: string,
    updates: Partial<Omit<InterestTransaction, "id">>
  ) => void;
  deleteInterestTransaction: (id: string) => void;
  getInterestStats: () => InterestStats;
  personalEarnings: PersonalEarning[];
  addPersonalEarning: (earning: Omit<PersonalEarning, "id">) => void;
  updatePersonalEarning: (
    id: string,
    updates: Partial<Omit<PersonalEarning, "id">>
  ) => void;
  deletePersonalEarning: (id: string) => void;
  getPersonalEarningsStats: () => PersonalEarningsStats;
  otherBalances: OtherBalance[];
  addOtherBalance: (
    balance: Omit<OtherBalance, "id" | "updatedAt" | "transactions">
  ) => void;
  updateOtherBalance: (
    id: string,
    updates: Omit<OtherBalance, "id" | "updatedAt" | "transactions">
  ) => void;
  deleteOtherBalance: (id: string) => void;
  addOtherTransaction: (
    balanceId: string,
    transaction: Omit<OtherTransaction, "id">
  ) => void;
  updateOtherTransaction: (
    balanceId: string,
    transactionId: string,
    updates: Partial<OtherTransaction>
  ) => void;
  deleteOtherTransaction: (balanceId: string, transactionId: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
