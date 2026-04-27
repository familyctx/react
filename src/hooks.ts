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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

// Selector hooks - all reads
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

// Actions hook - all writes
export function useActions() {
  const store = useFamilyCtxStore();

  return useMemo(
    () => ({
      profile: {
        switch: (profileId: ProfileId) =>
          store.setState(switchProfile(store.getState(), profileId)),
        add: (profile: Profile) =>
          store.setState(addProfile(store.getState(), profile)),
        remove: (profileId: ProfileId) =>
          store.setState(removeProfile(store.getState(), profileId)),
        setAll: (profiles: Profile[]) =>
          store.setState(setProfiles(store.getState(), profiles)),
      },
      session: {
        start: (accountId: AccountId, deviceId?: DeviceId) =>
          store.setState(startSession(store.getState(), accountId, deviceId)),
        clear: () => store.setState(clearSession(store.getState())),
        enableParentMode: () =>
          store.setState(enableParentMode(store.getState())),
        disableParentMode: () =>
          store.setState(disableParentMode(store.getState())),
        toggleParentMode: () => {
          const state = store.getState();
          store.setState(
            isParentMode(state)
              ? disableParentMode(state)
              : enableParentMode(state),
          );
        },
      },
      account: {
        set: (account: Account) =>
          store.setState(setAccount(store.getState(), account)),
      },
    }),
    [store],
  );
}
