export const renderHomeLayout = () => {
  document.body.innerHTML = "";
  const h2 = document.createElement("h2");
  h2.className = "text-2xl font-bold p-8";
  h2.innerText = "Trang chủ Home";

  document.body.appendChild(h2);
  console.log("Đang vào trang chủ Home");
};
