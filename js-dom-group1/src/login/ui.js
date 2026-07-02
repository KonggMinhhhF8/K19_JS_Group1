// login/ui.js — thao tác giao diện cho trang login

// Hiện thông báo lỗi
export const showError = (message) => {
  document.getElementById('formAlertText').textContent = message;
  document.getElementById('formAlert').classList.add('show');
};

// Ẩn thông báo lỗi
export const clearError = () => {
  document.getElementById('formAlert').classList.remove('show');
};

// Bật/tắt viền đỏ báo lỗi cho 1 ô (theo id)
export const markField = (id, hasError) => {
  document.getElementById(id).classList.toggle('has-error', hasError);
};

// Trạng thái nút khi đang gửi request
export const setLoading = (on) => {
  const btn = document.querySelector('.btn-primary');
  btn.disabled = on;
  btn.textContent = on ? 'Đang đăng nhập...' : 'Đăng nhập';
};

// Icon con mắt cho nút hiện/ẩn mật khẩu
const EYE_OPEN =
  '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>';
const EYE_CLOSED =
  '<path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a18 18 0 0 1-2.2 3.2"/>' +
  '<path d="M6.6 6.6A18 18 0 0 0 2 11s3.5 7 10 7a10.9 10.9 0 0 0 5.4-1.4"/>' +
  '<path d="m2 2 20 20"/>';

// Hiện / ẩn mật khẩu
export const togglePassword = () => {
  const input = document.getElementById('password');
  const btn   = document.getElementById('togglePass');
  const icon  = document.getElementById('eyeIcon');
  const show  = input.type === 'password';
  input.type = show ? 'text' : 'password';
  btn.setAttribute('aria-label', show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
  icon.innerHTML = show ? EYE_CLOSED : EYE_OPEN;
};