import { create } from "zustand";

export const useUi = create((set) => ({
  divice: "desktop",//mobile
  setDiviceType: (diviceType) => set({ divice: diviceType })
}));
