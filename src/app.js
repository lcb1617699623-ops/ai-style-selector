import { createEffect } from "./effects.js";

const root = new URL("../", import.meta.url);
const directory = new URL("?view=home", root);
const query = new URLSearchParams(location.search);
const forcedMode = query.get("mode");
if (["mobile", "desktop"].includes(forcedMode) && !document.documentElement.dataset.mode) {
  document.documentElement.dataset.mode = forcedMode;
}

const labels = [
  "水墨写意风格", "二次元动漫风格", "美式Q版风格",
  "线稿上色", "铅笔线稿风格", "像素艺术风格",
  "油画风格", "赛朋克未来风格", "水彩画风格",
];

function makeArtwork(kind, className) {
  return [0, 1, 2].map((variant) =>
    `<img class="${className} artwork-${variant}" alt="" src="${new URL(`assets/${kind}-${variant}.svg`, root)}" draggable="false">`
  ).join("");
}

function renderDirectory(app) {
  document.title = "原型演示目录";
  const modes = [
    { name: "手机", resolution: "390 × 844", icon: "phone", url: new URL("?mode=mobile", root) },
    { name: "电脑", resolution: "1440 × 900", icon: "screen", url: new URL("?mode=desktop", root) },
    { name: "设备", resolution: "1920 × 1080", icon: "screen", url: new URL("device/", root) },
  ];
  app.className = "directory";
  app.innerHTML = `
    <header class="directory-header">
      <p class="eyebrow">高保真原型</p>
      <h1>原型演示目录</h1>
      <p>选择设备，进入样式选择页。点击样式卡片即可选中或改选。</p>
    </header>
    <div class="directory-grid">
      ${modes.map(({ name, resolution, icon, url }) => `
        <section class="directory-card" aria-label="${name}">
          <span class="device-icon ${icon}" aria-hidden="true"></span>
          <h2>${name}</h2>
          <p>${resolution}</p>
          <p>样式选择与页面导航</p>
          <a href="${url}" aria-label="进入${name}原型">进入原型</a>
        </section>`).join("")}
    </div>
    <a class="automatic-link" href="${root}">按当前屏幕自动适配</a>`;
}

function renderSelector(app) {
  app.className = "selector";
  const atlas = new URL("assets/tiles.png", root);
  app.innerHTML = `
    <nav class="navigation" aria-label="页面导航">
      <a href="${directory}">返回</a>
      <a href="${directory}">主页</a>
    </nav>
    <header class="banner">
      ${makeArtwork("banner", "banner-art")}
      <h1>选择要生成的样式</h1>
    </header>
    <div class="style-grid" role="group" aria-label="生成样式">
      ${labels.map((label, index) => `
        <button type="button" class="style-card" data-index="${index}" aria-pressed="false">
          <span class="style-icon">
            <span class="style-image">
              <img src="${atlas}" alt="" draggable="false"
                   style="--crop-x:${-(1.55 + index % 3 * 103.2)}%;--crop-y:${-(1.55 + Math.floor(index / 3) * 103.2)}%">
            </span>
            <span class="check-mark" aria-hidden="true">
              <svg viewBox="0 0 20 20" width="16" height="16"><path d="m5 10 3 3 7-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
          </span>
          <span class="style-label">${label}</span>
        </button>`).join("")}
    </div>
    <footer class="ornament">${makeArtwork("footer", "ornament-art")}</footer>`;
  wireSelection(app.querySelector(".style-grid"));
}

function wireSelection(grid) {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let activeEffect = null;
  let selected = null;
  let press = null;

  function stopEffect() {
    activeEffect?.remove();
    activeEffect = null;
  }

  function releasePress() {
    press?.card.classList.remove("is-pressed");
    press = null;
  }

  function startPress(card, pointer) {
    releasePress();
    stopEffect();
    press = { card, pointer };
    card.classList.add("is-pressed");
  }

  for (const card of grid.querySelectorAll(".style-card")) {
    card.addEventListener("pointerdown", (event) => {
      if (event.button === 0 && event.isPrimary) startPress(card, event.pointerId);
    });
    card.addEventListener("pointerleave", (event) => {
      if (press?.pointer === event.pointerId) releasePress();
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === " " && !event.repeat) startPress(card, null);
    });
    card.addEventListener("keyup", (event) => {
      if (event.key === " " && press?.card === card) releasePress();
    });
    card.addEventListener("blur", () => {
      if (press?.card === card) releasePress();
    });
    card.addEventListener("click", () => {
      releasePress();
      stopEffect();
      selected?.setAttribute("aria-pressed", "false");
      card.setAttribute("aria-pressed", "true");
      selected = card;
      if (reducedMotion.matches) return;

      const effect = createEffect(Number(card.dataset.index));
      activeEffect = effect;
      card.querySelector(".style-icon").append(effect);
      effect.addEventListener("animationend", (event) => {
        if (event.target === effect && activeEffect === effect) stopEffect();
      });
    });
  }

  for (const type of ["pointerup", "pointercancel"]) {
    window.addEventListener(type, (event) => {
      if (press?.pointer === event.pointerId) releasePress();
    });
  }
  window.addEventListener("blur", releasePress);
  reducedMotion.addEventListener("change", stopEffect);
}

const app = document.querySelector("#app");
if (query.get("view") === "home") renderDirectory(app);
else renderSelector(app);
