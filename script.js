// ---------- Config ----------
const CONFETTI_DURATION_MS = 10000; // 10s
const BIRTHDAY_AUDIO_ID = "birthday-audio";
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwGcTuNZwziMkVSPvs2QVJbyA9f_BBCPPV9i0wh5SOH2f_Y2ZE7PaQuDtMFV0Z/exec";

// ---------- Menu toggle ----------
const menuBtn = document.getElementById("menu-btn");
const menuOverlay = document.getElementById("menu-overlay");
const closeMenu = document.getElementById("close-menu");

function toggleMenu() {
  if (!menuOverlay) return;
  const isVisible = menuOverlay.style.display === "flex";
  menuOverlay.style.display = isVisible ? "none" : "flex";
}

if (menuBtn) menuBtn.addEventListener("click", toggleMenu);
if (closeMenu) closeMenu.addEventListener("click", toggleMenu);

if (menuOverlay) {
  menuOverlay.addEventListener("click", (e) => {
    if (e.target === menuOverlay) menuOverlay.style.display = "none";
  });
}

// ---------- Helpers ----------
async function loadJSON(path) {
  try {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

// ---------- Members ----------
function renderMembers(members) {
  const grid = document.getElementById("members-grid");
  if (!grid) return;
  grid.innerHTML = "";

  members.forEach(m => {
    const links = [];
    if (m.links?.portfolio) links.push(`<a href="${m.links.portfolio}" target="_blank"><i class="fa-solid fa-car"></i></a>`);
    if (m.links?.facebook)  links.push(`<a href="${m.links.facebook}" target="_blank"><i class="fa-brands fa-facebook"></i></a>`);
    if (m.links?.instagram) links.push(`<a href="${m.links.instagram}" target="_blank"><i class="fa-brands fa-instagram"></i></a>`);
    if (m.links?.email)     links.push(`<a href="mailto:${m.links.email}"><i class="fa-solid fa-envelope"></i></a>`);

    const card = el(`
      <article class="item admin-card">
        <div class="row">
          ${m.avatar ? `<img class="avatar" src="${m.avatar}" alt="${m.name}">` : ""}
          <div>
            <h3>${m.name}</h3>
            <p>${m.role ?? "Admin"}</p>
          </div>
        </div>
        ${m.bio ? `<p style="margin-top:10px">${m.bio}</p>` : ""}
        ${links.length ? `<div class="social-links">${links.join("")}</div>` : ""}
        ${Array.isArray(m.tags) && m.tags.length && m.tags[0] !== "" ? `<div class="badge">${m.tags.join(" • ")}</div>` : ""}
      </article>
    `);

    grid.appendChild(card);
  });

  const adminCount = document.getElementById("adminCount");
  if (adminCount) adminCount.textContent = members.length;
}

// ---------- Pookies ----------
function renderPookies(pookies) {
  const grid = document.getElementById("pookies-grid");
  if (!grid) return;
  grid.innerHTML = "";

  pookies.forEach(p => {
    const links = [];
    if (p.links?.portfolio) links.push(`<a href="${p.links.portfolio}" target="_blank"><i class="fa-solid fa-globe"></i></a>`);
    if (p.links?.facebook)  links.push(`<a href="${p.links.facebook}" target="_blank"><i class="fa-brands fa-facebook"></i></a>`);
    if (p.links?.instagram) links.push(`<a href="${p.links.instagram}" target="_blank"><i class="fa-brands fa-instagram"></i></a>`);
    if (p.links?.email)     links.push(`<a href="mailto:${p.links.email}"><i class="fa-solid fa-envelope"></i></a>`);

    const card = el(`
      <article class="item pookie-card">
        <div class="row">
          ${p.avatar ? `<img class="avatar" src="${p.avatar}" alt="${p.name}">` : ""}
          <div>
            <h3>${p.name}</h3>
            <p>${p.role ?? "Member"}</p>
          </div>
        </div>
        ${p.bio ? `<p style="margin-top:10px">${p.bio}</p>` : ""}
        ${links.length ? `<div class="social-links">${links.join("")}</div>` : ""}
        ${Array.isArray(p.tags) && p.tags.length && p.tags[0] !== "" ? `<div class="badge pookie-badge">${p.tags.join(" • ")}</div>` : ""}
      </article>
    `);

    grid.appendChild(card);
  });

  const memberCount = document.getElementById("memberCount");
  if (memberCount) memberCount.textContent = pookies.length;
}

// ---------- Total Count ----------
async function getCount() {
  try {
    const members = await loadJSON("/data/members.json");
    const pookies = await loadJSON("/data/pookies.json");
    const total = (members?.length || 0) + (pookies?.length || 0);

    const totalCountEl = document.getElementById("totalCount");
    if (totalCountEl) totalCountEl.textContent = total;
  } catch (err) {
    console.error("Count error:", err);
    const totalCountEl = document.getElementById("totalCount");
    if (totalCountEl) totalCountEl.textContent = "Error";
  }
}

// ---------- Confetti + Audio ----------
function launchCardConfetti(container, ms = CONFETTI_DURATION_MS) {
  if (typeof confetti !== "function" || !container) return;

  const canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "10",
  });
  if (getComputedStyle(container).position === "static") {
    container.style.position = "relative";
  }
  container.appendChild(canvas);

  const c = confetti.create(canvas, { resize: true });
  const end = Date.now() + ms;

  (function frame() {
    c({ particleCount: 10, spread: 50, startVelocity: 30, origin: { x: 0 } });
    c({ particleCount: 10, spread: 50, startVelocity: 30, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
    else canvas.remove();
  })();
}

function getBirthdayAudio() {
  return document.getElementById(BIRTHDAY_AUDIO_ID);
}

async function playBirthdayAudio() {
  const audio = getBirthdayAudio();
  if (!audio) return;
  try {
    audio.currentTime = 0;
    await audio.play();
  } catch (e) {}
}
// ---------- Anonymous Messages (Google Sheet) ----------
let anonMessages = [];
const anonMessagesWrap = document.getElementById("anonMessages");
const seeAllBtn = document.getElementById("seeAnonBtn");
const anonMessagesWrapper = document.getElementById("anonMessagesWrapper");
const messageModal = document.getElementById("messageModal");
const fullMessageText = document.getElementById("fullMessageText");
const closeModal = document.getElementById("closeModal");

// Fetch messages from Google Sheet
async function fetchAnonMessages() {
  try {
    const res = await fetch(GOOGLE_SHEET_URL);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.reverse() : [];
  } catch (err) {
    console.error("Anonymous messages fetch error:", err);
    return [];
  }
}

// Render messages as cards (preview first 20 lines)
function renderAnonMessages() {
  if (!anonMessagesWrap) return;
  anonMessagesWrap.innerHTML = "";

  anonMessages.forEach((msg, idx) => {
    const card = document.createElement("div");
    card.classList.add("item", "anon-card");
    const preview = msg.message.split("\n").slice(0, 20).join("\n");
    card.innerHTML = `<p>${preview}</p>`;
    card.addEventListener("click", () => openMessageModal(idx));
    anonMessagesWrap.appendChild(card);
  });
}

// Open modal for full message
function openMessageModal(idx) {
  if (!messageModal || !fullMessageText) return;
  const msg = anonMessages[idx];
  fullMessageText.innerHTML = `
    <div style="background:#ffd3e8;padding:20px;border-radius:16px;max-height:80vh;overflow-y:auto;white-space:pre-wrap;">
      <p>${msg.message}</p>
    </div>
  `;
  messageModal.classList.remove("hidden");
  document.body.style.filter = "blur(5px)"; // blur background
}

// Close modal
if (closeModal) {
  closeModal.addEventListener("click", () => {
    messageModal.classList.add("hidden");
    document.body.style.filter = "none";
  });
}

// "See All Anonymous Messages" button
if (seeAllBtn) {
  seeAllBtn.addEventListener("click", async () => {
    seeAllBtn.style.display = "none";
    anonMessagesWrapper.classList.remove("hidden");
    anonMessages = await fetchAnonMessages();
    renderAnonMessages();
  });
}

// Handle form submission
const anonForm = document.getElementById("anonForm");
if (anonForm) {
  anonForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("anonName").value.trim() || "Anonymous";
    const message = document.getElementById("anonWriting").value.trim();
    if (!message) return alert("Please write a message.");

    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message })
      });
      alert("Message submitted!");
      anonForm.reset();
      if (!anonMessagesWrapper.classList.contains("hidden")) {
        anonMessages = await fetchAnonMessages();
        renderAnonMessages();
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit. Try again.");
    }
  });
}

