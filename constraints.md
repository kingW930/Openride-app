PHASE 0 — CONTEXT GATHERING & STACK ANALYSIS

Before generating any code, you must analyze the file structure and `package.json` to identify the established tech stack.
Identify and strictly adhere to the following choices currently in use:
1.  **State Management:** (e.g., Redux Toolkit, Zustand, Context API, MobX).
2.  **Navigation:** (e.g., React Navigation v6/v7, Expo Router, React Native Navigation).
3.  **Styling Engine:** (e.g., NativeWind/Tailwind, Styled-Components, Restyle, or standard StyleSheet).
4.  **Network Client:** (e.g., Axios, TanStack Query, Apollo Client).
5.  **Runtime:** (Expo Managed or Bare/CLI).
6.  **Language:** (TypeScript or JavaScript) — Enforce types strictly if TS is detected.

---

SECTION 1 — GENERAL BEHAVIOR RULES

Always track progress and avoid getting stuck.
Think before coding: Produce a UI/Logic plan, verify it, then implement.

No hallucinations.
No usage of libraries not present in `package.json` unless explicitly asked to install.
If unsure about a UI pattern or library method, request clarification.

Stay within the boundaries of React Native (Mobile constraints).
Do not suggest web-only HTML elements (`<div>`, `<span>`) or CSS patterns not supported by the bridge.

SECTION 2 — ARCHITECTURE RULES

Enforce "Separation of Concerns" (View vs. Business Logic).
Use the **Container-Presenter pattern** or **Custom Hooks** pattern:
- UI Components should only handle rendering.
- Logic/Data fetching must live in Custom Hooks or Services.

Folder structure consistency:
- `/src/components`: Reusable UI elements (atoms/molecules).
- `/src/screens` or `/app`: Full page views.
- `/src/hooks`: Logic and side effects.
- `/src/services`: API calls and external integrations.
- `/src/context` or `/src/store`: Global state.

Limit file size to 250–300 lines.
If a component grows larger, break it down into smaller sub-components.

SECTION 3 — CODE QUALITY & REACT PRACTICES

Use **Functional Components** with Hooks only (No Class Components).

Strict Typing (if TypeScript):
- Define interfaces for all Props, State, and API responses.
- Avoid `any`.

Styling:
- Never use inline styles (performance impact).
- Use `StyleSheet.create` or the project's chosen styling library.
- Centralize colors, fonts, and spacing in a `theme` or `constants` file.

Naming Conventions:
- PascalCase for Components (`UserProfile.tsx`).
- camelCase for functions/hooks (`useAuth.ts`, `fetchData`).
- CONSTANT_CASE for distinct configuration values.

SECTION 4 — RELIABILITY & UI STATE

Handle all UI states explicitly:
- Loading state (Skeletons or Spinners).
- Error state (User-friendly error messages + Retry buttons).
- Empty state (Visual feedback when list/data is empty).

Wrap critical UI sections in **Error Boundaries** to prevent full app crashes.

Validate all props and navigation parameters.

Ensure App works Offline-First where possible (handle network reachability).

SECTION 5 — SECURITY & STORAGE RULES

Never store sensitive tokens (JWT, API Keys) in `AsyncStorage`.
Use Secure Storage (e.g., `expo-secure-store`, `react-native-keychain`).

Sanitize user input before sending to backend.

No hardcoded secrets in the code. Use `react-native-config` or `.env` files.

SECTION 6 — PERFORMANCE RULES (CRITICAL)

Prevent Unnecessary Re-renders:
- Use `React.memo` for list items or heavy components.
- Use `useCallback` for functions passed as props.
- Use `useMemo` for expensive calculations.

List Optimization:
- Always use `FlatList` or `SectionList` for long lists (never `ScrollView`).
- Implement `keyExtractor`, `getItemLayout`, and `initialNumToRender`.

Image Handling:
- Use proper caching strategies (e.g., `expo-image` or `react-native-fast-image`).
- Resize images server-side or limit dimensions before rendering.

Avoid "Bridge Traffic" overload (minimize passing massive JSON objects over the JS-Native bridge).

SECTION 7 — TESTING REQUIREMENTS

For each component/hook, generate:
- Unit tests (Jest).
- Component tests (React Native Testing Library).

Mock native modules and navigation props properly.
Snapshot tests are acceptable but logic tests are prioritized.

SECTION 8 — UI/UX & PLATFORM SPECIFICS

Responsiveness:
- Do not use hardcoded pixel values for dimensions (use Flexbox or percentage).
- Handle "Safe Area" (Notch/Dynamic Island) on iOS and Android correctly.

Platform adaptation:
- Use `Platform.OS` or `Platform.select` to handle OS-specific UI nuances.
- Ensure touch targets are large enough (min 44x44px).

Accessibility (A11y):
- All interactive elements must have `accessibilityLabel` and `accessibilityRole`.

Keyboard Handling:
- Use `KeyboardAvoidingView` or `react-native-keyboard-aware-scroll-view` for input forms.

SECTION 9 — DOCUMENTATION

Provide JSDoc/TSDoc for complex props and custom hooks.
Explain tricky styling logic or platform hacks in comments.

SECTION 10 — OUTPUT STRICTNESS

No partial code.
If modifying a component, output the full file contents unless the change is trivial and clearly located.

Do not assume `styles` exist; define them if used.

Always return code that is immediately runnable on a device/simulator.