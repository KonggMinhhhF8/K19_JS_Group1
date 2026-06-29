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
    return (data = await response.json());
  } catch (e) {
    console.log(e);
  }
};

const handelLogin = async () => {
  const loginForm = document.getElementById("loginForm");
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
      window.location.href =
        "http://127.0.0.1:5500/K19_JS_Group1/app/index.html";
      // router.navigate("/home");
    }
  });
};
handelLogin();
