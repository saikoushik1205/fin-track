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
  saveTransactions as saveTransactionsToFirestore,
  loadTransactions as loadTransactionsFromFirestore,
  saveExpenses as saveExpensesToFirestore,
  loadExpenses as loadExpensesFromFirestore,
  saveInterestTransactions as saveInterestToFirestore,
  loadInterestTransactions as loadInterestFromFirestore,
  saveEarnings as saveEarningsToFirestore,
  loadEarnings as loadEarningsFromFirestore,
  saveOtherBalances as saveOtherBalancesToFirestore,
  loadOtherBalances as loadOtherBalancesFromFirestore,
} from "../services/firestore";

// Firestore-based data persistence
const saveToStorage = async (transactions: Transaction[]) => {
  try {
    await saveTransactionsToFirestore(transactions);
  } catch (error) {
    console.error("Error saving transactions:", error);
  }
};

const loadFromStorage = async (): Promise<Transaction[]> => {
  try {
    return await loadTransactionsFromFirestore();
  } catch (error) {
    console.error("Error loading transactions:", error);
    return [];
  }
};

const saveExpensesToStorage = async (expenses: Expense[]) => {
  try {
    await saveExpensesToFirestore(expenses);
  } catch (error) {
    console.error("Error saving expenses:", error);
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

const saveInterestToStorage = async (
  interestTransactions: InterestTransaction[]
) => {
  try {
    await saveInterestToFirestore(interestTransactions);
  } catch (error) {
    console.error("Error saving interest:", error);
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

const saveEarningsToStorage = async (earnings: PersonalEarning[]) => {
  try {
    await saveEarningsToFirestore(earnings);
  } catch (error) {
    console.error("Error saving earnings:", error);
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

const saveOtherBalancesToStorage = async (balances: OtherBalance[]) => {
  try {
    await saveOtherBalancesToFirestore(balances);
  } catch (error) {
    console.error("Error saving other balances:", error);
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
      setIsDataLoaded(false);

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
      setIsDataLoaded(false);
      React.startTransition(() => {
        setTransactions([]);
        setExpenses([]);
        setInterestTransactions([]);
        setPersonalEarnings([]);
        setOtherBalances([]);
      });
    }
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (!user || !isDataLoaded) {
      console.warn("⚠️ Cannot add transaction: user not ready or data not loaded");
      return;
    }

    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      amountReturned: transaction.amountReturned || 0,
    };

    const updated = [...transactions, newTransaction];
    console.log("💾 Saving transaction, total:", updated.length);
    setTransactions(updated);
    await saveToStorage(updated);
    console.log("✅ Transaction saved successfully");
  };

  const updateTransaction = async (
    id: string,
    updates: Partial<Transaction>
  ) => {
    if (!user || !isDataLoaded) {
      console.warn("⚠️ Cannot update transaction: user not ready or data not loaded");
      return;
    }

    console.log(`🔄 Updating transaction ${id}, current count: ${transactions.length}`);
    const updated = transactions.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    );
    setTransactions(updated);
    await saveToStorage(updated);
    console.log(`✅ Transaction updated and saved, count: ${updated.length}`);
  };

  const deleteTransaction = async (id: string) => {
    if (!user || !isDataLoaded) {
      console.warn("⚠️ Cannot delete transaction: user not ready or data not loaded");
      return;
    }

    console.log(`🗑️ Deleting transaction ${id}, current count: ${transactions.length}`);
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    await saveToStorage(updated);
    console.log(`✅ Transaction deleted and saved, count: ${updated.length}`);
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
    if (!user || !isDataLoaded) {
      console.warn("⚠️ Cannot add expense: user not ready or data not loaded");
      return;
    }

    console.log(`💸 Adding expense, current count: ${expenses.length}`);
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };

    const updated = [...expenses, newExpense];
    setExpenses(updated);
    await saveExpensesToStorage(updated);
    console.log(`✅ Expense added and saved, count: ${updated.length}`);
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    if (!user || !isDataLoaded) {
      console.warn("⚠️ Cannot update expense: user not ready or data not loaded");
      return;
    }

    console.log(`🔄 Updating expense ${id}, current count: ${expenses.length}`);
    const updated = expenses.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    );
    setExpenses(updated);
    await saveExpensesToStorage(updated);
    console.log(`✅ Expense updated and saved, count: ${updated.length}`);
  };

  const deleteExpense = async (id: string) => {
    if (!user || !isDataLoaded) {
      console.warn("⚠️ Cannot delete expense: user not ready or data not loaded");
      return;
    }

    console.log(`🗑️ Deleting expense ${id}, current count: ${expenses.length}`);
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    await saveExpensesToStorage(updated);
    console.log(`✅ Expense deleted and saved, count: ${updated.length}`);
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
    if (!user || !isDataLoaded) {
      console.warn("⚠️ Cannot add interest transaction: user not ready or data not loaded");
      return;
    }

    console.log(`💰 Adding interest transaction, current count: ${interestTransactions.length}`);
    const newTransaction: InterestTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };

    const updated = [...interestTransactions, newTransaction];
    setInterestTransactions(updated);
    await saveInterestToStorage(updated);
    console.log(`✅ Interest transaction added and saved, count: ${updated.length}`);
  };

  const updateInterestTransaction = async (
    id: string,
    updates: Partial<Omit<InterestTransaction, "id">>
  ) => {
    if (!user || !isDataLoaded) {
      console.warn("⚠️ Cannot update interest transaction: user not ready or data not loaded");
      return;
    }

    console.log(`🔄 Updating interest transaction ${id}, current count: ${interestTransactions.length}`);
    const updated = interestTransactions.map((t) => {
      if (t.id === id) {
        const result = { ...t, ...updates };
        if (updates.principal !== undefined || updates.interest !== undefined) {
          result.totalAmount =
            (updates.principal ?? t.principal) +
            (updates.interest ?? t.interest);
        }
        return result;
      }
      return t;
    });

    setInterestTransactions(updated);
    await saveInterestToStorage(updated);
    console.log(`✅ Interest transaction updated and saved, count: ${updated.length}`);
  };

  const deleteInterestTransaction = async (id: string) => {
    if (!user || !isDataLoaded) {
      console.warn("⚠️ Cannot delete interest transaction: user not ready or data not loaded");
      return;
    }

    console.log(`🗑️ Deleting interest transaction ${id}, current count: ${interestTransactions.length}`);
    const updated = interestTransactions.filter((t) => t.id !== id);
    setInterestTransactions(updated);
    await saveInterestToStorage(updated);
    console.log(`✅ Interest transaction deleted and saved, count: ${updated.length}`);
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
    if (!user || !isDataLoaded) {
      console.warn("⚠️ Cannot add personal earning: user not ready or data not loaded");
      return;
    }

    console.log(`💵 Adding personal earning, current count: ${personalEarnings.length}`);
    const newEarning: PersonalEarning = {
      ...earning,
      id: Date.now().toString(),
    };

    const updated = [...personalEarnings, newEarning];
    setPersonalEarnings(updated);
    await saveEarningsToStorage(updated);
    console.log(`✅ Personal earning added and saved, count: ${updated.length}`);
  };

  const updatePersonalEarning = async (
    id: string,
    updates: Partial<Omit<PersonalEarning, "id">>
  ) => {
    if (!user || !isDataLoaded) {
      console.warn("⚠️ Cannot update personal earning: user not ready or data not loaded");
      return;
    }

    console.log(`🔄 Updating personal earning ${id}, current count: ${personalEarnings.length}`);
    const updated = personalEarnings.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    );
    setPersonalEarnings(updated);
    await saveEarningsToStorage(updated);
    console.log(`✅ Personal earning updated and saved, count: ${updated.length}`);
  };

  const deletePersonalEarning = async (id: string) => {
    if (!user || !isDataLoaded) {
      console.warn("⚠️ Cannot delete personal earning: user not ready or data not loaded");
      return;
    }

    console.log(`🗑️ Deleting personal earning ${id}, current count: ${personalEarnings.length}`);
    const updated = personalEarnings.filter((e) => e.id !== id);
    setPersonalEarnings(updated);
    await saveEarningsToStorage(updated);
    console.log(`✅ Personal earning deleted and saved, count: ${updated.length}`);
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
    if (!user || !isDataLoaded) {
      console.warn("⚠️ Cannot add other balance: user not ready or data not loaded");
      return;
    }

    console.log(`🏦 Adding other balance, current count: ${otherBalances.length}`);
    // Create an initial transaction for the opening balance
    const initialTransaction: OtherTransaction = {
      id: Date.now().toString(),
      type: "credit",
      note: "Opening Balance",
      amount: balance.amount,
      date: new Date(),
    };

    const newBalance: OtherBalance = {
      ...balance,
      id: (Date.now() + 1).toString(),
      updatedAt: new Date(),
      transactions: [initialTransaction],
    };
    const updated = [...otherBalances, newBalance];
    setOtherBalances(updated);
    await saveOtherBalancesToStorage(updated);
    console.log(`✅ Other balance added and saved, count: ${updated.length}`);
  };

  const updateOtherBalance = async (
    id: string,
    updates: Omit<OtherBalance, "id" | "updatedAt" | "transactions">
  ) => {
    if (!user || !isDataLoaded) {
      console.warn("⚠️ Cannot update other balance: user not ready or data not loaded");
      return;
    }

    console.log(`🔄 Updating other balance ${id}, current count: ${otherBalances.length}`);
    const updated = otherBalances.map((b) =>
      b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b
    );
    setOtherBalances(updated);
    await saveOtherBalancesToStorage(updated);
    console.log(`✅ Other balance updated and saved, count: ${updated.length}`);
  };

  const deleteOtherBalance = async (id: string) => {
    if (!user || !isDataLoaded) {
      console.warn("⚠️ Cannot delete other balance: user not ready or data not loaded");
      return;
    }

    console.log(`🗑️ Deleting other balance ${id}, current count: ${otherBalances.length}`);
    const updated = otherBalances.filter((b) => b.id !== id);
    setOtherBalances(updated);
    await saveOtherBalancesToStorage(updated);
    console.log(`✅ Other balance deleted and saved, count: ${updated.length}`);
  };

  // Other Transaction Functions
  const addOtherTransaction = async (
    balanceId: string,
    transaction: Omit<OtherTransaction, "id">
  ) => {
    if (!user || !isDataLoaded) {
      console.warn("⚠️ Cannot add other transaction: user not ready or data not loaded");
      return;
    }

    console.log(`💳 Adding other transaction to balance ${balanceId}`);
    const newTransaction: OtherTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };

    const updated = otherBalances.map((balance) => {
      if (balance.id === balanceId) {
        const updatedTransactions = [...balance.transactions, newTransaction];
        // Recalculate balance amount based on transactions
        const newAmount = updatedTransactions.reduce((sum, t) => {
          return t.type === "credit" ? sum + t.amount : sum - t.amount;
        }, 0);

        return {
          ...balance,
          transactions: updatedTransactions,
          amount: newAmount,
          updatedAt: new Date(),
        };
      }
      return balance;
    });

    setOtherBalances(updated);
    await saveOtherBalancesToStorage(updated);
    console.log(`✅ Other transaction added and saved to balance ${balanceId}`);
  };

  const updateOtherTransaction = async (
    balanceId: string,
    transactionId: string,
    updates: Partial<OtherTransaction>
  ) => {
    if (!user || !isDataLoaded) {
      console.warn("\u26a0\ufe0f Cannot update other transaction: user not ready or data not loaded");
      return;
    }

    console.log(`\ud83d\udd04 Updating other transaction ${transactionId} in balance ${balanceId}`);
    const updated = otherBalances.map((balance) => {
      if (balance.id === balanceId) {
        const updatedTransactions = balance.transactions.map((t) =>
          t.id === transactionId ? { ...t, ...updates } : t
        );
        // Recalculate balance amount
        const newAmount = updatedTransactions.reduce((sum, t) => {
          return t.type === "credit" ? sum + t.amount : sum - t.amount;
        }, 0);

        return {
          ...balance,
          transactions: updatedTransactions,
          amount: newAmount,
          updatedAt: new Date(),
        };
      }
      return balance;
    });

    setOtherBalances(updated);
    await saveOtherBalancesToStorage(updated);
    console.log(`\u2705 Other transaction updated and saved in balance ${balanceId}`);
  };

  const deleteOtherTransaction = async (
    balanceId: string,
    transactionId: string
  ) => {
    if (!user || !isDataLoaded) {
      console.warn("\u26a0\ufe0f Cannot delete other transaction: user not ready or data not loaded");
      return;
    }

    console.log(`\ud83d\uddd1\ufe0f Deleting other transaction ${transactionId} from balance ${balanceId}`);
    const updated = otherBalances.map((balance) => {
      if (balance.id === balanceId) {
        const updatedTransactions = balance.transactions.filter(
          (t) => t.id !== transactionId
        );
        // Recalculate balance amount
        const newAmount = updatedTransactions.reduce((sum, t) => {
          return t.type === "credit" ? sum + t.amount : sum - t.amount;
        }, 0);

        return {
          ...balance,
          transactions: updatedTransactions,
          amount: newAmount,
          updatedAt: new Date(),
        };
      }
      return balance;
    });

    setOtherBalances(updated);
    await saveOtherBalancesToStorage(updated);
    console.log(`\u2705 Other transaction deleted and saved from balance ${balanceId}`);
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
