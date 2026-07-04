// shared/http.js — gọi API có xác thực (tự refresh khi gặp 401)
import { API_URL } from './config.js';
import { getAccessToken } from './tokenStorage.js';
import { getNewAccessToken } from './getNewAccessToken.js';

// Backend này trả 400 "Invalid token" cho token hết hạn/sai thay vì 401 chuẩn,
// nên phải tự nhận diện thêm trường hợp này để trigger refresh token.
const isInvalidTokenError = async (res) => {
    if (res.status === 401) return true;
    if (res.status !== 400) return false;

    const body = await res.clone().json().catch(() => null);
    return body?.message === 'Invalid token';
};

export const get = async (endpoint, retry = true) => {
    const res = await fetch(`${API_URL}/${endpoint}`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
    });

    if (retry && (await isInvalidTokenError(res))) {
        // hết hạn -> refresh rồi thử lại ĐÚNG 1 lần
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

    if (retry && (await isInvalidTokenError(res))) {
        await getNewAccessToken();
        return post(endpoint, body, false);
    }

    if (!res.ok) throw new Error(`REQUEST_FAILED_${res.status}`);
    return res.json();
};

export const put = async (endpoint, body, retry = true) => {
    const res = await fetch(`${API_URL}/${endpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(body),
    });

    if (retry && (await isInvalidTokenError(res))) {
        await getNewAccessToken();
        return put(endpoint, body, false);
    }

    if (!res.ok) throw new Error(`REQUEST_FAILED_${res.status}`);
    return res.json();
};

export const del = async (endpoint, retry = true) => {
    const res = await fetch(`${API_URL}/${endpoint}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
        },
    });

    if (retry && (await isInvalidTokenError(res))) {
        await getNewAccessToken();
        return del(endpoint, false);
    }

    if (!res.ok) throw new Error(`REQUEST_FAILED_${res.status}`);
    return res.json();
};
