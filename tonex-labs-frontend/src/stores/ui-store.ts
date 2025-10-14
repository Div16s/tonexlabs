import { create } from "zustand";

type TabType = "settings" | "history"

interface UIState {
    isMobileDrawerOpen: boolean;
    isMobileMenuOpen: boolean;
    isMobileScreen: boolean;
    activeTab: TabType;
    toggleMobileDrawer: () => void;
    toggleMobileMenu: () => void;
    setMobileScreen: (isMobile: boolean) => void;
    setActiveTab: (tab: TabType) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isMobileDrawerOpen: false,
    isMobileScreen: false,
    isMobileMenuOpen: false,
    activeTab: "settings",
    toggleMobileDrawer: () => set((state) => ({ isMobileDrawerOpen: !state.isMobileDrawerOpen })),
    toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
    setMobileScreen: (isMobile: boolean) => set(() => ({ isMobileScreen: isMobile })),
    setActiveTab: (tab) => set(() => ({ activeTab: tab })),
}))