import { create } from "zustand";

interface SidebarState {
  activePage: string;
  isOverlayVisible: boolean;

  reload: boolean;
  setReload: (value: boolean | ((prev: boolean) => boolean)) => void; // Allow function updates

  setActivePage: (page: string) => void;
  setIsOverlayVisible: (isOverlayVisible: boolean) => void;
}

const useSidebarStore = create<SidebarState>((set) => ({
  activePage: "Category",
  setActivePage: (page) => set({ activePage: page }),

  reload: false,
  setReload: (value) =>
    set((state) => ({
      reload: typeof value === "function" ? value(state.reload) : value,
    })),

  isOverlayVisible: false,
  setIsOverlayVisible: (isOverlayVisible) =>
    set({ isOverlayVisible: isOverlayVisible }),
}));

export default useSidebarStore;
