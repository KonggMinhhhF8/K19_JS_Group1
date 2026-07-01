// login/main.js — kết nối form với API đăng nhập
import { login } from '../shared/utils/index.js';
import { validateLoginForm } from './validators.js';
import { showError, clearError, markField, setLoading, togglePassword } from './ui.js';

const REDIRECT_AFTER_LOGIN = '/app/index.html';

document.addEventListener('DOMContentLoaded', () => {
  const form       = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passInput  = document.getElementById('password');

  // Hiện / ẩn mật khẩu
  document.getElementById('togglePass').addEventListener('click', togglePassword);

  // Gõ lại thì xóa trạng thái lỗi
  [emailInput, passInput].forEach((input) => {
    input.addEventListener('input', () => {
      markField(input.id, false);
      clearError();
    });
  });

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passInput.value;

    // 1) Validate phía client (ô trống / email sai định dạng)
    const error = validateLoginForm(email, password);
    if (error) {
      markField(error.field, true);
      showError(error.message);
      document.getElementById(error.field).focus();
      return;
    }

    clearError();
    setLoading(true);

    // 2) Gọi API đăng nhập
    try {
    await login(email.trim(), password);          // thành công -> tự lưu token
      window.location.href = "../index.html";
    } catch (err) {
      const m = String(err.message);
      let msg = 'Đăng nhập thất bại. Vui lòng thử lại.';
      // Sai email hoặc mật khẩu (API trả 401/403)
      if (m.includes('401') || m.includes('403')) msg = 'Email hoặc mật khẩu không đúng.';
      else if (m.includes('404')) msg = 'Tài khoản không tồn tại.';
      else if (m.includes('400')) msg = 'Dữ liệu không hợp lệ.';

      // Sai thông tin đăng nhập -> đánh dấu đỏ cả 2 ô
      markField('email', true);
      markField('password', true);
      showError(msg);
    } finally {
      setLoading(false);
    }
  });
});