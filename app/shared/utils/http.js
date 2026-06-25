// shared/http.js — gọi API có xác thực (tự refresh khi gặp 401)
import { API_URL } from './config.js';
import { getAccessToken } from './tokenStorage.js';
import { getNewAccessToken } from './getNewAccessToken.js';

export const get = async (endpoint, retry = true) => {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });

  if (res.status === 401 && retry) {            // hết hạn -> refresh rồi thử lại ĐÚNG 1 lần
    await getNewAccessToken();
    return get(endpoint, false);
  }

  if (!res.ok) throw new Error(`REQUEST_FAILED_${res.status}`);
  return res.json();
};

export const post = async (endpoint, body, retry = true) => {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(body),
  });

  if (res.status === 401 && retry) {
    await getNewAccessToken();
    return post(endpoint, body, false);
  }

  if (!res.ok) throw new Error(`REQUEST_FAILED_${res.status}`);
  return res.json();
};