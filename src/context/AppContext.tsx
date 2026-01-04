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
  transactionsAPI,
  expensesAPI,
  interestAPI,
  earningsAPI,
} from "../services/api";

const getUserStorageKey = (baseKey: string, userEmail?: string | null) => {
  if (!userEmail) return baseKey;
  // Create a user-specific storage key
  return `${baseKey}_${userEmail.replace(/[^a-zA-Z0-9]/g, "_")}`;
};

const loadFromStorage = (userEmail?: string | null): Transaction[] => {
  try {
    const storageKey = getUserStorageKey("fintrack_transactions", userEmail);
    const data = localStorage.getItem(storageKey);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.map((t: Transaction) => ({
        ...t,
        date: new Date(t.date),
      }));
    }
  } catch (error) {
    console.error("Error loading from storage:", error);
  }
  return [];
};

const saveToStorage = (
  transactions: Transaction[],
  userEmail?: string | null
) => {
  try {
    const storageKey = getUserStorageKey("fintrack_transactions", userEmail);
    localStorage.setItem(storageKey, JSON.stringify(transactions));
  } catch (error) {
    console.error("Error saving to storage:", error);
  }
};

const loadExpensesFromStorage = (userEmail?: string | null): Expense[] => {
  try {
    const storageKey = getUserStorageKey("fintrack_expenses", userEmail);
    const data = localStorage.getItem(storageKey);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.map((e: Expense) => ({
        ...e,
        date: new Date(e.date),
      }));
    }
  } catch (error) {
    console.error("Error loading expenses from storage:", error);
  }
  return [];
};

const saveExpensesToStorage = (
  expenses: Expense[],
  userEmail?: string | null
) => {
  try {
    const storageKey = getUserStorageKey("fintrack_expenses", userEmail);
    localStorage.setItem(storageKey, JSON.stringify(expenses));
  } catch (error) {
    console.error("Error saving expenses to storage:", error);
  }
};

const loadInterestFromStorage = (
  userEmail?: string | null
): InterestTransaction[] => {
  try {
    const storageKey = getUserStorageKey("fintrack_interest", userEmail);
    const data = localStorage.getItem(storageKey);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.map((i: InterestTransaction) => ({
        ...i,
        date: new Date(i.date),
      }));
    }
  } catch (error) {
    console.error("Error loading interest from storage:", error);
  }
  return [];
};

const saveInterestToStorage = (
  interestTransactions: InterestTransaction[],
  userEmail?: string | null
) => {
  try {
    const storageKey = getUserStorageKey("fintrack_interest", userEmail);
    localStorage.setItem(storageKey, JSON.stringify(interestTransactions));
  } catch (error) {
    console.error("Error saving interest to storage:", error);
  }
};

const loadEarningsFromStorage = (
  userEmail?: string | null
): PersonalEarning[] => {
  try {
    const storageKey = getUserStorageKey("fintrack_earnings", userEmail);
    const data = localStorage.getItem(storageKey);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.map((e: PersonalEarning) => ({
        ...e,
        date: new Date(e.date),
      }));
    }
  } catch (error) {
    console.error("Error loading earnings from storage:", error);
  }
  return [];
};

const saveEarningsToStorage = (
  earnings: PersonalEarning[],
  userEmail?: string | null
) => {
  try {
    const storageKey = getUserStorageKey("fintrack_earnings", userEmail);
    localStorage.setItem(storageKey, JSON.stringify(earnings));
  } catch (error) {
    console.error("Error saving earnings to storage:", error);
  }
};

const loadOtherBalancesFromStorage = (
  userEmail?: string | null
): OtherBalance[] => {
  try {
    const storageKey = getUserStorageKey("fintrack_other_balances", userEmail);
    const data = localStorage.getItem(storageKey);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.map((b: OtherBalance) => ({
        ...b,
        updatedAt: new Date(b.updatedAt),
        transactions: (b.transactions || []).map((t: OtherTransaction) => ({
          ...t,
          date: new Date(t.date),
        })),
      }));
    }
  } catch (error) {
    console.error("Error loading other balances from storage:", error);
  }
  return [];
};

