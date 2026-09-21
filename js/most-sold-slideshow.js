import { loadMostSoldImages } from "./most-sold-store.js";

const INTERVAL_MS = 4000;
let timer = null;

const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[char]));

function render(target, images, index) {
  const current = images[index];
  if (!current) {
    target.innerHTML = '<img src="assets/gifty-hampers.png" alt="Gifty Hamper" loading="eager">';
    return;
  }

  const dots = images.map((_, dotIndex) =>
    '<button type="button" class="most-sold-dot' + (dotIndex === index ? ' active' : '') +
    '" data-most-sold-index="' + dotIndex + '" aria-label="Show slide ' + (dotIndex + 1) + '"></button>'
  ).join("");

  target.innerHTML =
    '<div class="most-sold-slideshow-frame">' +
      '<img class="most-sold-slide-image" src="' + escapeHtml(current.url) + '" alt="Gifty Hamper gift collection" loading="eager">' +
      '<button type="button" class="most-sold-arrow most-sold-arrow-left" data-most-sold-prev aria-label="Previous image">‹</button>' +
      '<button type="button" class="most-sold-arrow most-sold-arrow-right" data-most-sold-next aria-label="Next image">›</button>' +
      '<div class="most-sold-dots" aria-label="Slideshow navigation">' + dots + '</div>' +
    '</div>';
}

async function init() {
  const target = document.querySelector("#most-sold-slideshow");
  if (!target) return;

  let images = [];
  try {
    images = await loadMostSoldImages();
  } catch (error) {
    console.error("Most sold slideshow load error:", error);
  }

  if (!images.length) {
    target.innerHTML = '<img src="assets/gifty-hampers.png" alt="Gifty Hamper" loading="eager">';
    return;
  }

  let index = Math.floor(Math.random() * images.length);

  const show = nextIndex => {
    index = (nextIndex + images.length) % images.length;
    render(target, images, index);
  };

  const randomNext = () => {
    if (images.length < 2) return;
    let next = Math.floor(Math.random() * images.length);
    while (next === index) next = Math.floor(Math.random() * images.length);
    show(next);
  };

  render(target, images, index);

  target.addEventListener("click", event => {
    const nextButton = event.target.closest("[data-most-sold-next]");
    const prevButton = event.target.closest("[data-most-sold-prev]");
    const dot = event.target.closest("[data-most-sold-index]");

    if (nextButton) {
      randomNext();
      resetTimer();
    } else if (prevButton) {
      show(index - 1);
      resetTimer();
    } else if (dot) {
      show(Number(dot.dataset.mostSoldIndex) || 0);
      resetTimer();
    }
  });

  function resetTimer() {
    window.clearInterval(timer);
    timer = window.setInterval(randomNext, INTERVAL_MS);
  }

  resetTimer();
}

document.addEventListener("DOMContentLoaded", init);
