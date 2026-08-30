// pony-tail: in-memory token storage with sessionStorage backup for session persistence
let authToken: string | null = null;

const getStorage = () => (typeof window !== 'undefined' ? window.sessionStorage : undefined);

export const setAuthToken = (token: string | null) => {
  authToken = token;
  const storage = getStorage();
  if (storage) {
    if (token) {
      storage.setItem('insight_token', token);
    } else {
      storage.removeItem('insight_token');
    }
  }
};

export const getAuthToken = (): string | null => {
  if (!authToken) {
    const storage = getStorage();
    if (storage) {
      authToken = storage.getItem('insight_token');
    }
  }
  return authToken;
};

export const apiFetch = async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  const headers = new Headers(init.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(input, {
    ...init,
    headers,
  });
};
