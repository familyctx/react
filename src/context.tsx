import type { Store } from "@familyctx/core";
import { createContext, useContext, type ReactNode } from "react";

type FamilyCtxContextValue = {
  store: Store;
} | null;

const FamilyCtxContext = createContext<FamilyCtxContextValue>(null);

export type FamilyCtxProviderProps = {
  store: Store;
  children: ReactNode;
};

export function FamilyCtxProvider({ store, children }: FamilyCtxProviderProps) {
  return (
    <FamilyCtxContext.Provider value={{ store }}>
      {children}
    </FamilyCtxContext.Provider>
  );
}

export function useFamilyCtxStore(): Store {
  const context = useContext(FamilyCtxContext);
  if (!context) {
    throw new Error(
      `useFamilyCtxStore must be used within a FamilyCtxProvider`,
    );
  }
  return context.store;
}
