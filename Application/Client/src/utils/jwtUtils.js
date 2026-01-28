// src/utils/jwtUtils.js

export const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch (e) {
    console.error("Invalid token");
    return null;
  }
};

export const getToken = () => localStorage.getItem("authToken");

export const getUserId = () => {
  const decoded = decodeToken(getToken());
  return decoded?.user_id ?? null;
};

export const getRole = () => {
  const decoded = decodeToken(getToken());
  return decoded?.role ?? null;
};

export const getEntityId = () => {
  const decoded = decodeToken(getToken());
  return decoded?.entity_id ?? null;
};

export const isTokenExpired = () => {
  const decoded = decodeToken(getToken());
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 < Date.now();
};

export const clearAuth = () => {
  localStorage.removeItem("authToken");
};
