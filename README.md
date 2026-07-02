# User Management Dashboard

A React + Vite single-page application for viewing, adding, editing, and deleting users, built against the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) `/users` REST API. Built as part of the Ajackus frontend assignment.

**Live Demo:** [https://user-management-dashboard-eta-hazel.vercel.app/](https://user-management-dashboard-eta-hazel.vercel.app/)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Run Locally](#setup--run-locally)
- [Available Scripts](#available-scripts)
- [How It Works](#how-it-works)
- [Assumptions](#assumptions)
- [Challenges Faced](#challenges-faced)
- [Improvements With More Time](#improvements-with-more-time)
- [Testing](#testing)

---

## Features

**User Interface**
- Table view of all users with **ID, First Name, Last Name, Email, and Department**
- "Add User" button in the header; "Edit" and "Delete" actions on every row
- A single modal form (`UserForm`) reused for both Add and Edit, with client-side validation
- Pagination with selectable page size — **10 / 25 / 50 / 100**
- Filter popup to filter by **first name, last name, email, and department** simultaneously
- Debounced search (300ms) across name, email, and department
- Click any column header to sort ascending/descending
- Fully responsive layout — the table collapses into stacked cards below 640px width
- Error banner shown on any failed API request, with a dismiss control
- Confirmation dialogs before destructive actions (delete user, reset demo data)

**Backend Interaction**
- All reads/writes go through JSONPlaceholder's `/users` endpoint (GET, POST, PUT, DELETE)
- A small mapping layer translates between JSONPlaceholder's shape (`name`, `company.name`) and the app's shape (`firstName`, `lastName`, `department`) — see [Assumptions](#assumptions)

**Persistence Note**
- JSONPlaceholder simulates write responses but does not actually persist them server-side. Every Add/Edit/Delete still makes a real API call first (per the spec), and the resulting local list is cached in `localStorage` purely so changes survive a page refresh. A "Reset demo data" button clears this cache and reloads the original seed data from the API.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| UI Library | React 18 | Required/allowed by the brief; component model fits this app well |
| Build Tool | Vite | Fast dev server, minimal config |
| HTTP | Fetch API | No need for Axios's extra features (interceptors, etc.) at this scale |
| Styling | Vanilla CSS (no framework) | Keeps the bundle small and styling explicit/traceable |
| Testing | Vitest + React Testing Library | Fast, Vite-native, Jest-compatible API |

---

## Project Structure

```
user-management-dashboard/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx                # Top-level component — wires hook + components together
    ├── index.css               # Global styles / design tokens / responsive rules
    ├── components/             # Presentational, mostly stateless components
    │   ├── UserTable.jsx
    │   ├── UserForm.jsx        # Shared Add/Edit form
    │   ├── FilterPopup.jsx
    │   ├── Pagination.jsx
    │   ├── SearchBar.jsx
    │   ├── ConfirmDialog.jsx   # Shared delete/reset confirmation
    │   ├── ErrorBanner.jsx
    │   └── icons.jsx
    ├── hooks/
    │   └── useUsers.js         # All data state: fetch, CRUD, search/filter/sort/paginate
    ├── services/
    │   └── userService.js      # All API calls + request/response mapping
    ├── utils/
    │   ├── validation.js       # Form validation rules
    │   ├── storage.js          # localStorage read/write/clear helpers
    │   └── departmentTags.js   # Deterministic department color/initials helpers
    └── __tests__/               # Unit tests for services and utils
        ├── userService.test.js
        ├── validation.test.js
        ├── storage.test.js
        └── departmentTags.test.js
```

This separates **data/logic** (`hooks`, `services`, `utils`) from **presentation** (`components`), so each piece can be tested and reasoned about independently.

---

## Setup & Run Locally

**Prerequisites:** Node.js 18+ and npm

```bash
# 1. Clone the repository
git clone https://github.com/Hrishisk99/user-management-dashboard.git
cd user-management-dashboard

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
# App runs at http://localhost:5173
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite dev server with hot reload |
| `npm run build` | Builds an optimized production bundle to `dist/` |
| `npm run preview` | Serves the production build locally for a final check |
| `npm test` | Runs the unit test suite (Vitest, single run) |

---

## How It Works

- **Fetching:** On load, `useUsers` checks `localStorage` for a cached list first; if none exists, it calls `GET /users` and caches the mapped result.
- **Add:** Opens `UserForm` in "add" mode → on submit, validates client-side → `POST /users` → the server's generated `id` is merged with the submitted fields → prepended to local state and re-cached.
- **Edit:** Opens `UserForm` pre-filled with the row's current data, then re-fetches that user by ID (`GET /users/:id`) to ensure the form reflects the latest data before editing → on submit, validates → `PUT /users/:id` → local state updated in place.
- **Delete:** Confirmation dialog → `DELETE /users/:id` → row removed from local state on success.
- **Search / Filter / Sort / Pagination:** All performed client-side in a single `useMemo` pipeline inside `useUsers` (search → filters → sort → paginate), since the dataset is small and JSONPlaceholder has no query-param support for these.
- **Errors:** Every API call is wrapped in try/catch; failures set a message that renders in a dismissible `ErrorBanner` at the top of the page rather than failing silently.

---

## Assumptions

Since JSONPlaceholder's `/users` schema doesn't match the assignment's required fields, a few assumptions were made and documented here as required by the brief:

1. **`name` → `firstName` / `lastName`:** JSONPlaceholder returns a single `name` string. It's split on the first space — everything before is `firstName`, everything after is `lastName`.
2. **`department` → `company.name`:** JSONPlaceholder has no department field, so `company.name` is reused as the department, both when reading and when writing back to the API.
3. **No real server-side persistence:** JSONPlaceholder simulates successful POST/PUT/DELETE responses but doesn't actually store the changes. To keep the UI feeling real across a refresh (rather than reverting on every reload), the resulting list is cached in `localStorage` after every real API call. A "Reset demo data" control clears this cache and reloads the original 10 seed users.
4. **Client-side search/filter/sort/pagination:** Given the small dataset (10 users) and no query-param support on JSONPlaceholder for these operations, all of it is handled in-memory rather than via API requests.
5. **New user IDs:** JSONPlaceholder's fake POST always returns `id: 11` regardless of how many users are added in a session — a known limitation of the mock API, not of this app's logic.

---

## Challenges Faced

- **Schema mismatch:** JSONPlaceholder's user shape doesn't match the assignment's required fields (First Name, Last Name, Department). This was solved with a small adapter layer (`mapUserFromApi` / `mapUserToApi`) so the rest of the app never has to know about the mismatch.
- **Fake persistence:** Since writes aren't actually saved by the API, keeping the UI state consistent meant carefully merging API responses into local state rather than re-fetching after every mutation (which would have silently discarded the user's changes).
- **Responsive table:** A wide 5-column table doesn't fit well on small screens. Rather than horizontal scrolling, each row collapses into a labeled stacked card below 640px, which reads better on mobile.

---

## Improvements With More Time

- Add optimistic UI updates with rollback-on-failure (currently the UI waits for the API response before updating state).
- Add end-to-end tests (Playwright/Cypress) covering full add/edit/delete flows through the UI, not just unit tests on services/utils.
- Add component-level tests (React Testing Library) for `UserForm`, `UserTable`, and the `useUsers` hook directly.
- Extract the modal overlay/shell into a single shared `<Modal>` component — currently `UserForm`, `FilterPopup`, and `ConfirmDialog` each render their own overlay markup.
- Add proper toast notifications for successful add/edit/delete, not just for errors.
- Add pagination/sorting indicators that are keyboard-accessible, and broader a11y pass (focus trapping in modals).

---

## Testing

Run the unit test suite with:

```bash
npm test
```

Current coverage focuses on the logic layer:
- `userService.test.js` — API mapping functions and HTTP success/failure paths (mocked `fetch`)
- `validation.test.js` — required-field and email-format validation rules
- `storage.test.js` — localStorage read/write/clear, including corrupted-JSON handling
- `departmentTags.test.js` — deterministic color hashing and initials generation

---

## Deployment

Deployed on **Vercel**: [https://user-management-dashboard-eta-hazel.vercel.app/](https://user-management-dashboard-eta-hazel.vercel.app/)