// shared/getNewAccessToken.js — lấy access token mới bằng refresh token
import { API_URL } from './config.js';
import { saveTokens, getRefreshToken } from './tokenStorage.js';
import { logout } from './logout.js';

// Dùng chung 1 promise khi đang refresh -> nhiều request cùng 401 không gọi refresh trùng
let refreshing = null;

export const getNewAccessToken = async () => {
    // Đã có 1 lần refresh đang chạy → dùng chung, không gọi mới
    if (refreshing) return refreshing;

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        logout();
        throw new Error('NO_REFRESH_TOKEN');
    }

    refreshing = (async () => {
        try {
            const res = await fetch(`${API_URL}/auth/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (!res.ok) {
                logout();
                throw new Error('REFRESH_FAILED');
            }

            const data = await res.json();
            saveTokens(data.accessToken, data.refreshToken);
            return data.accessToken;
        } finally {
            refreshing = null; // clear sau khi refresh xong, cho phép lần sau
        }
    })();

    return refreshing;
};
