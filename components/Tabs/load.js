const fetchNewsList = async () => {
  try {
    const response = await fetch(
      "https://api.gamestrial.com/topBuzz_new_list?origin=toutiao_pc&_signature=_02B4Z6wo00f01-9ROewAAIDCMArKoWwjmqvvdT1AAJwcS3u0cjSp3jqACjaQEHIw5VmUbe3RTMjkdJF3jm0BF0mDYUpCuzdvyN6EUDftDB2cqOIP5pQTD22tUKTntU85-FBHLQqY-IufddWi0c"
    );
    return (await response.json())?.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

function loadTabs(placeholderId, tabbarPath) {
  const absolutePath = `${window.location.origin}${tabbarPath}`;

  $.ajax({
    url: absolutePath,
    method: "GET",
  })
    .done(async (data) => {
      const $placeholder = $(`#${placeholderId}`);
      if ($placeholder.length) {
        $placeholder.html(data);

        // 元素选择器
        const $tabs = $(".tabs-nav li");
        const $panes = $(".tab-pane");

        // 切换选项卡函数
        const switchTab = async ($clickedTab, index) => {
          // 移除激活状态
          $tabs.removeClass("active");
          $panes.removeClass("active");

          // 添加激活状态
          $clickedTab.addClass("active");
          $panes.eq(index).addClass("active");

          // 生成内容
          const newsList = await fetchNewsList();
          window.newsList = newsList;

          // 生成卡片
          const cards = newsList
            .splice(3, 2)
            .map(
              (i) => `
          <div class="card">
            <a href="./details.html?id=${i.ClusterId}">
              <img src="${i.Image.url_list[0].url}" alt="编辑精选" class="w-full h-[126px]" />
              <h3>${i.Title}</h3>
            </a>
          </div>
        `
            )
            .join("");

          // 生成列表项
          const items = newsList
            .map((i) => {
              const hasThreeImages = i.Image.url_list.length >= 3;
              const hasOneImage = i.Image.url_list.length >= 1;

              return `
            <div class="list-card w-100vw">
              <a href="./details.html?id=${i.ClusterId}">
                ${hasThreeImages
                  ? `
                  <div class="list-card-header">${i.Title}</div>
                  <div class="flex justify-start items-center !m-[2px]">
                    ${i.Image.url_list
                    .map(
                      (img) => `
                      <img src="${img.url}" class="object-cover rounded-md w-[110px] h-[76px]" />
                    `
                    )
                    .join("")}
                  </div>
                `
                  : hasOneImage
                    ? `
                  <div class="list-card-header flex justify-between">
                    <div class="flex flex-col justify-between flex-1 mr-[6px]">
                      <div class="tru-2 min-h-[46px]">${i.Title}</div>
                      <div class="text-[#999] text-[12px]">
                        <span class="flex items-center justify-between">
                          12小时前，52评论
                          <span class='flex items-center justify-between'>99 <img src="/assets/like.png" width="12" height="12" class="inline-block ml-[2px]" /></span>
                        </span>
                      </div>
                    </div>
                    ${i.Image.url_list
                      .slice(0, 1)
                      .map(
                        (img) => `
                      <img src="${img.url}" class="object-cover rounded-md w-[110px] h-[76px]" />
                    `
                      )
                      .join("")}
                  </div>
                `
                    : `
                  <div class="list-card-header flex justify-between">
                    <div class="flex flex-col justify-between flex-1">
                      <div class="tru-2">${i.Title}</div>
                      <div class="text-[#999] text-[12px] flex-between-center">
                        <span>12小时前，52评论</span>
                        <span class="flex items-center">
                          99<img src="/assets/like.png" width="15" height="15" />
                        </span>
                      </div>
                    </div>
                  </div>
                `
                }
              </a>
            </div>
          `;
            })
            .join("");

          // 插入内容
          $panes.eq(index).html(`
          <div class="grid">${cards}</div>
          <div>${items}</div>
        `);
        };

        // 初始化第一个标签页
        await switchTab($tabs.first(), 0);

        // 绑定点击事件
        $tabs.on("click", function () {
          const index = $(this).index();
          switchTab($(this), index);
        });
      } else {
        console.error(`占位符元素 #${placeholderId} 未找到`);
      }

    })
    .fail((error) => {
      console.error("加载 Tabbar 失败:", error);
    });
}

// 自动加载
$(function () {
  loadTabs("tabs-placeholder", "/components/Tabs/index.html");
});
