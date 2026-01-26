// src/utils/jwtUtils.js

/**
 * Decodes a JWT token and returns the payload
 * @param {string} token - The JWT token to decode
 * @returns {object|null} - The decoded payload or null if decoding fails
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Gets the donor ID from the stored token
 * @returns {number|null} - The donor ID (entity_id) or null if not found
 */
export const getDonarIdFromToken = () => {
  try {
    const token = localStorage.getItem('donorToken');
    if (!token) {
      console.error('No token found in localStorage');
      return null;
    }

    const decoded = decodeToken(token);
    return decoded?.entity_id || null;
  } catch (error) {
    console.error('Error getting donar ID from token:', error);
    return null;
  }
};

/**
 * Gets the user ID from the stored token
 * @returns {number|null} - The user ID or null if not found
 */
export const getUserIdFromToken = () => {
  try {
    const token = localStorage.getItem('donorToken');
    if (!token) {
      console.error('No token found in localStorage');
      return null;
    }

    const decoded = decodeToken(token);
    return decoded?.user_id || null;
  } catch (error) {
    console.error('Error getting user ID from token:', error);
    return null;
  }
};

/**
 * Gets the user role from the stored token
 * @returns {string|null} - The user role or null if not found
 */
export const getRoleFromToken = () => {
  try {
    const token = localStorage.getItem('donorToken');
    if (!token) {
      console.error('No token found in localStorage');
      return null;
    }

    const decoded = decodeToken(token);
    return decoded?.role || null;
  } catch (error) {
    console.error('Error getting role from token:', error);
    return null;
  }
};

/**
 * Checks if the token is expired
 * @returns {boolean} - True if token is expired or invalid
 */
export const isTokenExpired = () => {
  try {
    const token = localStorage.getItem('donorToken');
    if (!token) return true;

    const decoded = decodeToken(token);
    if (!decoded?.exp) return true;

    // exp is in seconds, Date.now() is in milliseconds
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Gets all token data
 * @returns {object|null} - Complete decoded token data or null
 */
export const getTokenData = () => {
  try {
    const token = localStorage.getItem('donorToken');
    if (!token) return null;

    return decodeToken(token);
  } catch (error) {
    console.error('Error getting token data:', error);
    return null;
  }
};