const saveOtherBalancesToStorage = (
  balances: OtherBalance[],
  userEmail?: string | null
) => {
  try {
    const storageKey = getUserStorageKey("fintrack_other_balances", userEmail);
    localStorage.setItem(storageKey, JSON.stringify(balances));
  } catch (error) {
    console.error("Error saving other balances to storage:", error);
  }
};

// Migration function to move old data to user-specific keys
const migrateOldDataToUserSpecific = (userEmail: string) => {
  const migrationKey = `fintrack_migrated_${userEmail.replace(
    /[^a-zA-Z0-9]/g,
    "_"
  )}`;

  // Check if migration already done for this user
  if (localStorage.getItem(migrationKey)) {
    return;
  }

  try {
    // Migrate transactions
    const oldTransactions = localStorage.getItem("fintrack_transactions");
    if (oldTransactions) {
      const newKey = getUserStorageKey("fintrack_transactions", userEmail);
      if (!localStorage.getItem(newKey)) {
        localStorage.setItem(newKey, oldTransactions);
      }
    }

    // Migrate expenses
    const oldExpenses = localStorage.getItem("fintrack_expenses");
    if (oldExpenses) {
      const newKey = getUserStorageKey("fintrack_expenses", userEmail);
      if (!localStorage.getItem(newKey)) {
        localStorage.setItem(newKey, oldExpenses);
      }
    }

    // Migrate interest
    const oldInterest = localStorage.getItem("fintrack_interest");
    if (oldInterest) {
      const newKey = getUserStorageKey("fintrack_interest", userEmail);
      if (!localStorage.getItem(newKey)) {
        localStorage.setItem(newKey, oldInterest);
      }
    }

    // Migrate earnings
    const oldEarnings = localStorage.getItem("fintrack_earnings");
    if (oldEarnings) {
      const newKey = getUserStorageKey("fintrack_earnings", userEmail);
      if (!localStorage.getItem(newKey)) {
        localStorage.setItem(newKey, oldEarnings);
      }
    }

    // Mark migration as complete
    localStorage.setItem(migrationKey, "true");
  } catch (error) {
    console.error("Error migrating old data:", error);
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const userEmail = user?.email;

  // Track if we've initialized data for the current user
  const initializedUserRef = useRef<string | null | undefined>(null);

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
    if (initializedUserRef.current !== userEmail) {
      const previousUser = initializedUserRef.current;
      initializedUserRef.current = userEmail;

      if (userEmail) {
        // Load data from MongoDB
        const loadData = async () => {
          try {
            const [
              loadedTransactions,
              loadedExpenses,
              loadedInterest,
              loadedEarnings,
            ] = await Promise.all([
              transactionsAPI.getAll(userEmail),
              expensesAPI.getAll(userEmail),
              interestAPI.getAll(userEmail),
              earningsAPI.getAll(userEmail),
            ]);

            React.startTransition(() => {
              setTransactions(loadedTransactions);
              setExpenses(loadedExpenses);
              setInterestTransactions(loadedInterest);
              setPersonalEarnings(loadedEarnings);
            });

            // Save to localStorage as backup
            saveToStorage(loadedTransactions, userEmail);
            saveExpensesToStorage(loadedExpenses, userEmail);
            saveInterestToStorage(loadedInterest, userEmail);
            saveEarningsToStorage(loadedEarnings, userEmail);
          } catch (error) {
            console.error(
              "Error loading data from MongoDB, trying localStorage:",
              error
            );
            // Fallback to localStorage if API fails
            migrateOldDataToUserSpecific(userEmail);
            const loadedTransactions = loadFromStorage(userEmail);
            const loadedExpenses = loadExpensesFromStorage(userEmail);
            const loadedInterest = loadInterestFromStorage(userEmail);
            const loadedEarnings = loadEarningsFromStorage(userEmail);
            const loadedOtherBalances = loadOtherBalancesFromStorage(userEmail);

            React.startTransition(() => {
              setTransactions(loadedTransactions);
              setExpenses(loadedExpenses);
              setInterestTransactions(loadedInterest);
              setPersonalEarnings(loadedEarnings);
              setOtherBalances(loadedOtherBalances);
            });
          }
        };

        loadData();
      } else if (previousUser) {
        // Only clear data if switching from a logged-in user to logged-out
        React.startTransition(() => {
          setTransactions([]);
          setExpenses([]);
          setInterestTransactions([]);
          setPersonalEarnings([]);
          setOtherBalances([]);
        });
      }
    }
  }, [userEmail]);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (!userEmail) return;

    try {
      const newTransaction = await transactionsAPI.create(
        userEmail,
        transaction
      );
      setTransactions((prev) => [...prev, newTransaction]);
      // Update localStorage backup
      saveToStorage([...transactions, newTransaction], userEmail);
    } catch (error) {
      console.error("Error adding transaction:", error);
      // Fallback to local storage only
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
        amountReturned: transaction.amountReturned || 0,
      };
      setTransactions((prev) => [...prev, newTransaction]);
      saveToStorage([...transactions, newTransaction], userEmail);
    }
  };

  const updateTransaction = async (
    id: string,
    updates: Partial<Transaction>
  ) => {
    if (!userEmail) return;

    try {
      await transactionsAPI.update(userEmail, id, updates);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
      const updatedTransactions = transactions.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      );
      saveToStorage(updatedTransactions, userEmail);
    } catch (error) {
      console.error("Error updating transaction:", error);
      // Still update locally
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!userEmail) return;

    try {
      await transactionsAPI.delete(userEmail, id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      const remainingTransactions = transactions.filter((t) => t.id !== id);
      saveToStorage(remainingTransactions, userEmail);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      // Still delete locally
      setTransactions((prev) => prev.filter((t) => t.id !== id));
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
    if (!userEmail) return;

    try {
      const newExpense = await expensesAPI.create(userEmail, expense);
      setExpenses((prev) => [...prev, newExpense]);
      saveExpensesToStorage([...expenses, newExpense], userEmail);
    } catch (error) {
      console.error("Error adding expense:", error);
      const newExpense: Expense = {
        ...expense,
        id: Date.now().toString(),
      };
      setExpenses((prev) => [...prev, newExpense]);
      saveExpensesToStorage([...expenses, newExpense], userEmail);
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    if (!userEmail) return;

    try {
      await expensesAPI.update(userEmail, id, updates);
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
      );
      const updatedExpenses = expenses.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      );
      saveExpensesToStorage(updatedExpenses, userEmail);
    } catch (error) {
      console.error("Error updating expense:", error);
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
      );
    }
  };

  const deleteExpense = async (id: string) => {
    if (!userEmail) return;

    try {
      await expensesAPI.delete(userEmail, id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      const remainingExpenses = expenses.filter((e) => e.id !== id);
      saveExpensesToStorage(remainingExpenses, userEmail);
    } catch (error) {
      console.error("Error deleting expense:", error);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
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
    if (!userEmail) return;

    try {
      const newTransaction = await interestAPI.create(userEmail, transaction);
      setInterestTransactions((prev) => [...prev, newTransaction]);
      saveInterestToStorage(
        [...interestTransactions, newTransaction],
        userEmail
      );
    } catch (error) {
      console.error("Error adding interest transaction:", error);
      const newTransaction: InterestTransaction = {
        ...transaction,
        id: Date.now().toString(),
      };
      setInterestTransactions((prev) => [...prev, newTransaction]);
      saveInterestToStorage(
        [...interestTransactions, newTransaction],
        userEmail
      );
    }
  };

  const updateInterestTransaction = async (
    id: string,
    updates: Partial<Omit<InterestTransaction, "id">>
  ) => {
    if (!userEmail) return;

    try {
      const currentTransaction = interestTransactions.find((t) => t.id === id);
      if (currentTransaction) {
        const updatedData = { ...currentTransaction, ...updates };
        if (updates.principal !== undefined || updates.interest !== undefined) {
          updatedData.totalAmount =
            (updates.principal ?? currentTransaction.principal) +
            (updates.interest ?? currentTransaction.interest);
        }
        await interestAPI.update(userEmail, id, updatedData);
      }

      setInterestTransactions((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            const updated = { ...t, ...updates };
            if (
              updates.principal !== undefined ||
              updates.interest !== undefined
            ) {
              updated.totalAmount =
                (updates.principal || t.principal) +
                (updates.interest || t.interest);
            }
            return updated;
          }
          return t;
        })
      );
    } catch (error) {
      console.error("Error updating interest transaction:", error);
      setInterestTransactions((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            const updated = { ...t, ...updates };
            if (
              updates.principal !== undefined ||
              updates.interest !== undefined
            ) {
              updated.totalAmount =
                (updates.principal || t.principal) +
                (updates.interest || t.interest);
            }
            return updated;
          }
          return t;
        })
      );
    }
  };

  const deleteInterestTransaction = async (id: string) => {
    if (!userEmail) return;

    try {
      await interestAPI.delete(userEmail, id);
      setInterestTransactions((prev) => prev.filter((t) => t.id !== id));
      const remainingInterest = interestTransactions.filter((t) => t.id !== id);
      saveInterestToStorage(remainingInterest, userEmail);
    } catch (error) {
      console.error("Error deleting interest transaction:", error);
      setInterestTransactions((prev) => prev.filter((t) => t.id !== id));
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
    if (!userEmail) return;

    try {
      const newEarning = await earningsAPI.create(userEmail, earning);
      setPersonalEarnings((prev) => [...prev, newEarning]);
      saveEarningsToStorage([...personalEarnings, newEarning], userEmail);
    } catch (error) {
      console.error("Error adding earning:", error);
      const newEarning: PersonalEarning = {
        ...earning,
        id: Date.now().toString(),
      };
      setPersonalEarnings((prev) => [...prev, newEarning]);
      saveEarningsToStorage([...personalEarnings, newEarning], userEmail);
    }
  };

  const updatePersonalEarning = async (
    id: string,
    updates: Partial<Omit<PersonalEarning, "id">>
  ) => {
    if (!userEmail) return;

    try {
      await earningsAPI.update(userEmail, id, updates);
      setPersonalEarnings((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
      );
      const updatedEarnings = personalEarnings.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      );
      saveEarningsToStorage(updatedEarnings, userEmail);
    } catch (error) {
      console.error("Error updating earning:", error);
      setPersonalEarnings((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
      );
    }
  };

  const deletePersonalEarning = async (id: string) => {
    if (!userEmail) return;

    try {
      await earningsAPI.delete(userEmail, id);
      setPersonalEarnings((prev) => prev.filter((e) => e.id !== id));
      const remainingEarnings = personalEarnings.filter((e) => e.id !== id);
      saveEarningsToStorage(remainingEarnings, userEmail);
    } catch (error) {
      console.error("Error deleting earning:", error);
      setPersonalEarnings((prev) => prev.filter((e) => e.id !== id));
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
  const addOtherBalance = (
    balance: Omit<OtherBalance, "id" | "updatedAt" | "transactions">
  ) => {
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
    saveOtherBalancesToStorage(updated, userEmail);
  };

  const updateOtherBalance = (
    id: string,
    updates: Omit<OtherBalance, "id" | "updatedAt" | "transactions">
  ) => {
    const updated = otherBalances.map((b) =>
      b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b
    );
    setOtherBalances(updated);
    saveOtherBalancesToStorage(updated, userEmail);
  };

  const deleteOtherBalance = (id: string) => {
    const updated = otherBalances.filter((b) => b.id !== id);
    setOtherBalances(updated);
    saveOtherBalancesToStorage(updated, userEmail);
  };

  // Other Transaction Functions
  const addOtherTransaction = (
    balanceId: string,
    transaction: Omit<OtherTransaction, "id">
  ) => {
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
    saveOtherBalancesToStorage(updated, userEmail);
  };

  const updateOtherTransaction = (
    balanceId: string,
    transactionId: string,
    updates: Partial<OtherTransaction>
  ) => {
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
    saveOtherBalancesToStorage(updated, userEmail);
  };

  const deleteOtherTransaction = (balanceId: string, transactionId: string) => {
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
    saveOtherBalancesToStorage(updated, userEmail);
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
