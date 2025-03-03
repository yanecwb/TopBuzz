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
        // 获取元素
        const tabs = document.querySelectorAll('.tabs-nav li');
        const panes = document.querySelectorAll('.tab-pane');

        // 切换选项卡函数
        function switchTab(clickedTab, index) {
          // 移除所有标签和内容的激活状态
          tabs.forEach(tab => tab.classList.remove('active'));
          panes.forEach(pane => pane.classList.remove('active'));

          // 添加当前激活状态
          clickedTab.classList.add('active');
          panes[index].classList.add('active');
        }

        // 为每个标签添加点击事件
        tabs.forEach((tab, index) => {
          tab.addEventListener('click', () => {
            switchTab(tab, index);
          });
        });
      } else {
        console.error(`占位符元素 #${placeholderId} 未找到`);
      }
    })
    .catch((error) => console.error("加载 Tabbar 失败:", error));
}

// 自动加载
document.addEventListener("DOMContentLoaded", function () {
  // 使用绝对路径加载 Tabbar.html
  loadTabbar("tabs-placeholder", "/components/Tabs/index.html");
});
