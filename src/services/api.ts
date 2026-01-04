import axios from "axios";
import type {
  Transaction,
  Expense,
  InterestTransaction,
  PersonalEarning,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Convert MongoDB _id to id for frontend compatibility
const convertMongoToFrontend = <T extends { _id?: string; id?: string }>(
  item: T
): T => {
  if (item._id) {
    const { _id, ...rest } = item;
    return { ...rest, id: _id } as T;
  }
  return item;
};

// Transactions API
export const transactionsAPI = {
  getAll: async (userEmail: string): Promise<Transaction[]> => {
    const response = await axios.get(`${API_URL}/transactions/${userEmail}`);
    return response.data.map((t: Transaction & { _id?: string }) => ({
      ...convertMongoToFrontend(t),
      date: new Date(t.date),
    }));
  },

  create: async (
    userEmail: string,
    transaction: Omit<Transaction, "id">
  ): Promise<Transaction> => {
    const response = await axios.post(
      `${API_URL}/transactions/${userEmail}`,
      transaction
    );
    return {
      ...convertMongoToFrontend(response.data),
      date: new Date(response.data.date),
    };
  },

  update: async (
    userEmail: string,
    id: string,
    transaction: Partial<Transaction>
  ): Promise<Transaction> => {
    const response = await axios.put(
      `${API_URL}/transactions/${userEmail}/${id}`,
      transaction
    );
    return {
      ...convertMongoToFrontend(response.data),
      date: new Date(response.data.date),
    };
  },

  delete: async (userEmail: string, id: string): Promise<void> => {
    await axios.delete(`${API_URL}/transactions/${userEmail}/${id}`);
  },
};

// Expenses API
export const expensesAPI = {
  getAll: async (userEmail: string): Promise<Expense[]> => {
    const response = await axios.get(`${API_URL}/expenses/${userEmail}`);
    return response.data.map((e: Expense & { _id?: string }) => ({
      ...convertMongoToFrontend(e),
      date: new Date(e.date),
    }));
  },

  create: async (
    userEmail: string,
    expense: Omit<Expense, "id">
  ): Promise<Expense> => {
    const response = await axios.post(
      `${API_URL}/expenses/${userEmail}`,
      expense
    );
    return {
      ...convertMongoToFrontend(response.data),
      date: new Date(response.data.date),
    };
  },

  update: async (
    userEmail: string,
    id: string,
    expense: Partial<Expense>
  ): Promise<Expense> => {
    const response = await axios.put(
      `${API_URL}/expenses/${userEmail}/${id}`,
      expense
    );
    return {
      ...convertMongoToFrontend(response.data),
      date: new Date(response.data.date),
    };
  },

  delete: async (userEmail: string, id: string): Promise<void> => {
    await axios.delete(`${API_URL}/expenses/${userEmail}/${id}`);
  },
};

// Interest API
export const interestAPI = {
  getAll: async (userEmail: string): Promise<InterestTransaction[]> => {
    const response = await axios.get(`${API_URL}/interest/${userEmail}`);
    return response.data.map((i: InterestTransaction & { _id?: string }) => ({
      ...convertMongoToFrontend(i),
      date: new Date(i.date),
    }));
  },

  create: async (
    userEmail: string,
    interest: Omit<InterestTransaction, "id">
  ): Promise<InterestTransaction> => {
    const response = await axios.post(
      `${API_URL}/interest/${userEmail}`,
      interest
    );
    return {
      ...convertMongoToFrontend(response.data),
      date: new Date(response.data.date),
    };
  },

  update: async (
    userEmail: string,
    id: string,
    interest: Partial<InterestTransaction>
  ): Promise<InterestTransaction> => {
    const response = await axios.put(
      `${API_URL}/interest/${userEmail}/${id}`,
      interest
    );
    return {
      ...convertMongoToFrontend(response.data),
      date: new Date(response.data.date),
    };
  },

  delete: async (userEmail: string, id: string): Promise<void> => {
    await axios.delete(`${API_URL}/interest/${userEmail}/${id}`);
  },
};

// Earnings API
export const earningsAPI = {
  getAll: async (userEmail: string): Promise<PersonalEarning[]> => {
    const response = await axios.get(`${API_URL}/earnings/${userEmail}`);
    return response.data.map((e: PersonalEarning & { _id?: string }) => ({
      ...convertMongoToFrontend(e),
      date: new Date(e.date),
    }));
  },

  create: async (
    userEmail: string,
    earning: Omit<PersonalEarning, "id">
  ): Promise<PersonalEarning> => {
    const response = await axios.post(
      `${API_URL}/earnings/${userEmail}`,
      earning
    );
    return {
      ...convertMongoToFrontend(response.data),
      date: new Date(response.data.date),
    };
  },

  update: async (
    userEmail: string,
    id: string,
    earning: Partial<PersonalEarning>
  ): Promise<PersonalEarning> => {
    const response = await axios.put(
      `${API_URL}/earnings/${userEmail}/${id}`,
      earning
    );
    return {
      ...convertMongoToFrontend(response.data),
      date: new Date(response.data.date),
    };
  },

  delete: async (userEmail: string, id: string): Promise<void> => {
    await axios.delete(`${API_URL}/earnings/${userEmail}/${id}`);
  },
};

// Health check
export const healthCheck = async (): Promise<{
  status: string;
  database: string;
}> => {
  const response = await axios.get(`${API_URL}/health`);
  return response.data;
};
