// ---------- Config ----------
const CONFETTI_DURATION_MS = 10000; // 10s
const BIRTHDAY_AUDIO_ID = "birthday-audio";
const GOOGLE_SHEET_URL = "/api/messages"; // proxy API

// ---------- Menu toggle ----------
const menuBtn = document.getElementById("menu-btn");
const menuOverlay = document.getElementById("menu-overlay");
const closeMenu = document.getElementById("close-menu");

function toggleMenu() {
  if (!menuOverlay) return;
  menuOverlay.style.display = menuOverlay.style.display === "flex" ? "none" : "flex";
}

if (menuBtn) menuBtn.addEventListener("click", toggleMenu);
if (closeMenu) closeMenu.addEventListener("click", toggleMenu);
if (menuOverlay) {
  menuOverlay.addEventListener("click", e => { if (e.target === menuOverlay) menuOverlay.style.display = "none"; });
}

// ---------- Helpers ----------
async function loadJSON(path) {
  try {
    const res = await fetch(path, { cache: "no-store", mode: "cors" });
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
  } catch {
    const totalCountEl = document.getElementById("totalCount");
    if (totalCountEl) totalCountEl.textContent = "Error";
  }
        }

// ---------- Part 2: Confetti + Birthday Section (Bangladesh time) ----------

// ---------- Confetti helpers ----------
function launchCardConfetti(container, ms = CONFETTI_DURATION_MS) {
  // keep compatibility with both confetti.create and confetti() APIs
  if (!container || typeof confetti === "undefined") return;

  // if confetti.create exists (canvas mode) use that, else fallback to global confetti
  if (typeof confetti.create === "function") {
    const canvas = document.createElement("canvas");
    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "10",
    });
    if (getComputedStyle(container).position === "static") container.style.position = "relative";
    container.appendChild(canvas);

    const c = confetti.create(canvas, { resize: true });
    const end = Date.now() + ms;

    (function frame() {
      c({ particleCount: 8, spread: 50, startVelocity: 30, origin: { x: Math.random() } });
      if (Date.now() < end) requestAnimationFrame(frame);
      else canvas.remove();
    })();
    return;
  }

  // fallback (global confetti function)
  const end = Date.now() + ms;
  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

// simple wrapper to retrigger confetti on a container
function triggerConfettiOn(container, ms = CONFETTI_DURATION_MS) {
  try { launchCardConfetti(container, ms); } catch (e) { /* ignore */ }
}

// ---------- Audio ----------
function getBirthdayAudio() { return document.getElementById(BIRTHDAY_AUDIO_ID); }
async function playBirthdayAudio() {
  const audio = getBirthdayAudio();
  if (!audio) return;
  try { audio.currentTime = 0; await audio.play(); } catch (e) { /* autoplay may fail */ }
}

// ---------- Bangladesh time helpers ----------
function getBangladeshToday() {
  // returns a Date object representing now in Asia/Dhaka timezone
  const nowStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
  return new Date(nowStr);
}

function isTodayDOB(dob) {
  // dob can be 'YYYY-MM-DD' or similar — create Date from it
  const d = new Date(dob);
  if (isNaN(d)) return false;
  const today = getBangladeshToday();
  return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
}

function nextOccurrence(dob) {
  const d = new Date(dob);
  const today = getBangladeshToday();
  let next = new Date(today.getFullYear(), d.getMonth(), d.getDate());
  // compare by date value (midnight local)
  if (next < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    next.setFullYear(today.getFullYear() + 1);
  }
  return next;
}

