function loadTabbar(placeholderId, tabbarPath) {
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
        const homeIcon = document.querySelector("#home-icon");
        const myIcon = document.querySelector("#my-icon");
        const pathname = location.pathname;
        if (homeIcon && myIcon) {
          if (pathname?.includes("my")) {
            homeIcon.src = "/assets/home.png";
            myIcon.src = "/assets/my-active.png";
          } else {
            homeIcon.src = "/assets/home-active.png";
            myIcon.src = "/assets/my.png";
          }
        }
      } else {
        console.error(`占位符元素 #${placeholderId} 未找到`);
      }
    })
    .catch((error) => console.error("加载 Tabbar 失败:", error));
}

// 自动加载
document.addEventListener("DOMContentLoaded", function () {
  // 使用绝对路径加载 Tabbar.html
  loadTabbar("tabbar-placeholder", "/components/Tabbar/Tabbar.html");
});
