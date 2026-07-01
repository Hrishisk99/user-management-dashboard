# User Management Dashboard

A React + Vite single-page app for viewing, adding, editing, and deleting
users, built against the [JSONPlaceholder](https://jsonplaceholder.typicode.com)
`/users` API as part of the Ajackus frontend assignment.

## Live Demo
[Add your deployed link here after deploying]

## Features

- View users in a sortable table (click any column header to sort)
- Add / Edit users via a modal form with client-side validation — Edit
  fetches the latest data for that user before opening the form
- Delete users with a confirmation dialog
- Debounced search across name, email, and department
- Filter popup (first name, last name, email, department)
- Pagination with selectable page size (10 / 25 / 50 / 100)
- Responsive layout — table collapses into stacked cards on small screens
- Error banner surfaced on any failed API request
- Add/Edit/Delete persist across a refresh (cached in localStorage), with
  a "Reset demo data" control to return to the original seed data

## Tech Stack

- React 18 + Vite
- Vanilla CSS (no UI framework, to keep the bundle small and styling explicit)
  — type system is Space Grotesk (headings) + Inter (UI) + JetBrains Mono
  (IDs/emails), loaded via Google Fonts in `index.html`
- Vitest + Testing Library for unit tests
- Fetch API for HTTP requests

## Design Notes

- Departments are tagged with a deterministic color (hashed from the
  department name) so the same department always renders the same color,
  making the table easier to scan without needing a legend.
- The table collapses into stacked cards below 640px rather than
  horizontally scrolling, since that reads better on a phone.

## Project Structure

```
src/
  components/     Presentational components (table, form, modals, icons, etc.)
  hooks/          useUsers - all data state: fetch, CRUD, search/filter/sort/paginate
  services/       userService - all API calls + request/response mapping
  utils/          validation, departmentTags, storage - pure, testable helpers
  __tests__/      Unit tests for services and utils
  App.jsx         Top-level component, wires hook + components together
  main.jsx        React entry point
  index.css       Global styles / design tokens
```

## Setup & Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
# App runs at http://localhost:5173

# 3. Run unit tests
npm test

# 4. Build for production
npm run build
npm run preview   # preview the production build locally
```

## Assumptions

- **`name` → firstName/lastName**: JSONPlaceholder's `/users` returns a single
  `name` field. It's split on the first space into `firstName` and the
  remainder into `lastName`.
- **`department` → `company.name`**: JSONPlaceholder has no department field,
  so `company.name` is reused as the department, both when reading and
  writing.
- **No real persistence at the API level, cached locally instead**:
  JSONPlaceholder simulates POST/PUT/DELETE responses but doesn't actually
  store changes server-side - a plain refresh would otherwise wipe out any
  Add/Edit/Delete. Every Add/Edit/Delete still goes through a real API call
  first (exactly as the spec requires); the resulting list is then cached
  in `localStorage` purely so the UI reflects those changes across a
  refresh too. A "Reset demo data" button (top of the toolbar) clears the
  cache and reloads the original 10 seed users from the API.
- **Client-side search/filter/sort/pagination**: since the dataset is small
  (10 users) and the API has no query params for these, all of it is done
  in-memory in the `useUsers` hook rather than via API calls.

## Challenges Faced

- JSONPlaceholder's user shape doesn't match the assignment's required
  fields (First Name, Last Name, Department) — solved with a small
  mapper layer (`mapUserFromApi` / `mapUserToApi`) so the rest of the app
  never has to know about the mismatch.
- Since writes aren't persisted by the API, keeping the UI feeling "real"
  meant carefully merging API responses into local state rather than
  re-fetching after every mutation (which would have discarded local
  changes).

## Improvements With More Time

- Add optimistic UI updates with rollback-on-failure (currently the UI
  waits for the API response before updating state).
- Add end-to-end tests (Playwright/Cypress) covering the full add/edit/delete
  flows through the UI, not just unit tests on services/utils.
- Extract the modal overlay/shell into a shared `<Modal>` component — right
  now `UserForm`, `FilterPopup`, and `ConfirmDialog` each render their own
  overlay markup.
- Add proper toast notifications for successful add/edit/delete, not just
  errors.