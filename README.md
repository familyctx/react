# @familyctx/react

React bindings for FamilyContext.

## Installation

```bash
npm install @familyctx/react @familyctx/core
```

## Usage

```tsx
import { createStore } from "@familyctx/core";
import { FamilyCtxProvider, useActions, useActiveProfile } from "@familyctx/react";

const store = createStore();

function App() {
  return (
    <FamilyCtxProvider store={store}>
      <YourApp />
    </FamilyCtxProvider>
  );
}

function YourApp() {
  const { profile, session, account } = useActions();
  const activeProfile = useActiveProfile();

  return (
    <div>
      <p>Active: {activeProfile?.name ?? "None"}</p>
      <button onClick={() => profile.switch("profile-id")}>Switch</button>
    </div>
  );
}
```

## API

### Actions (Writes)

```tsx
const { profile, session, account } = useActions();

profile.switch(id);
profile.add(profile);
profile.remove(id);
profile.setAll(profiles);

session.start(accountId, deviceId);
session.clear();
session.enableParentMode();
session.disableParentMode();
session.toggleParentMode();

account.set(account);
```

### Selectors (Reads)

```tsx
useActiveProfile()
useParentProfile()
useChildProfiles()
useIsParentMode()
useCanSwitchToProfile(id)
useAccount()
useProfiles()
useSession()
useSelector(selector, equalityFn?)
useFamilyCtxState()
```

## License

MIT
