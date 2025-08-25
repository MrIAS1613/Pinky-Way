// ------------------ Utilities ------------------
async function loadJSON(path) {
  try {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('loadJSON error', err);
    return [];
  }
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

// ------------------ Members ------------------
function renderMembers(members) {
  const grid = document.getElementById("members-grid");
  if (!grid) return;
  grid.innerHTML = "";

  members.forEach(m => {
    const links = [];
    if (m.links?.portfolio) links.push(`<a href="${m.links.portfolio}" target="_blank" rel="noreferrer"><i class="fa-solid fa-car"></i></a>`);
    if (m.links?.facebook) links.push(`<a href="${m.links.facebook}" target="_blank" rel="noreferrer"><i class="fa-brands fa-facebook"></i></a>`);
    if (m.links?.instagram) links.push(`<a href="${m.links.instagram}" target="_blank" rel="noreferrer"><i class="fa-brands fa-instagram"></i></a>`);
    if (m.links?.email) links.push(`<a href="mailto:${m.links.email}"><i class="fa-solid fa-envelope"></i></a>`);

    grid.appendChild(el(`
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
        ${m.tags?.length && m.tags[0] !== "" ? `<div class="badge">${m.tags.join(" • ")}</div>` : ""}
      </article>
    `));
  });

  // adminCount (optional)
  const adminCountEl = document.getElementById('adminCount');
  if (adminCountEl) adminCountEl.textContent = members.length;
}

// ------------------ Pookies ------------------
function renderPookies(pookies) {
  const grid = document.getElementById("pookies-grid");
  if (!grid) return;
  grid.innerHTML = "";

  pookies.forEach(p => {
    const links = [];
    if (p.links?.portfolio) links.push(`<a href="${p.links.portfolio}" target="_blank" rel="noreferrer"><i class="fa-solid fa-globe"></i></a>`);
    if (p.links?.facebook) links.push(`<a href="${p.links.facebook}" target="_blank" rel="noreferrer"><i class="fa-brands fa-facebook"></i></a>`);
    if (p.links?.instagram) links.push(`<a href="${p.links.instagram}" target="_blank" rel="noreferrer"><i class="fa-brands fa-instagram"></i></a>`);
    if (p.links?.email) links.push(`<a href="mailto:${p.links.email}"><i class="fa-solid fa-envelope"></i></a>`);

    grid.appendChild(el(`
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
        ${p.tags?.length && p.tags[0] !== "" ? `<div class="badge pookie-badge">${p.tags.join(" • ")}</div>` : ""}
      </article>
    `));
  });

  // memberCount (optional)
  const memberCountEl = document.getElementById('memberCount');
  if (memberCountEl) memberCountEl.textContent = pookies.length;
}

// ------------------ Total Count ------------------
async function getCount() {
  try {
    const membersData = await loadJSON("/data/members.json");
    const pookiesData = await loadJSON("/data/pookies.json");
    const total = (membersData?.length || 0) + (pookiesData?.length || 0);
    const elTotal = document.getElementById("totalCount");
    if (elTotal) elTotal.textContent = total;
  } catch (err) {
    console.error("getCount error", err);
    const elTotal = document.getElementById("totalCount");
    if (elTotal) elTotal.textContent = "Error";
  }
}

// ------------------ Birthdays ------------------
async function renderBirthdays() {
  try {
    const birthdays = await loadJSON("/data/birthdays.json");
    const today = new Date();
    const todayStr = `${today.getDate()}-${today.getMonth() + 1}`;

    const todayDiv = document.getElementById("today-birthday");
    const upcomingDiv = document.getElementById("upcoming-birthdays");
    if (!todayDiv || !upcomingDiv) return;

    todayDiv.innerHTML = "";
    upcomingDiv.innerHTML = "";

    // sort upcoming by next occurrence (optional)
    const upcoming = [];
    birthdays.forEach(b => {
      if (!b.dob) return;
      const bd = new Date(b.dob);
      const bStr = `${bd.getDate()}-${bd.getMonth() + 1}`;
      if (bStr === todayStr) {
        // today
        todayDiv.appendChild(el(`
          <div class="birthday-row">
            ${b.avatar ? `<img class="birthday-avatar" src="${b.avatar}" alt="${b.name}">` : ""}
            <div class="birthday-text">
              <h3>🎉 Happy Birthday, ${b.name}! 🎉</h3>
              <p>${b.bio ? b.bio : 'Wishing you many many happy returns of the day. We all love you from the heart. You are such a pookie 🎀! - Pinky Way family.'}</p>
            </div>
          </div>
          <canvas id="birthday-confetti"></canvas>
        `));
        // start confetti after DOM inserted
        setTimeout(() => launchConfetti(), 120);
      } else {
        upcoming.push({ ...b, dateObj: bd });
      }
    });

    // sort upcoming by next date (this year)
    upcoming.sort((a, c) => a.dateObj - c.dateObj);

    upcoming.forEach(b => {
      const dateStr = b.dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      upcomingDiv.appendChild(el(`
        <div class="upcoming-card">
          ${b.avatar ? `<img class="birthday-avatar" src="${b.avatar}" alt="${b.name}">` : ""}
          <div><strong>${b.name}</strong><br>${dateStr}</div>
        </div>
      `));
    });

  } catch (err) {
    console.error("renderBirthdays error", err);
  }
}

// Confetti
function launchConfetti() {
  const canvas = document.getElementById("birthday-confetti");
  if (!canvas || typeof confetti !== "function") return;
  const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });
  myConfetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
}

// ------------------ Initialize ------------------
(async () => {
  // set year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // load members + pookies
  const members = await loadJSON("/data/members.json");
  renderMembers(members || []);

  const pookies = await loadJSON("/data/pookies.json");
  renderPookies(pookies || []);

  // counts and birthdays
  await getCount();
  await renderBirthdays();
})();
