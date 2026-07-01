# User Management Dashboard

A React + Vite single-page app for viewing, adding, editing, and deleting
users, built against the [JSONPlaceholder](https://jsonplaceholder.typicode.com)
`/users` API as part of the Ajackus frontend assignment.

## Live Demo
[Add your deployed link here after deploying]

## Features

- View users in a sortable table (click any column header to sort)
- Add / Edit users via a modal form with client-side validation
- Delete users with a confirmation dialog
- Debounced search across name, email, and department
- Filter popup (first name, last name, email, department)
- Pagination with selectable page size (10 / 25 / 50 / 100)
- Responsive layout — table collapses into stacked cards on small screens
- Error banner surfaced on any failed API request

## Tech Stack

- React 18 + Vite
- Vanilla CSS (no UI framework, to keep the bundle small and styling explicit)
- Vitest + Testing Library for unit tests
- Fetch API for HTTP requests

## Project Structure

```
src/
  components/     Presentational components (table, form, modals, etc.)
  hooks/          useUsers - all data state: fetch, CRUD, search/filter/sort/paginate
  services/       userService - all API calls + request/response mapping
  utils/          validation - pure, testable form validation logic
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
- **No real persistence**: JSONPlaceholder simulates POST/PUT/DELETE
  responses but doesn't actually store changes server-side. Add/Edit/Delete
  are applied optimistically to local React state after a successful
  response, so the UI behaves like a real CRUD app for the duration of the
  session, but a page refresh resets to the original 10 seeded users. This
  is called out explicitly since it's inherent to the mock API, not a bug.
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
- Persist local changes to `localStorage` so a refresh doesn't lose them.
- Extract the modal overlay/shell into a shared `<Modal>` component — right
  now `UserForm`, `FilterPopup`, and `ConfirmDialog` each render their own
  overlay markup.
- Add proper toast notifications for successful add/edit/delete, not just
  errors.
