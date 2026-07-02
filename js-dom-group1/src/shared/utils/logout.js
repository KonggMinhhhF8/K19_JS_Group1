// shared/logout.js — đăng xuất: xóa token + về trang login
import { LOGIN_PAGE } from './config.js';
import { clearTokens } from './tokenStorage.js';

export const logout = () => {
  clearTokens();
  window.location.href = LOGIN_PAGE;
};