/**
 * userService.js
 *
 * Thin wrapper around the JSONPlaceholder `/users` endpoint.
 * Keeping all fetch calls in one place (instead of scattering them across
 * components) makes the API layer easy to swap out or mock in tests, and
 * keeps components DRY - they just call these functions and don't care
 * about URLs, headers, or response parsing.
 */

const BASE_URL = 'https://jsonplaceholder.typicode.com/users';

/**
 * JSONPlaceholder's user shape doesn't match our dashboard's fields
 * (it has a single `name` field and no `department`). These mappers
 * translate between the API shape and the app's internal shape so the
 * rest of the codebase never has to think about JSONPlaceholder's quirks.
 *
 * Assumption (documented in README too): `name` is split into
 * firstName/lastName on the first space, and `company.name` is reused
 * as the "department" since JSONPlaceholder has no department field.
 */
export function mapUserFromApi(apiUser) {
  const [firstName = '', ...rest] = (apiUser.name || '').split(' ');
  return {
    id: apiUser.id,
    firstName,
    lastName: rest.join(' '),
    email: apiUser.email || '',
    department: apiUser.company?.name || '',
  };
}

export function mapUserToApi(user) {
  return {
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    company: { name: user.department },
  };
}

/**
 * Generic response handler.
 * JSONPlaceholder always returns 2xx for valid requests, but we still guard
 * against network failures / non-2xx responses so the UI can show a
 * meaningful error instead of silently failing.
 */
async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

/** Fetch the full list of users, mapped to the dashboard's user shape. */
export async function fetchUsers() {
  const response = await fetch(BASE_URL);
  const data = await handleResponse(response);
  return data.map(mapUserFromApi);
}

/**
 * Fetch a single user by id.
 * Used before opening the edit form, per the spec: "fetching the current
 * data for a user, allowing for edits, and then putting the updated data
 * back via the API" - rather than only reusing what's already in the
 * in-memory list.
 */
export async function fetchUserById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  const data = await handleResponse(response);
  return mapUserFromApi(data);
}

/**
 * Create a new user.
 * Note: JSONPlaceholder does not persist writes - it simulates a 201
 * response with the payload echoed back (usually with id: 11). The calling
 * code is responsible for merging this into local state.
 */
export async function createUser(user) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mapUserToApi(user)),
  });
  const data = await handleResponse(response);
  // JSONPlaceholder echoes the payload back with a generated id (usually 11).
  // We merge that id with the original submitted fields since the response
  // itself doesn't round-trip through mapUserFromApi cleanly.
  return { ...user, id: data.id };
}

/**
 * Update an existing user via PUT.
 * Same persistence caveat as createUser - the response is simulated.
 */
export async function updateUser(id, user) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mapUserToApi(user)),
  });
  await handleResponse(response);
  return { ...user, id };
}

/** Delete a user by id. */
export async function deleteUser(id) {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return true;
}