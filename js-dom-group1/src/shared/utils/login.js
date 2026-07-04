// shared/login.js — đăng nhập + lưu token
import { API_URL } from './config.js';
import { saveTokens } from './tokenStorage.js';

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error(`LOGIN_FAILED_${res.status}`);

  const data = await res.json();
  saveTokens(data.accessToken, data.refreshToken);
  return data;
};