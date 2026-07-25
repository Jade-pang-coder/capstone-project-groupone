import bcrypt from "bcryptjs";

// Testing by Subodh  
const API_BASE_URL = "https://capstone-project-backend-delta.vercel.app/api";

const readResponse = async (response, fallbackMessage) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || fallbackMessage);
  }

  return data;
};

const normalizeUser = (user) => ({
  ...user,
  name: user.name || user.full_name,
});

const legacyHashPassword = async (password) => {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hash) => {
  if (hash && (hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$"))) {
    return await bcrypt.compare(password, hash);
  }
  const legacyHash = await legacyHashPassword(password);
  return legacyHash === hash;
};

const credentialKey = (email) =>
  `eshop:credential:${email.trim().toLowerCase()}`;

// Register a new user
export const register = async (userData) => {
  const passwordHash = await hashPassword(userData.password);
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      full_name: userData.name,
      email: userData.email.trim().toLowerCase(),
      password_hash: passwordHash,
      membership_tier: "Regular",
      discount_percentage: 0,
    }),
  });
  const responseData = await readResponse(response, "Registration failed");
  const responseUser = responseData?.user || responseData?.data || responseData;
  const createdUserId =
    responseUser?.id ||
    responseUser?.user_id ||
    responseUser?.userId ||
    responseData?.user_id ||
    responseData?.userId;
  let user = normalizeUser(responseUser);

  if (!user.id || !user.email) {
    const usersResponse = await fetch(`${API_BASE_URL}/users`);
    const users = await readResponse(
      usersResponse,
      "Account created, but the profile could not be loaded",
    );
    const normalizedEmail = userData.email.trim().toLowerCase();
    const createdUser = users.find(
      (candidate) =>
        (createdUserId && String(candidate.id) === String(createdUserId)) ||
        candidate.email?.toLowerCase() === normalizedEmail,
    );

    if (!createdUser) {
      throw new Error("Account created, but the profile could not be loaded");
    }
    user = normalizeUser(createdUser);
  }
  localStorage.setItem(credentialKey(user.email), passwordHash);

  return { token: `customer-${user.id}`, user };
};

// The current backend exposes customer records but no authentication route.
export const login = async (email, password) => {
  if (!password) {
    throw new Error("Password is required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const savedPasswordHash = localStorage.getItem(
    credentialKey(normalizedEmail),
  );

  if (!savedPasswordHash) {
    throw new Error(
      "This account cannot be password-verified on this device. A backend login endpoint is required.",
    );
  }

  const isMatch = await verifyPassword(password, savedPasswordHash);
  if (!isMatch) {
    throw new Error("Incorrect email or password");
  }

  const response = await fetch(`${API_BASE_URL}/users`);
  const users = await readResponse(response, "Unable to load customers");
  const user = users.find(
    (candidate) => candidate.email?.toLowerCase() === normalizedEmail,
  );

  if (!user) {
    throw new Error("No customer account was found for that email");
  }

  const normalizedUser = normalizeUser(user);
  return { token: `customer-${normalizedUser.id}`, user: normalizedUser };
};

// Get user profile
export const getUserProfile = async (userId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }
    return normalizeUser(
      await readResponse(response, "Failed to fetch user profile"),
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, userData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Failed to update user profile");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
