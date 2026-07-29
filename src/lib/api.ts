export async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, {
    ...init,
    credentials: 'include',
  });
  
  if (response.status === 401) {
    // Token expired — clear session and redirect
    sessionStorage.removeItem('insight_user');
    window.location.href = '/login';
    throw new Error('Session expired');
  }
  
  return response;
}
