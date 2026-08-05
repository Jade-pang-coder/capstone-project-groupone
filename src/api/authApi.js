const API_BASE_URL = "https://capstone-project-backend-delta.vercel.app/api";

const readResponse = async (response, fallbackMessage) => {
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || data?.error || fallbackMessage);
  return data;
};

const normalizeUser = (user) => ({ ...user, name: user?.name || user?.full_name });

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });
  const data = await readResponse(response, "Login failed");
  return { ...data, user: normalizeUser(data.user) };
};

export const register = async (userData) => {
  const email = userData.email.trim().toLowerCase();
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: userData.name,
      email,
      password: userData.password,
      membership_tier: "Regular",
      discount_percentage: 0,
    }),
  });
  await readResponse(response, "Registration failed");
  return login(email, userData.password);
};

export const getUserProfile = async (userId, token) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return normalizeUser(await readResponse(response, "Failed to fetch user profile"));
};

export const updateUserProfile = async (userId, userData, token) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(userData),
  });
  return readResponse(response, "Failed to update user profile");
};
