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
import { useCallback, useEffect, useRef, useState } from "react";
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

// Selector hook with equality check to prevent unnecessary re-renders
export function useSelector<T>(
  selector: (state: FamilyCtxState) => T,
  equalityFn: (a: T, b: T) => boolean = Object.is,
): T {
  const store = useFamilyCtxStore();
  const [selected, setSelected] = useState<T>(() => selector(store.getState()));
  const selectorRef = useRef(selector);
  const equalityFnRef = useRef(equalityFn);

  // Keep refs up to date
  selectorRef.current = selector;
  equalityFnRef.current = equalityFn;

  useEffect(() => {
    const unsub = store.subscribe((newState) => {
      const newSelected = selectorRef.current(newState);
      setSelected((prev) => {
        if (equalityFnRef.current(prev, newSelected)) {
          return prev;
        }
        return newSelected;
      });
    });
    return unsub;
  }, [store]);

  return selected;
}

// Shallow equality helper for arrays
function shallowEqual<T>(a: T, b: T): boolean {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => Object.is(item, b[index]));
  }
  return false;
}

// Selector hooks using useSelector to prevent unnecessary re-renders
export function useActiveProfile(): Profile | null {
  return useSelector(getActiveProfile);
}

export function useParentProfile(): Profile | null {
  return useSelector(getParentProfile);
}

export function useChildProfiles(): Profile[] {
  return useSelector(getChildProfiles, shallowEqual);
}

export function useIsParentMode(): boolean {
  return useSelector(isParentMode);
}

export function useCanSwitchToProfile(profileId: ProfileId): boolean {
  return useSelector((state) => canSwitchToProfile(state, profileId));
}

export function useAccount(): Account | null {
  return useSelector((state) => state.account);
}

export function useProfiles(): Profile[] {
  return useSelector((state) => state.profiles, shallowEqual);
}

export function useSession(): FamilyCtxState["session"] {
  return useSelector((state) => state.session);
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
