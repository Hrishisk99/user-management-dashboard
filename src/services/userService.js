const BASE_URL = 'https://jsonplaceholder.typicode.com/users';

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


async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

export async function fetchUsers() {
  const response = await fetch(BASE_URL);
  const data = await handleResponse(response);
  return data.map(mapUserFromApi);
}

export async function fetchUserById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  const data = await handleResponse(response);
  return mapUserFromApi(data);
}

export async function createUser(user) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mapUserToApi(user)),
  });
  const data = await handleResponse(response);
  return { ...user, id: data.id };
}

export async function updateUser(id, user) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mapUserToApi(user)),
  });
  await handleResponse(response);
  return { ...user, id };
}

export async function deleteUser(id) {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return true;
}