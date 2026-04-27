import {
  getActiveProfile,
  getChildProfiles,
  getParentProfile,
  isParentMode,
  type FamilyCtxState,
  type Profile,
} from "@familyctx/core";
import { useFamilyCtxStore } from "./context";
import { useEffect, useMemo, useState } from "react";

// Base hook for subscription to state
export function useFamilyCtxState(): FamilyCtxState {
  const store = useFamilyCtxStore();
  const [state, setState] = useState<FamilyCtxState>(store.getState());

  useEffect(() => {
    const unsub = store.subscribe((newState) => {
      setState(newState);
    });
    return unsub;
  }, [store]);

  return state;
}

// Selector
export function useActiveProfile(): Profile | null {
  const state = useFamilyCtxState();
  return useMemo(() => getActiveProfile(state), [state]);
}

export function useParentProfile(): Profile | null {
  const state = useFamilyCtxState();
  return useMemo(() => getParentProfile(state), [state]);
}

export function useChildProfiles(): Profile[] {
  const state = useFamilyCtxState();
  return useMemo(() => getChildProfiles(state), [state]);
}

export function useIsParentMode(): boolean {
  const state = useFamilyCtxState();
  return useMemo(() => isParentMode(state), [state]);
}

// Action
