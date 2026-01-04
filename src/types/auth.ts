export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider?: "email" | "google";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
