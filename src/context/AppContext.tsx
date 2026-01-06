import React, { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
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
import { AppContext } from "./createAppContext";
import { useAuth } from "../hooks/useAuth";
import {
  loadTransactions as loadTransactionsFromFirestore,
  saveTransactions,
  loadExpenses as loadExpensesFromFirestore,
  saveExpenses,
  loadInterestTransactions as loadInterestFromFirestore,
  saveInterestTransactions,
  loadEarnings as loadEarningsFromFirestore,
  saveEarnings,
  loadOtherBalances as loadOtherBalancesFromFirestore,
  saveOtherBalances,
} from "../services/firestore";

// Firestore-based data persistence
const loadFromStorage = async (): Promise<Transaction[]> => {
  try {
    return await loadTransactionsFromFirestore();
  } catch (error) {
    console.error("Error loading transactions:", error);
    return [];
  }
};

const loadExpensesFromStorage = async (): Promise<Expense[]> => {
  try {
    return await loadExpensesFromFirestore();
  } catch (error) {
    console.error("Error loading expenses:", error);
    return [];
  }
};

const loadInterestFromStorage = async (): Promise<InterestTransaction[]> => {
  try {
    return await loadInterestFromFirestore();
  } catch (error) {
    console.error("Error loading interest:", error);
    return [];
  }
};

const loadEarningsFromStorage = async (): Promise<PersonalEarning[]> => {
  try {
    return await loadEarningsFromFirestore();
  } catch (error) {
    console.error("Error loading earnings:", error);
    return [];
  }
};

const loadOtherBalancesFromStorage = async (): Promise<OtherBalance[]> => {
  try {
    return await loadOtherBalancesFromFirestore();
  } catch (error) {
    console.error("Error loading other balances:", error);
    return [];
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  // Track if we've initialized data for the current user
  const initializedUserRef = useRef<string | null | undefined>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Initialize state with empty arrays (will be populated in effect)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [interestTransactions, setInterestTransactions] = useState<
    InterestTransaction[]
  >([]);
  const [personalEarnings, setPersonalEarnings] = useState<PersonalEarning[]>(
    []
  );
  const [otherBalances, setOtherBalances] = useState<OtherBalance[]>([]);

  // Handle user change and initial data load
  useEffect(() => {
    if (user && initializedUserRef.current !== user.id) {
      initializedUserRef.current = user.id;
      // Data loading will set isDataLoaded to true after completion

      // Load data from Firestore
      const loadData = async () => {
        try {
          console.log("📥 Loading data for user:", user.id);
          const [
            loadedTransactions,
            loadedExpenses,
            loadedInterest,
            loadedEarnings,
            loadedOtherBalances,
          ] = await Promise.all([
            loadFromStorage(),
            loadExpensesFromStorage(),
            loadInterestFromStorage(),
            loadEarningsFromStorage(),
            loadOtherBalancesFromStorage(),
          ]);

          console.log("✅ Data loaded:", {
            transactions: loadedTransactions.length,
            expenses: loadedExpenses.length,
            interest: loadedInterest.length,
            earnings: loadedEarnings.length,
            balances: loadedOtherBalances.length,
          });

          React.startTransition(() => {
            setTransactions(loadedTransactions);
            setExpenses(loadedExpenses);
            setInterestTransactions(loadedInterest);
            setPersonalEarnings(loadedEarnings);
            setOtherBalances(loadedOtherBalances);
            setIsDataLoaded(true);
          });
        } catch (error) {
          console.error("❌ Error loading data from Firestore:", error);
          setIsDataLoaded(true); // Set loaded even on error to unblock UI
        }
      };

      loadData();
    } else if (!user && initializedUserRef.current) {
      // Clear data when logging out
      console.log("🚪 User logged out, clearing data");
      initializedUserRef.current = null;
      React.startTransition(() => {
        setTransactions([]);
        setExpenses([]);
        setInterestTransactions([]);
        setPersonalEarnings([]);
        setOtherBalances([]);
        setIsDataLoaded(false);
      });
    }
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (!user) {
      console.warn("⚠️ Cannot add transaction: user not ready");
      return;
    }

    if (!isDataLoaded) {
      console.warn(
        "⚠️ Adding transaction before data fully loaded - proceeding anyway"
      );
    }

    try {
      console.log("💾 Creating transaction via Firestore");
      const newTransaction = {
        ...transaction,
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
      const updatedTransactions = [...transactions, newTransaction];
      await saveTransactions(updatedTransactions);
      setTransactions(updatedTransactions);
      console.log("✅ Transaction created successfully");
    } catch (error) {
      console.error("❌ Error creating transaction:", error);
    }
  };

  const updateTransaction = async (
    id: string,
    updates: Partial<Transaction>
  ) => {
    if (!user) {
      console.warn("⚠️ Cannot update transaction: user not ready");
      return;
    }

    try {
      console.log(`🔄 Updating transaction ${id} via Firestore`);
      const updatedTransactions = transactions.map((t) => 
        t.id === id ? { ...t, ...updates } : t
      );
      await saveTransactions(updatedTransactions);
      setTransactions(updatedTransactions);
      console.log("✅ Transaction updated successfully");
    } catch (error) {
      console.error("❌ Error updating transaction:", error);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) {
      console.warn("⚠️ Cannot delete transaction: user not ready");
      return;
    }

    try {
      console.log(`🗑️ Deleting transaction ${id} via Firestore`);
      const updatedTransactions = transactions.filter((t) => t.id !== id);
      await saveTransactions(updatedTransactions);
      setTransactions(updatedTransactions);
      console.log("✅ Transaction deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting transaction:", error);
    }
  };

  const getDashboardStats = (): DashboardStats => {
    const totalLent = transactions
      .filter((t) => t.type === "lending")
      .reduce((sum, t) => sum + (t.amount - (t.amountReturned || 0)), 0);

    const totalBorrowed = transactions
      .filter((t) => t.type === "borrowing")
      .reduce((sum, t) => sum + (t.amount - (t.amountReturned || 0)), 0);

    const netBalance = totalLent - totalBorrowed;

    const uniquePeople = new Set([
      ...transactions
        .filter(
          (t) => t.type === "lending" && t.amount > (t.amountReturned || 0)
        )
        .map((t) => t.personName),
      ...transactions
        .filter(
          (t) => t.type === "borrowing" && t.amount > (t.amountReturned || 0)
        )
        .map((t) => t.personName),
    ]);

    return {
      totalLent,
      totalBorrowed,
      netBalance,
      activePeopleCount: uniquePeople.size,
    };
  };

  const getPeople = (type: "borrower" | "lender"): Person[] => {
    const transactionType = type === "borrower" ? "lending" : "borrowing";
    const relevantTransactions = transactions.filter(
      (t) => t.type === transactionType
    );

    const peopleMap = new Map<string, Person>();

    relevantTransactions.forEach((transaction) => {
      const existing = peopleMap.get(transaction.personName);
      if (existing) {
        existing.totalAmount += transaction.amount;
        existing.amountReturned += transaction.amountReturned || 0;
        existing.remainingBalance =
          existing.totalAmount - existing.amountReturned;
        existing.transactions.push(transaction);
      } else {
        peopleMap.set(transaction.personName, {
          name: transaction.personName,
          totalAmount: transaction.amount,
          amountReturned: transaction.amountReturned || 0,
          remainingBalance:
            transaction.amount - (transaction.amountReturned || 0),
          transactions: [transaction],
          type,
        });
      }
    });

    return Array.from(peopleMap.values()).sort(
      (a, b) => b.remainingBalance - a.remainingBalance
    );
  };

  const getChartData = (): ChartDataPoint[] => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date;
    });

    return last30Days.map((date) => {
      const dateStr = date.toISOString().split("T")[0];
      const dayTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date).toISOString().split("T")[0];
        return tDate === dateStr;
      });

      const lending = dayTransactions
        .filter((t) => t.type === "lending")
        .reduce((sum, t) => sum + t.amount, 0);

      const borrowing = dayTransactions
        .filter((t) => t.type === "borrowing")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        lending,
        borrowing,
      };
    });
  };

  const getRecentTransactions = (limit: number = 5): Transaction[] => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  // Expense management functions
  const addExpense = async (expense: Omit<Expense, "id">) => {
    if (!user) {
      console.warn("⚠️ Cannot add expense: user not ready");
      return;
    }

    try {
      console.log("💸 Creating expense via Firestore");
      const newExpense = {
        ...expense,
        id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
      const updatedExpenses = [...expenses, newExpense];
      await saveExpenses(updatedExpenses);
      setExpenses(updatedExpenses);
      console.log("✅ Expense created successfully");
    } catch (error) {
      console.error("❌ Error creating expense:", error);
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    if (!user) {
      console.warn("⚠️ Cannot update expense: user not ready");
      return;
    }

    try {
      console.log(`🔄 Updating expense ${id} via Firestore`);
      const updatedExpenses = expenses.map((e) => 
        e.id === id ? { ...e, ...updates } : e
      );
      await saveExpenses(updatedExpenses);
      setExpenses(updatedExpenses);
      console.log("✅ Expense updated successfully");
    } catch (error) {
      console.error("❌ Error updating expense:", error);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) {
      console.warn("⚠️ Cannot delete expense: user not ready");
      return;
    }

    try {
      console.log(`🗑️ Deleting expense ${id} via Firestore`);
      const updatedExpenses = expenses.filter((e) => e.id !== id);
      await saveExpenses(updatedExpenses);
      setExpenses(updatedExpenses);
      console.log("✅ Expense deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting expense:", error);
    }
  };

  const getExpenseStats = (): ExpenseStats => {
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const categoryMap = new Map<string, number>();
    expenses.forEach((expense) => {
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + expense.amount);
    });

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyTotal = expenses
      .filter((e) => {
        const expenseDate = new Date(e.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      totalExpenses,
      categoryBreakdown,
      monthlyTotal,
    };
  };

  // Interest management functions
  const addInterestTransaction = async (
    transaction: Omit<InterestTransaction, "id">
  ) => {
    if (!user) {
      console.warn("⚠️ Cannot add interest transaction: user not ready");
      return;
    }

    try {
      console.log("💰 Creating interest transaction via Firestore");
      const newTransaction = {
        ...transaction,
        id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
      const updatedInterestTransactions = [...interestTransactions, newTransaction];
      await saveInterestTransactions(updatedInterestTransactions);
      setInterestTransactions(updatedInterestTransactions);
      console.log("✅ Interest transaction created successfully");
    } catch (error) {
      console.error("❌ Error creating interest transaction:", error);
    }
  };

  const updateInterestTransaction = async (
    id: string,
    updates: Partial<Omit<InterestTransaction, "id">>
  ) => {
    if (!user) {
      console.warn("⚠️ Cannot update interest transaction: user not ready");
      return;
    }

    try {
      console.log(`🔄 Updating interest transaction ${id} via Firestore`);
      const updatedInterestTransactions = interestTransactions.map((t) => 
        t.id === id ? { ...t, ...updates } : t
      );
      await saveInterestTransactions(updatedInterestTransactions);
      setInterestTransactions(updatedInterestTransactions);
      console.log("✅ Interest transaction updated successfully");
    } catch (error) {
      console.error("❌ Error updating interest transaction:", error);
    }
  };

  const deleteInterestTransaction = async (id: string) => {
    if (!user) {
      console.warn("⚠️ Cannot delete interest transaction: user not ready");
      return;
    }

    try {
      console.log(`🗑️ Deleting interest transaction ${id} via Firestore`);
      const updatedInterestTransactions = interestTransactions.filter((t) => t.id !== id);
      await saveInterestTransactions(updatedInterestTransactions);
      setInterestTransactions(updatedInterestTransactions);
      console.log("✅ Interest transaction deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting interest transaction:", error);
    }
  };

  const getInterestStats = (): InterestStats => {
    const totalPrincipal = interestTransactions.reduce(
      (sum, t) => sum + t.principal,
      0
    );
    const totalInterestEarned = interestTransactions.reduce(
      (sum, t) => sum + t.interest,
      0
    );
    const totalTransactions = interestTransactions.length;

    return {
      totalPrincipal,
      totalInterestEarned,
      totalTransactions,
    };
  };

  // Personal earnings management functions
  const addPersonalEarning = async (earning: Omit<PersonalEarning, "id">) => {
    if (!user) {
      console.warn("⚠️ Cannot add personal earning: user not ready");
      return;
    }

    try {
      console.log("💵 Creating personal earning via Firestore");
      const newEarning = {
        ...earning,
        id: `earn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
      const updatedEarnings = [...personalEarnings, newEarning];
      await saveEarnings(updatedEarnings);
      setPersonalEarnings(updatedEarnings);
      console.log("✅ Personal earning created successfully");
    } catch (error) {
      console.error("❌ Error creating personal earning:", error);
    }
  };

  const updatePersonalEarning = async (
    id: string,
    updates: Partial<Omit<PersonalEarning, "id">>
  ) => {
    if (!user) {
      console.warn("⚠️ Cannot update personal earning: user not ready");
      return;
    }

    try {
      console.log(`🔄 Updating personal earning ${id} via Firestore`);
      const updatedEarnings = personalEarnings.map((e) => 
        e.id === id ? { ...e, ...updates } : e
      );
      await saveEarnings(updatedEarnings);
      setPersonalEarnings(updatedEarnings);
      console.log("✅ Personal earning updated successfully");
    } catch (error) {
      console.error("❌ Error updating personal earning:", error);
    }
  };

  const deletePersonalEarning = async (id: string) => {
    if (!user) {
      console.warn("⚠️ Cannot delete personal earning: user not ready");
      return;
    }

    try {
      console.log(`🗑️ Deleting personal earning ${id} via Firestore`);
      const updatedEarnings = personalEarnings.filter((e) => e.id !== id);
      await saveEarnings(updatedEarnings);
      setPersonalEarnings(updatedEarnings);
      console.log("✅ Personal earning deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting personal earning:", error);
    }
  };

  const getPersonalEarningsStats = (): PersonalEarningsStats => {
    const totalEarned = personalEarnings.reduce((sum, e) => sum + e.amount, 0);
    const uniqueSources = new Set(personalEarnings.map((e) => e.sourceName));
    const totalSources = uniqueSources.size;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyTotal = personalEarnings
      .filter((e) => {
        const earningDate = new Date(e.date);
        return (
          earningDate.getMonth() === currentMonth &&
          earningDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      totalEarned,
      totalSources,
      monthlyTotal,
    };
  };

  // Other Balances Functions
  const addOtherBalance = async (
    balance: Omit<OtherBalance, "id" | "updatedAt" | "transactions">
  ) => {
    if (!user) {
      console.warn("⚠️ Cannot add other balance: user not ready");
      return;
    }

    try {
      console.log("🏦 Creating other balance via Firestore");
      const initialTransaction: OtherTransaction = {
        id: Date.now().toString(),
        type: "credit",
        note: "Opening Balance",
        amount: balance.amount,
        date: new Date(),
      };
      const newBalance = {
        ...balance,
        id: `bal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        updatedAt: new Date(),
        transactions: [initialTransaction],
      } as OtherBalance;
      const updatedBalances = [...otherBalances, newBalance];
      await saveOtherBalances(updatedBalances);
      setOtherBalances(updatedBalances);
      console.log("✅ Other balance created successfully");
    } catch (error) {
      console.error("❌ Error creating other balance:", error);
    }
  };

  const updateOtherBalance = async (
    id: string,
    updates: Omit<OtherBalance, "id" | "updatedAt" | "transactions">
  ) => {
    if (!user) {
      console.warn("⚠️ Cannot update other balance: user not ready");
      return;
    }

    try {
      console.log(`🔄 Updating other balance ${id} via Firestore`);
      const updatedBalances = otherBalances.map((b) => 
        b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b
      );
      await saveOtherBalances(updatedBalances);
      setOtherBalances(updatedBalances);
      console.log("✅ Other balance updated successfully");
    } catch (error) {
      console.error("❌ Error updating other balance:", error);
    }
  };

  const deleteOtherBalance = async (id: string) => {
    if (!user) {
      console.warn("⚠️ Cannot delete other balance: user not ready");
      return;
    }

    try {
      console.log(`🗑️ Deleting other balance ${id} via Firestore`);
      const updatedBalances = otherBalances.filter((b) => b.id !== id);
      await saveOtherBalances(updatedBalances);
      setOtherBalances(updatedBalances);
      console.log("✅ Other balance deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting other balance:", error);
    }
  };

  // Other Transaction Functions
  const addOtherTransaction = async (
    balanceId: string,
    transaction: Omit<OtherTransaction, "id">
  ) => {
    if (!user) {
      console.warn("⚠️ Cannot add other transaction: user not ready");
      return;
    }

    try {
      console.log(`💳 Adding other transaction to balance ${balanceId}`);
      const balance = otherBalances.find((b) => b.id === balanceId);
      if (!balance) return;

      const newTransaction: OtherTransaction = {
        ...transaction,
        id: Date.now().toString(),
      };
      const updatedTransactions = [...balance.transactions, newTransaction];
      const newAmount = updatedTransactions.reduce((sum, t) => {
        return t.type === "credit" ? sum + t.amount : sum - t.amount;
      }, 0);

      const updatedBalances = otherBalances.map((b) =>
        b.id === balanceId
          ? { ...b, transactions: updatedTransactions, amount: newAmount, updatedAt: new Date() }
          : b
      );
      await saveOtherBalances(updatedBalances);
      setOtherBalances(updatedBalances);
      console.log("✅ Other transaction added successfully");
    } catch (error) {
      console.error("❌ Error adding other transaction:", error);
    }
  };

  const updateOtherTransaction = async (
    balanceId: string,
    transactionId: string,
    updates: Partial<OtherTransaction>
  ) => {
    if (!user) {
      console.warn("⚠️ Cannot update other transaction: user not ready");
      return;
    }

    try {
      console.log(
        `🔄 Updating other transaction ${transactionId} in balance ${balanceId}`
      );
      const balance = otherBalances.find((b) => b.id === balanceId);
      if (!balance) return;

      const updatedTransactions = balance.transactions.map((t) =>
        t.id === transactionId ? { ...t, ...updates } : t
      );
      const newAmount = updatedTransactions.reduce((sum, t) => {
        return t.type === "credit" ? sum + t.amount : sum - t.amount;
      }, 0);

      const updatedBalances = otherBalances.map((b) =>
        b.id === balanceId
          ? { ...b, transactions: updatedTransactions, amount: newAmount, updatedAt: new Date() }
          : b
      );
      await saveOtherBalances(updatedBalances);
      setOtherBalances(updatedBalances);
      console.log("✅ Other transaction updated successfully");
    } catch (error) {
      console.error("❌ Error updating other transaction:", error);
    }
  };

  const deleteOtherTransaction = async (
    balanceId: string,
    transactionId: string
  ) => {
    if (!user) {
      console.warn("⚠️ Cannot delete other transaction: user not ready");
      return;
    }

    try {
      console.log(
        `🗑️ Deleting other transaction ${transactionId} from balance ${balanceId}`
      );
      const balance = otherBalances.find((b) => b.id === balanceId);
      if (!balance) return;

      const updatedTransactions = balance.transactions.filter(
        (t) => t.id !== transactionId
      );
      const newAmount = updatedTransactions.reduce((sum, t) => {
        return t.type === "credit" ? sum + t.amount : sum - t.amount;
      }, 0);

      const updatedBalances = otherBalances.map((b) =>
        b.id === balanceId
          ? { ...b, transactions: updatedTransactions, amount: newAmount, updatedAt: new Date() }
          : b
      );
      await saveOtherBalances(updatedBalances);
      setOtherBalances(updatedBalances);
      console.log("✅ Other transaction deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting other transaction:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getDashboardStats,
        getPeople,
        getChartData,
        getRecentTransactions,
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpenseStats,
        interestTransactions,
        addInterestTransaction,
        updateInterestTransaction,
        deleteInterestTransaction,
        getInterestStats,
        personalEarnings,
        addPersonalEarning,
        updatePersonalEarning,
        deletePersonalEarning,
        getPersonalEarningsStats,
        otherBalances,
        addOtherBalance,
        updateOtherBalance,
        deleteOtherBalance,
        addOtherTransaction,
        updateOtherTransaction,
        deleteOtherTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
