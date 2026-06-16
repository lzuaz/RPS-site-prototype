# Exhaustive System Audit & Bug Report

After a deep dive into the frontend (`dev/page.tsx`, `dashboard/page.tsx`), the backend actions (`src/app/actions/*`), and the database schema (`schema.sql`), I have compiled a comprehensive list of all critical bugs, hollow UI components, unused state variables, and architectural gaps.

## 🚨 CRITICAL BUGS & CRASH RISKS

1. **Missing Storage Bucket for Assets**: 
   - **Bug**: In `dev/page.tsx`, the `handleFileUpload` function attempts to upload files to a Supabase storage bucket named `assets`. However, `schema.sql` only creates the Postgres *table* `public.assets`. It does not create the actual Storage bucket. Attempting to upload an asset will result in a hard crash/error.
2. **Uncaught JSON Parsing in DataStore**: 
   - **Bug**: In `datastore.actions.ts`, the `savePlayerData` action blindly parses `dataJsonString` using `JSON.parse()`. If a staff member types malformed JSON in the frontend, the backend throws an unhandled error instead of validating it with a schema library (like Zod) and returning a clean frontend error.
3. **Mobile App is Unusable**: 
   - **Bug**: On screens smaller than desktop (`<lg`), the main sidebar receives the `hidden` class. Because there is no hamburger menu or mobile navigation fallback implemented anywhere in the DOM, mobile users are completely trapped on whatever page they land on.

## 🧱 SCHEMA GAPS (Missing Backend Tables)

The following UI components are populated with hardcoded React arrays because the corresponding Supabase tables *do not exist* in `schema.sql`:

- **`project_pipeline`**: The 4-phase deployment tracker is entirely hardcoded in both dashboards.
- **`system_logs`**: The `mockLogs` array in the Studio Workspace is hardcoded.
- **`telemetry`**: The Server Load (64%), Active Players (1420), and Error Rate are static objects.
- **`leaderboard` / `stats`**: The Player Hub's "Top Players" list, along with the user's specific Win Rate (68%), Matches Played, and Rank, are hardcoded strings. There is no statistics tracking on the `users` table.
- **`chat_logs`**: The Vanguard Uplink (Chat) matrix uses a local React state with a `setTimeout` dummy bot. No WebSocket or messaging table exists.
- **`reports`**: The "Report Issue" form in the Player Hub has no backend table to save to.
- **`daily_rewards`**: There is no ledger or table tracking when a user last claimed their daily login reward.

## 🕳️ HOLLOW UI & DEAD ENDS

These components look fully built but do absolutely nothing when interacted with:

1. **Daily Reward Claim**: Clicking the "Claim 50 Coins" button in the Player Hub simply closes the modal (`setShowDailyReward(false)`). It does not call an action to increment coins in the DataStore.
2. **Issue Reporting**: Clicking "Submit Report" in the Player Hub triggers an `onSubmit={(e) => e.preventDefault()}` and stops. No data is sent.
3. **Quick Actions (Dev Dashboard)**: The buttons for "Purge Edge Cache", "Restart Instance", and "Trigger Lockdown" are pure UI placeholders. They do not trigger any serverless functions or API routes.
4. **Theme Amnesia**: The Dark/Light mode toggle (`isDarkTheme`) only updates local React state. If you refresh the page or navigate between routes, it resets immediately. It needs to sync with `localStorage` or user DB preferences.

## 👻 UNUSED STATE & GHOST CODE

- `isFullSettingsOpen`: This state variable is declared in both `dev/page.tsx` and `dashboard/page.tsx` but is never actually used to render a full settings page.
- `logLevel` & `logMessage`: These state variables are declared in `dev/page.tsx`, but there is no actual input form to let an admin create a new system log.
- **Missing Avatar System**: The profile settings modal allows updating `firstName`, `lastName`, and `email`, but there is no way to upload a custom profile picture. The avatar relies purely on CSS initials.
- **RBAC Enforcement Risk**: While React hides the "Staff Registry" tab from non-admins, we need to ensure that Supabase Row Level Security (RLS) is actually blocking `developer` roles from calling `getStaff()` or `addStaff()` at the database level.

---

### Recommended Next Steps:
1. **Fix the Mobile Navigation** so the app is actually usable on phones.
2. **Create the Missing Supabase Tables** (Logs, Telemetry, Stats, Pipeline).
3. **Wire up the "Hollow UI"** (Daily Rewards, Reporting, Chat) to real backend actions.
