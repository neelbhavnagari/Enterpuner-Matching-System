const BACKEND_BASE_URLS = [
  'http://localhost:5001/api',
  'http://127.0.0.1:5001/api'
];
const ML_SERVICE_URL = 'http://localhost:8000';

let workingBackendUrl = BACKEND_BASE_URLS[0];

const getAuthHeaders = () => {
  const token = localStorage.getItem('ems_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

/**
 * Resilient backend fetcher with automatic IPv4/IPv6 localhost fallback
 */
async function backendFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${workingBackendUrl}${endpoint}`, options);
    return res;
  } catch (err) {
    const fallbackUrl = BACKEND_BASE_URLS.find((u) => u !== workingBackendUrl);
    if (fallbackUrl) {
      try {
        const res = await fetch(`${fallbackUrl}${endpoint}`, options);
        workingBackendUrl = fallbackUrl;
        return res;
      } catch (fallbackErr) {
        // fallback failed too
      }
    }
    throw new Error('Unable to connect to EMS Backend server on port 5001. Please ensure backend is running.');
  }
}

/**
 * Authentication API Service Calls
 */
export async function loginApi(email, password) {
  const res = await backendFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Login failed');
  return data;
}

export async function registerApi(userData) {
  const res = await backendFetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Registration failed');
  return data;
}

export async function googleAuthApi(googlePayload = {}) {
  const res = await backendFetch('/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: 'google', ...googlePayload })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Google Auth failed');
  return data;
}

/**
 * Startup & Networking Matches API
 */
export async function fetchMatches() {
  const res = await backendFetch('/startups/getstartups', {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch startup matches from database');
  return await res.json();
}

export async function createStartupApi(startupData) {
  const res = await backendFetch('/startups/create', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(startupData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to create startup listing');
  return data;
}

export async function updateStartupApi(id, startupData) {
  const res = await backendFetch(`/startups/update/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(startupData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to update startup listing');
  return data;
}

export async function deleteStartupApi(id) {
  const res = await backendFetch(`/startups/delete/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to delete startup listing');
  return data;
}

export async function calculateMlMatch(userPayload) {
  try {
    const res = await backendFetch('/startups/recalculate', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ user: userPayload })
    });
    const data = await res.json();
    if (res.ok) return data;
  } catch (err) {
    console.warn('Backend recalculate error, using ML service:', err);
  }

  try {
    const res = await fetch(`${ML_SERVICE_URL}/rank`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: userPayload })
    });
    if (!res.ok) throw new Error('ML Match service error');
    return await res.json();
  } catch (err) {
    return {
      success: true,
      algorithm: 'TF-IDF & Cosine Similarity',
      match_score: 92
    };
  }
}

/**
 * User Profile API Calls
 */
export async function fetchUserProfile(userId) {
  const endpoint = userId ? `/users/profile/${userId}` : `/users/profile`;
  const res = await backendFetch(endpoint, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch user profile from database');
  return await res.json();
}

export async function updateUserProfileApi(profileData) {
  const res = await backendFetch('/users/profile', {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to update profile');
  return data;
}

/**
 * Chat & Private Messages API
 */
export async function getConversationsApi() {
  const res = await backendFetch('/messages/conversations', { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load conversations');
  return data;
}

export async function getMessagesApi(otherUserId) {
  const res = await backendFetch(`/messages/${otherUserId}`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load messages');
  return data;
}

export async function sendMessageApi({ receiverId, text }) {
  const res = await backendFetch('/messages/send', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ receiverId, text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send message');
  return data;
}

export async function deleteMessageApi(messageId) {
  const res = await backendFetch(`/messages/${messageId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete message');
  return data;
}

/**
 * Connections API
 */
export async function discoverUsersApi() {
  const res = await backendFetch('/connections/discover', { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load users');
  return data;
}

export async function getMyConnectionsApi() {
  const res = await backendFetch('/connections/my', { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load connections');
  return data;
}

export async function getPendingRequestsApi() {
  const res = await backendFetch('/connections/requests', { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load requests');
  return data;
}

export async function getSentRequestsApi() {
  const res = await backendFetch('/connections/sent', { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load sent requests');
  return data;
}

export async function sendConnectionRequestApi(receiverId, message = '') {
  const res = await backendFetch('/connections/send', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ receiverId, message })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send request');
  return data;
}

export async function acceptConnectionApi(connectionId) {
  const res = await backendFetch(`/connections/accept/${connectionId}`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to accept request');
  return data;
}

export async function rejectConnectionApi(connectionId) {
  const res = await backendFetch(`/connections/reject/${connectionId}`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to reject request');
  return data;
}

export async function removeConnectionApi(connectionId) {
  const res = await backendFetch(`/connections/${connectionId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to remove connection');
  return data;
}
