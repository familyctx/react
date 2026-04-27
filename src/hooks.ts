import {
  addProfile,
  canSwitchToProfile,
  clearSession,
  disableParentMode,
  enableParentMode,
  getActiveProfile,
  getChildProfiles,
  getParentProfile,
  isParentMode,
  removeProfile,
  setAccount,
  setProfiles,
  startSession,
  switchProfile,
  type Account,
  type AccountId,
  type DeviceId,
  type FamilyCtxState,
  type Profile,
  type ProfileId,
} from "@familyctx/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFamilyCtxStore } from "./context";

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

// Selector hooks
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

export function useCanSwitchToProfile(profileId: ProfileId): boolean {
  const state = useFamilyCtxState();
  return useMemo(
    () => canSwitchToProfile(state, profileId),
    [state, profileId],
  );
}

// Action hooks
export function useSwitchProfile() {
  const store = useFamilyCtxStore();
  return useCallback(
    (profileId: ProfileId) => {
      const currentState = store.getState();
      const nextState = switchProfile(currentState, profileId);
      store.setState(nextState);
    },
    [store],
  );
}

export function useEnableParentMode() {
  const store = useFamilyCtxStore();
  return useCallback(() => {
    const currentState = store.getState();
    const nextState = enableParentMode(currentState);
    store.setState(nextState);
  }, [store]);
}

export function useDisableParentMode() {
  const store = useFamilyCtxStore();
  return useCallback(() => {
    const currentState = store.getState();
    const nextState = disableParentMode(currentState);
    store.setState(nextState);
  }, [store]);
}

export function useClearSession() {
  const store = useFamilyCtxStore();
  return useCallback(() => {
    const currentState = store.getState();
    const nextState = clearSession(currentState);
    store.setState(nextState);
  }, [store]);
}

export function useSetAccount() {
  const store = useFamilyCtxStore();
  return useCallback(
    (account: Account) => {
      const currentState = store.getState();
      const nextState = setAccount(currentState, account);
      store.setState(nextState);
    },
    [store],
  );
}

export function useSetProfiles() {
  const store = useFamilyCtxStore();
  return useCallback(
    (profiles: Profile[]) => {
      const currentState = store.getState();
      const nextState = setProfiles(currentState, profiles);
      store.setState(nextState);
    },
    [store],
  );
}

export function useAddProfile() {
  const store = useFamilyCtxStore();
  return useCallback(
    (profile: Profile) => {
      const currentState = store.getState();
      const nextState = addProfile(currentState, profile);
      store.setState(nextState);
    },
    [store],
  );
}

export function useRemoveProfile() {
  const store = useFamilyCtxStore();
  return useCallback(
    (profileId: ProfileId) => {
      const currentState = store.getState();
      const nextState = removeProfile(currentState, profileId);
      store.setState(nextState);
    },
    [store],
  );
}

export function useStartSession() {
  const store = useFamilyCtxStore();
  return useCallback(
    (accountId: AccountId, deviceId?: DeviceId) => {
      const currentState = store.getState();
      const nextState = startSession(currentState, accountId, deviceId);
      store.setState(nextState);
    },
    [store],
  );
}

// Convenience hooks
export function useAccount(): Account | null {
  const state = useFamilyCtxState();
  return state.account;
}

export function useProfiles(): Profile[] {
  const state = useFamilyCtxState();
  return state.profiles;
}

export function useSession(): FamilyCtxState["session"] {
  const state = useFamilyCtxState();
  return state.session;
}

export function useToggleParentMode() {
  const store = useFamilyCtxStore();
  return useCallback(() => {
    const currentState = store.getState();
    const isCurrentlyParentMode = isParentMode(currentState);
    const nextState = isCurrentlyParentMode
      ? disableParentMode(currentState)
      : enableParentMode(currentState);
    store.setState(nextState);
  }, [store]);
}
