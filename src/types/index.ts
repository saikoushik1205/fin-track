export interface Transaction {
  id: string;
  personName: string;
  amount: number;
  date: Date;
  note?: string;
  status: "pending" | "partial" | "paid";
  type: "lending" | "borrowing";
  amountReturned?: number;
  parentId?: string;
  children?: Transaction[];
}

export interface InterestTransaction {
  id: string;
  personName: string;
  principal: number;
  interest: number;
  totalAmount: number;
  date: Date;
  remarks?: string;
}

export interface Person {
  name: string;
  totalAmount: number;
  amountReturned: number;
  remainingBalance: number;
  transactions: Transaction[];
  type: "borrower" | "lender";
}

export interface DashboardStats {
  totalLent: number;
  totalBorrowed: number;
  netBalance: number;
  activePeopleCount: number;
}

export interface InterestStats {
  totalPrincipal: number;
  totalInterestEarned: number;
  totalTransactions: number;
}

export interface ChartDataPoint {
  date: string;
  lending: number;
  borrowing: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
  note?: string;
  paymentMethod?: string;
  parentId?: string;
  children?: Expense[];
}

export interface ExpenseStats {
  totalExpenses: number;
  categoryBreakdown: { category: string; amount: number }[];
  monthlyTotal: number;
}

export interface PersonalEarning {
  id: string;
  sourceName: string;
  earningName: string;
  amount: number;
  date: Date;
  remarks?: string;
}

export interface PersonalEarningsStats {
  totalEarned: number;
  totalSources: number;
  monthlyTotal: number;
}

export interface OtherTransaction {
  id: string;
  type: "credit" | "debit";
  note: string;
  amount: number;
  date: Date;
}

export interface OtherBalance {
  id: string;
  type: "cash" | "bank";
  label: string;
  amount: number;
  updatedAt: Date;
  transactions: OtherTransaction[];
}
