import { create } from "zustand";

export const useConversation = create((set) => ({
    currentConversationId: "",
    setCurrentConversationId: (newId) => set({ currentConversationId: newId }),
    resetCurrentConversationId: () => set({ currentConversationId: "" })
}))