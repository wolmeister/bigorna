import create from 'zustand';
import { persist } from 'zustand/middleware';

import { User } from '../../../api/user';

type AuthStore = {
  user: User | null;
  token: string | null;
};

const authStore = create(
  persist<AuthStore>(
    () => ({
      user: null,
      token: null,
    }),
    {
      name: 'auth-store',
      getStorage: () => localStorage,
    }
  )
);

const useAuthStore = authStore;

export function useUser(): User | null {
  return useAuthStore(state => state.user);
}

export function getUser(): User | null {
  return authStore.getState().user;
}

export function setUser(user: User | null): void {
  authStore.setState(state => ({
    ...state,
    user,
  }));
}

export function useToken(): string | null {
  return useAuthStore(state => state.token);
}

export function getToken(): string | null {
  return authStore.getState().token;
}

export function setToken(token: string | null): void {
  authStore.setState(state => ({
    ...state,
    token,
  }));
}
