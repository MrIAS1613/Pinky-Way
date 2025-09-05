// ---------- Config ----------
const CONFETTI_DURATION_MS = 10000; // 10s
const BIRTHDAY_AUDIO_ID = "birthday-audio";

// ---------- Hamburger Menu ----------
const hamburger = document.getElementById("hamburger-menu");
const navLinks = document.getElementById("nav-links");
hamburger?.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

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
    if (m.links?.facebook)  links.push(`<a href="${m.links.facebook}"  target="_blank"><i class="fa-brands fa-facebook"></i></a>`);
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
    if (p.links?.facebook)  links.push(`<a href="${p.links.facebook}"  target="_blank"><i class="fa-brands fa-facebook"></i></a>`);
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

  todayWrap.innerHTML = "";
  upcomingWrap.innerHTML = "";

  try {
    const list = await loadJSON("/data/birthdays.json");
    if (!Array.isArray(list)) return;

    const todays = list.filter(b => b.dob && isTodayDOB(b.dob));
    const upcoming = list
      .filter(b => b.dob && !isTodayDOB(b.dob))
      .map(b => ({ ...b, _next: nextOccurrence(b.dob) }))
      .sort((a, b) => a._next - b._next);

    // --- Today cards ---
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
              <img class="birthday-avatar" 
                   src="${b.avatar || ''}" 
                   alt="${b.name}" 
                   style="width:140px;height:140px;object-fit:cover;border-radius:16px;border:3px solid #ff80ab;">
            </div>
            <div class="birthday-text">
              <h3 style="font-size:28px;margin:0 0 10px">Happy Birthday 🎉</h3>
              <b><p style="margin:0 0 6px"><strong>${b.name}</strong></p></b>
              <p class="birthday-bio" style="margin:0">${msg}</p>
            </div>
          </div>
        `);

        todayWrap.appendChild(card);

        // Only today triggers confetti + audio
        launchCardConfetti(card, CONFETTI_DURATION_MS);
        if (!birthdayAudioStarted) {
          playBirthdayAudio();
          birthdayAudioStarted = true;
        }
      });
    }

    // --- Upcoming mini card (only 1) ---
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
