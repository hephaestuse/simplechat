import { create } from "zustand";

export const useProfile = create((set) => ({
  id: "",
  username: "",
  avatar_url: "",
  email: "",
  setProfile: (profile) => set(() => ({ ...profile })),
  resetProfile: () =>
    set({ id: "", username: "", avatar_url: "", email: "" }),
}));
