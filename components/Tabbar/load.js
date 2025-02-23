function loadTabbar(placeholderId, tabbarPath) {
  console.log(" Initia  Ton Evm");
  // 确保使用绝对路径
  const absolutePath = `${window.location.origin}${tabbarPath}`;

  fetch(absolutePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      const placeholder = document.getElementById(placeholderId);
      if (placeholder) {
        placeholder.innerHTML = data;
      } else {
        console.error(`占位符元素 #${placeholderId} 未找到`);
      }
    })
    .catch((error) => console.error("加载 Tabbar 失败:", error));
}

// 自动加载
// document.addEventListener("DOMContentLoaded", function () {
// 使用绝对路径加载 Tabbar.html
loadTabbar("tabbar-placeholder", "/public/components/Tabbar/Tabbar.html");
// });