function formatDayMonth(date) {
  // accept Date or timestamp
  const dt = (date instanceof Date) ? date : new Date(date);
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

// ---------- Birthday renderer (uses Bangladesh time) ----------
async function renderBirthdays() {
  const todayWrap = document.getElementById("today-birthday");
  const upcomingWrap = document.getElementById("upcoming-birthdays");
  if (!todayWrap || !upcomingWrap) return;

  try {
    const list = await loadJSON("/data/birthdays.json");
    if (!Array.isArray(list)) {
      todayWrap.innerHTML = `<p style="color:#6b7280;margin:0">No birthdays today.</p>`;
      upcomingWrap.innerHTML = `<p style="color:#6b7280;margin:0">No upcoming birthdays.</p>`;
      return;
    }

    // filter & compute next occurrences using BD time helpers
    const todays = list.filter(b => b.dob && isTodayDOB(b.dob));
    const upcoming = list
      .filter(b => b.dob && !isTodayDOB(b.dob))
      .map(b => ({ ...b, _next: nextOccurrence(b.dob) }))
      .sort((a, b) => a._next - b._next);

    // clear containers
    todayWrap.innerHTML = "";
    upcomingWrap.innerHTML = "";

    // render todays
    if (todays.length === 0) {
      todayWrap.appendChild(el(`<p style="color:#6b7280;margin:0">No birthdays today.</p>`));
    } else {
      todays.forEach(b => {
        const msg = b.bio?.trim().length ? b.bio : `Wishing you many happy returns of the day. We all love you! 🎀`;
        const card = el(`
          <div class="birthday-row">
            <div class="birthday-left"><img class="birthday-avatar" src="${b.avatar||''}" alt="${b.name}"></div>
            <div class="birthday-text">
              <h3 style="font-size:28px;margin:0 0 10px">Happy Birthday 🎉</h3>
              <p><strong>${b.name}</strong></p>
              <p class="birthday-bio" style="margin:0">${msg}</p>
            </div>
          </div>
        `);
        todayWrap.appendChild(card);
        // confetti & audio
        triggerConfettiOn(card, CONFETTI_DURATION_MS);
        if (!birthdayAudioStarted) { playBirthdayAudio(); birthdayAudioStarted = true; }
      });
    }

    // render upcoming (only next 1)
    const upcomingLimited = upcoming.slice(0, 1);
    if (upcomingLimited.length === 0) {
      upcomingWrap.appendChild(el(`<p style="color:#6b7280;margin:0">No upcoming birthdays.</p>`));
    } else {
      upcomingLimited.forEach(b => {
        const when = formatDayMonth(b._next);
        upcomingWrap.appendChild(el(`
          <div class="upcoming-card">
            <img class="birthday-avatar" src="${b.avatar||''}" alt="${b.name}">
            <p style="margin:0"><strong>${b.name}</strong><br>${when}</p>
          </div>
        `));
      });
    }
  } catch (err) {
    console.error("Birthday load error:", err);
    todayWrap.innerHTML = `<p style="color:#6b7280;margin:0">No birthdays today.</p>`;
    upcomingWrap.innerHTML = `<p style="color:#6b7280;margin:0">No upcoming birthdays.</p>`;
  }
}

// ---------- Auto-refresh at Bangladesh midnight ----------
function scheduleMidnightRefresh() {
  try {
    const now = getBangladeshToday();
    // create BD midnight of next day (setHours(24,0,0,...))
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = midnight.getTime() - now.getTime();

    // safety: if ms is invalid or negative, fallback to 1 hour
    const timeout = (msUntilMidnight > 0 && msUntilMidnight < 2147483647) ? msUntilMidnight : 3600000;

    setTimeout(() => {
      renderBirthdays();
      scheduleMidnightRefresh();
    }, timeout);
  } catch (e) {
    // fallback: try again in 1 hour
    setTimeout(() => scheduleMidnightRefresh(), 3600000);
  }
}

// ---------- re-confetti trigger for birthday section ----------
function setupReconfettiTriggers() {
  const section = document.getElementById("birthday-section");
  if (!section) return;
  const retrigger = () => { launchCardConfetti(section, CONFETTI_DURATION_MS); playBirthdayAudio(); };
  ["pointerdown", "click", "touchstart"].forEach(evt => section.addEventListener(evt, retrigger, { passive: true }));
}

// Exported-ish helpers (kept global): renderBirthdays, scheduleMidnightRefresh, setupReconfettiTriggers
// (Part 3 will call these during init)
// ---------- Part 3: Anonymous Messages + Init ----------

// ---------- Anonymous Messages Renderer ----------
async function renderAnonymousMessages() {
  const msgWrap = document.getElementById("messages-container");
  if (!msgWrap) return;

  try {
    const list = await loadJSON("/data/messages.json");
    msgWrap.innerHTML = "";

    if (!Array.isArray(list) || list.length === 0) {
      msgWrap.appendChild(el(`<p style="color:#6b7280;margin:0">No anonymous messages yet.</p>`));
      return;
    }

    list.slice().reverse().forEach((m, idx) => {
      const card = el(`
        <div class="msg-card">
          <p class="msg-text">${m.text || ""}</p>
          <span class="msg-meta">${m.date || ""}</span>
        </div>
      `);
      msgWrap.appendChild(card);
    });
  } catch (err) {
    console.error("Anon msg error:", err);
    msgWrap.innerHTML = `<p style="color:#ef4444;margin:0">Failed to load messages.</p>`;
  }
}

// ---------- Submit Message (with modal + loader) ----------
async function handleMsgSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const txt = form.querySelector("textarea[name='message']");
  if (!txt || !txt.value.trim()) return;

  const payload = { text: txt.value.trim(), date: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }) };

  const btn = form.querySelector("button[type='submit']");
  if (btn) btn.disabled = true;
  showLoader();

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });

    txt.value = "";
    hideLoader();
    showModal("Your anonymous message has been sent ✅");

    // reload messages after short delay
    setTimeout(renderAnonymousMessages, 1000);
  } catch (err) {
    console.error("Submit error:", err);
    hideLoader();
    showModal("Failed to send message ❌ Please try again.");
  } finally {
    if (btn) btn.disabled = false;
  }
}

// ---------- Loader + Modal Helpers ----------
function showLoader() {
  const ld = document.getElementById("loader");
  if (ld) ld.style.display = "flex";
}
function hideLoader() {
  const ld = document.getElementById("loader");
  if (ld) ld.style.display = "none";
}

function showModal(msg) {
  const m = document.getElementById("modal");
  if (!m) return;
  m.querySelector(".modal-text").textContent = msg;
  m.style.display = "flex";
}
function closeModal() {
  const m = document.getElementById("modal");
  if (m) m.style.display = "none";
}

// ---------- Init ----------
function initCommunityPage() {
  // birthdays
  renderBirthdays();
  scheduleMidnightRefresh();
  setupReconfettiTriggers();

  // messages
  renderAnonymousMessages();
  const form = document.getElementById("anon-form");
  if (form) form.addEventListener("submit", handleMsgSubmit);

  // modal close
  const closeBtn = document.getElementById("modal-close");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  // one-time audio play trigger (user gesture requirement in browsers)
  document.body.addEventListener("click", () => {
    const a = getBirthdayAudio();
    if (a) { a.play().catch(()=>{}); }
  }, { once: true });
}

// ---------- Run ----------
document.addEventListener("DOMContentLoaded", initCommunityPage);
