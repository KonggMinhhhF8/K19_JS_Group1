const login = async (email, password) => {
  try {
    const response = await fetch(
      "https://wo365ovs53.execute-api.ap-southeast-1.amazonaws.com/auth/signin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      },
    );
    if (!response.ok) {
      const error = await response.json();
      console.log(error);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

const handelLogin = async () => {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) {
    console.log("Không tìm thấy form đăng nhập trên trang này, bỏ qua...");
    return;
  }
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const data = await login(email, password);
    if (data) {
      const { accessToken, refreshToken } = data;
      console.log("acesstokken :", accessToken);
      console.log("refesh token ", refreshToken);

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      window.location.href = "http://127.0.0.1:5500/app/index.html";
    } else {
      console.log("Đăng nhập thất bại");
    }
  });
};
handelLogin();