// ---------- Birthdays ----------
function isTodayDOB(dob) {
  const d = new Date(dob);
  if (isNaN(d)) return false;
  const today = new Date();
  return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
}

function nextOccurrence(dob) {
  const d = new Date(dob);
  const today = new Date();
  let next = new Date(today.getFullYear(), d.getMonth(), d.getDate());
  if (next < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    next.setFullYear(today.getFullYear() + 1);
  }
  return next;
}

function formatDayMonth(date) {
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

let birthdayAudioStarted = false;

async function renderBirthdays() {
  const todayWrap = document.getElementById("today-birthday");
  const upcomingWrap = document.getElementById("upcoming-birthdays");
  if (!todayWrap || !upcomingWrap) return;

  try {
    const list = await loadJSON("/data/birthdays.json");
    if (!Array.isArray(list)) return;

    const todays = list.filter(b => b.dob && isTodayDOB(b.dob));
    const upcoming = list
      .filter(b => b.dob && !isTodayDOB(b.dob))
      .map(b => ({ ...b, _next: nextOccurrence(b.dob) }))
      .sort((a, b) => a._next - b._next);

    if (todays.length === 0) {
      todayWrap.appendChild(el(`<p style="color:#6b7280;margin:0">No birthdays today.</p>`));
    } else {
      todays.forEach(b => {
        const msg = b.bio && String(b.bio).trim().length
          ? b.bio
          : `Wishing you many many happy returns of the day. We all love you from the heart. You are such a pookie 🎀! <br> - Pinky Way family.`;

        const card = el(`
          <div class="birthday-row">
            <div class="birthday-left">
              <img class="birthday-avatar" src="${b.avatar || ''}" alt="${b.name}" style="width:140px;height:140px;object-fit:cover;border-radius:16px;border:3px solid #ff80ab;">
            </div>
            <div class="birthday-text">
              <h3 style="font-size:28px;margin:0 0 10px">Happy Birthday 🎉</h3>
              <b><p style="margin:0 0 6px"><strong>${b.name}</strong></p></b>
              <p class="birthday-bio" style="margin:0">${msg}</p>
            </div>
          </div>
        `);

        todayWrap.appendChild(card);
        launchCardConfetti(card, CONFETTI_DURATION_MS);
        if (!birthdayAudioStarted) {
          playBirthdayAudio();
          birthdayAudioStarted = true;
        }
      });
    }

    const upcomingLimited = upcoming.slice(0, 1);
    if (upcomingLimited.length === 0) {
      upcomingWrap.appendChild(el(`<p style="color:#6b7280;margin:0">No upcoming birthdays.</p>`));
    } else {
      upcomingLimited.forEach(b => {
        const when = formatDayMonth(b._next);
        upcomingWrap.appendChild(el(`
          <div class="upcoming-card">
            <img class="birthday-avatar" src="${b.avatar || ''}" alt="${b.name}" style="width:54px;height:54px;border-radius:50%;object-fit:cover;">
            <p style="margin:0"><strong>${b.name}</strong><br>${when}</p>
          </div>
        `));
      });
    }
  } catch (err) {
    console.error("Birthday load error:", err);
  }
}

// ---------- Re-confetti on touch/click ----------
function setupReconfettiTriggers() {
  const section = document.getElementById("birthday-section");
  if (!section) return;
  const retrigger = () => {
    launchCardConfetti(section, CONFETTI_DURATION_MS);
    playBirthdayAudio();
  };
  ["pointerdown", "click", "touchstart"].forEach(evt => {
    section.addEventListener(evt, retrigger, { passive: true });
  });
}

// ---------- Init ----------
(async () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  const members = await loadJSON("/data/members.json");
  renderMembers(members);

  const pookies = await loadJSON("/data/pookies.json");
  renderPookies(pookies);

  await getCount();
  await renderBirthdays();
  setupReconfettiTriggers();
})();
