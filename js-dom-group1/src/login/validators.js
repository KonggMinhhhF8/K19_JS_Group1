// login/validators.js — kiểm tra dữ liệu nhập phía client

export const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

// Trả về { field, message } nếu có lỗi, hoặc null nếu hợp lệ
export const validateLoginForm = (email, password) => {
  if (!email.trim())        return { field: 'email',    message: 'Vui lòng nhập email.' };
  if (!isValidEmail(email)) return { field: 'email',    message: 'Email không hợp lệ.' };
  if (!password.trim())     return { field: 'password', message: 'Vui lòng nhập mật khẩu.' };
  return null;
};