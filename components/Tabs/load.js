// 缓存已加载的内容
const cache = {};

// 获取新闻列表
async function fetchNewsList() {
  try {
    // const {data} = await fetch(
    //   'https://newsapi.org/v2/everything?q=Apple&from=2025-03-06&sortBy=popularity&apiKey=2a8213bad8204df2a0129b22909fb947'
    //   // "https://api.gamestrial.com/topBuzz_new_list?origin=toutiao_pc&_signature=_02B4Z6wo00f01-9ROewAAIDCMArKoWwjmqvvdT1AAJwcS3u0cjSp3jqACjaQEHIw5VmUbe3RTMjkdJF3jm0BF0mDYUpCuzdvyN6EUDftDB2cqOIP5pQTD22tUKTntU85-FBHLQqY-IufddWi0c"
    // );
    const { articles } = await $.ajax({
      url: "https://api.gamestrial.com/topBuzz_new_list",
      method: "GET",
    });
    console.log(articles[0].content);
    return articles;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

// 生成新闻内容
function generateNewsContent(newsList) {
  const swiper = $(".swiper-wrapper");
  console.log(swiper);

  const swiperItems = newsList
    .splice(0, 3)
    .map(
      (i) => `
     <div class="swiper-slide">
          <div class="header">
            ${i.title}
          </div>
          <img
            src="${i.urlToImage}"
            alt="Banner 1"
          />
        </div>`
    )
    .join("");

  swiper.html(swiperItems);
  //Swiper 轮播图
  new Swiper(".swiper", {
    loop: true,
    pagination: { el: ".swiper-pagination", clickable: true },
    // autoplay: { delay: 3000, disableOnInteraction: false },
  });
  const cards = newsList
    .splice(3, 2)
    .map(
      (i) => `
      <div class="card">
        <a href="./details.html?id=${new Date().getTime()}">
          <img src="${i.urlToImage}" alt="编辑精选" class="w-full h-[126px]" />
          <h3 class='tru-3'>${i.title}</h3>
        </a>
      </div>
    `
    )
    .join("");

  const items = newsList
    .map((i) => {
      const hasThreeImages = false; //i.Image.url_list.length >= 3;
      const hasOneImage = true; //i.Image.url_list.length >= 1;

      return `
        <div class="list-card w-100vw">
          <a href="${i.url}" class='navigator2Detail' target='_blank'>
            ${
        // hasThreeImages
        //   ?
        // ` <div class="list-card-header">${i.Title}</div>
        //   <div class="flex justify-start items-center !m-[2px]">
        //     ${i.Image.url_list
        //       .map((img) =>`<img src="${img.url}" class="object-cover rounded-md w-[110px] h-[76px] mr-[10px]" />`).join("")}
        //   </div>
        //   <div class="text-[#999] text-[12px]">
        //       <span class="flex items-center justify-between">
        //         12小时前，52评论
        //       <span class='flex items-center justify-between'>99 <img src="/assets/like.png" width="12" height="12" class="inline-block ml-[2px]" /></span>
        //     </span>
        //   </div>`
        //   : hasOneImage
        //   ?
        ` <div class="list-card-header flex justify-between">
                      <div class="flex flex-col justify-between flex-1 mr-[6px]">
                        <div class="tru-2 min-h-[46px]">${i.title}</div>
                        <div class="text-[#999] text-[12px]">
                            <span class="flex items-center justify-between">
                              12小时前，52评论
                              <span class='flex items-center justify-between'>99 <img src="/assets/like.png" width="12" height="12" class="inline-block ml-[2px]" /></span>
                            </span>
                        </div>
                      </div>
                      <img src="${i.urlToImage}" class="object-cover rounded-md w-[110px] h-[76px]" />
                    </div>
            `
        //      :` <div class="list-card-header max-h-[44px] tru-2">${i.Title}</div>
        //         <div class="text-[#999] text-[12px]">
        //             <span class="flex items-center justify-between">
        //               12小时前，52评论
        //             <span class='flex items-center justify-between'>99 <img src="/assets/like.png" width="12" height="12" class="inline-block ml-[2px]" /></span>
        //           </span>
        //         </div>`
        }
          </a>
        </div>
      `;
    })
    .join("");

  return `<div class="grid">${cards}</div><div>${items}</div>`;
}

// 切换 Tab
async function switchTab(index) {
  const tabs = document.querySelectorAll(".tabs-nav li");
  const panes = document.querySelectorAll(".tab-pane");

  tabs.forEach((tab) => tab.classList.remove("active"));
  panes.forEach((pane) => pane.classList.remove("active"));

  tabs[index].classList.add("active");
  panes[index].classList.add("active");

  const pane = panes[index];

  // 首次切换加载数据
  if (!cache[index]) {
    switch (index) {
      case 0:
        const newsList = await fetchNewsList();
        cache[index] = generateNewsContent(newsList);
        console.log($('.navigator2Detail'));
        break;
      default:
        cache[
          index
        ] = `<div class="custom-content">这里是 ${tabs[index].innerText} 内容</div>`;
        break;
    }
  }

  pane.innerHTML = cache[index];
}

// 刷新当前 Tab
async function refreshTab(index) {
  const panes = document.querySelectorAll(".tab-pane");
  panes[index].innerHTML = `<div class="loader m-auto mt-[150px]"></div>`;
  switch (index) {
    case 0:
      const newsList = await fetchNewsList();
      cache[index] = generateNewsContent(newsList);
      break;
    default:
      cache[
        index
      ] = `<div class="custom-content">这里是 ${tabs[index].innerText} 内容（已刷新）</div>`;
      break;
  }

  document.querySelector(`.tab-pane[data-index="${index}"]`).innerHTML =
    cache[index];
}

// 自动加载
$(function () {
  loadTabs("tabs-placeholder", "/components/Tabs/index.html");
  function loadTabs(placeholderId, tabbarPath) {
    const absolutePath = `${window.location.origin}${tabbarPath}`;
    $.ajax({
      url: absolutePath,
      method: "GET",
    }).done(async (data) => {
      const $placeholder = $(`#${placeholderId}`);
      if ($placeholder.length) {
        $placeholder.html(data);

        // 绑定 Tab 切换事件
        document.querySelectorAll(".tabs-nav li").forEach((tab, index) => {
          tab.addEventListener("click", () => {
            if (tab.classList.contains("active")) {
              refreshTab(index);
            } else {
              switchTab(index);
            }
          });
        });

        switchTab(0);
      }
    });
  }
});
