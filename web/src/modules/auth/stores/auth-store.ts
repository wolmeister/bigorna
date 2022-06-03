import create from 'zustand';
import { persist } from 'zustand/middleware';

import { User } from '../../../api/user';

type AuthStore = {
  user: User | null;
};

const authStore = create(
  persist<AuthStore>(
    () => ({
      user: null,
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

export function setUser(user: User | null) {
  authStore.setState(state => ({
    ...state,
    user,
  }));
}
