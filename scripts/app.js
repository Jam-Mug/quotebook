// import { baseQuotes } from "quotes.js";

let isAnimating = false;

function loadUserQuotes() {
  let stored = [];
  try {
    const raw = localStorage.getItem("userQuotes");
    if (raw) stored = JSON.parse(raw);
  } catch (e) {
    console.warn("Invalid userQuotes in localStorage, resetting", e);
    stored = [];
    localStorage.removeItem("userQuotes");
  }
  baseQuotes.users = stored.map((q) => ({
    text: q.text,
    author: q.authorName || "Аноним",
  }));
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

const seen = {};
Object.keys(baseQuotes).forEach((cat) => (seen[cat] = new Set()));
let currentCategory = null;

const slogan = document.getElementById("slogan");
const quoteCard = document.getElementById("quoteCard");
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const authorPhoto = document.getElementById("authorPhoto");
const nextBtn = document.getElementById("nextBtn");
const catButtons = document.querySelectorAll(".categories button");
const ambassarBtn = document.getElementById("ambassarBtn");
const regModal = document.getElementById("regModal");
const sidePanel = document.getElementById("sidePanel");
const overlayDim = document.getElementById("overlayDim");
const closePanel = document.getElementById("closePanel");
const userInfo = document.getElementById("userInfo");
const userQuotesContainer = document.getElementById("userQuotesContainer");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteText = document.getElementById("newQuoteText");

function openSidePanel() {
  if (sidePanel) sidePanel.classList.add("active");
  if (overlayDim) overlayDim.classList.add("active");
}

ambassarBtn.addEventListener("click", () => {
  const user = getUser();
  if (user) {
    openSidePanel();
  } else {
    if (regModal) regModal.classList.add("active");
  }
});

catButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    catButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.cat;
    if (slogan) slogan.style.display = "none";
    if (quoteCard) quoteCard.classList.add("active");
    if (nextBtn) nextBtn.style.display = "block";
    loadUserQuotes();
    seen[currentCategory].clear();
    if (quoteCard) {
      quoteCard.classList.remove("slide-in-right", "slide-out-left");
    }
    isAnimating = false;
    showRandomQuote(false);
  });
});

function showRandomQuote(animate = true) {
  if (!currentCategory || !baseQuotes[currentCategory]) return;

  const pool = baseQuotes[currentCategory];
  const seenSet = seen[currentCategory];

  if (pool.length === 0) {
    if (quoteText)
      quoteText.textContent = '"Здесь пока нет цитат. Станьте первым!"';
    if (quoteAuthor) quoteAuthor.textContent = "Цитатник";
    if (authorPhoto) authorPhoto.textContent = "?";
    return;
  }

  if (seenSet.size >= pool.length) seenSet.clear();

  const updateCardContent = () => {
    let index;
    do {
      index = Math.floor(Math.random() * pool.length);
    } while (seenSet.has(index));
    seenSet.add(index);

    const q = pool[index];
    if (quoteText) quoteText.textContent = '"' + q.text + '"';
    if (quoteAuthor) quoteAuthor.textContent = q.author;
    if (authorPhoto) authorPhoto.textContent = q.author.charAt(0);
  };

  if (animate && !isAnimating && quoteCard) {
    isAnimating = true;
    quoteCard.classList.remove("slide-in-right", "slide-out-left");
    quoteCard.classList.add("slide-out-left");

    const onOutEnd = () => {
      quoteCard.removeEventListener("animationend", onOutEnd);
      updateCardContent();
      quoteCard.classList.remove("slide-out-left");
      quoteCard.classList.add("slide-in-right");

      const onInEnd = () => {
        quoteCard.removeEventListener("animationend", onInEnd);
        quoteCard.classList.remove("slide-in-right");
        isAnimating = false;
      };
      quoteCard.addEventListener("animationend", onInEnd);
    };
    quoteCard.addEventListener("animationend", onOutEnd);

    setTimeout(() => {
      if (isAnimating) isAnimating = false;
    }, 1000);
  } else {
    updateCardContent();
  }
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => showRandomQuote(true));
}


const closeRegModalBtn = document.getElementById("closeRegModal");

if (closeRegModalBtn) {
  closeRegModalBtn.addEventListener("click", () => {
    const regModal = document.getElementById("regModal");
    const overlayDim = document.getElementById("overlayDim");

    if (regModal) regModal.classList.remove("active");
    if (overlayDim) overlayDim.classList.remove("active");
  });
}


loadUserQuotes();
