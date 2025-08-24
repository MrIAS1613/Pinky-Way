// ------------------ Utilities ------------------
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

// ------------------ Members ------------------
function renderMembers(members) {
  const grid = document.getElementById("members-grid");
  if (!grid) return;
  grid.innerHTML = "";

  members.forEach(m => {
    const links = [];
    if (m.links?.portfolio) links.push(`<a href="${m.links.portfolio}" target="_blank"><i class="fa-solid fa-car"></i></a>`);
    if (m.links?.facebook) links.push(`<a href="${m.links.facebook}" target="_blank"><i class="fa-brands fa-facebook"></i></a>`);
    if (m.links?.instagram) links.push(`<a href="${m.links.instagram}" target="_blank"><i class="fa-brands fa-instagram"></i></a>`);
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
}

// ------------------ Pookies ------------------
function renderPookies(pookies) {
  const grid = document.getElementById("pookies-grid");
  if (!grid) return;
  grid.innerHTML = "";

  pookies.forEach(p => {
    const links = [];
    if (p.links?.portfolio) links.push(`<a href="${p.links.portfolio}" target="_blank"><i class="fa-solid fa-globe"></i></a>`);
    if (p.links?.facebook) links.push(`<a href="${p.links.facebook}" target="_blank"><i class="fa-brands fa-facebook"></i></a>`);
    if (p.links?.instagram) links.push(`<a href="${p.links.instagram}" target="_blank"><i class="fa-brands fa-instagram"></i></a>`);
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
}

// ------------------ Total Pookies Count ------------------
async function getCount() {
  let total = 0;
  try {
    const membersData = await loadJSON("/data/members.json");
    const pookiesData = await loadJSON("/data/pookies.json");
    total = membersData.length + pookiesData.length;
    document.getElementById("totalCount").textContent = total;
  } catch (err) {
    console.error("Count error:", err);
    document.getElementById("totalCount").textContent = "Error";
  }
}

// ------------------ Birthday Feature ------------------
async function renderBirthdays() {
  const birthdays = await loadJSON("/data/birthdays.json");
  const today = new Date();
  const todayStr = `${today.getDate()}-${today.getMonth() + 1}`;

  const todayDiv = document.getElementById("today-birthday");
  const upcomingDiv = document.getElementById("upcoming-birthdays");
  todayDiv.innerHTML = "";
  upcomingDiv.innerHTML = "";

  birthdays.forEach(b => {
    const birthDate = new Date(b.dob);
    const bdayStr = `${birthDate.getDate()}-${birthDate.getMonth() + 1}`;

    if (bdayStr === todayStr) {
      todayDiv.appendChild(el(`
        <div class="birthday-row">
          <img class="birthday-avatar" src="${b.avatar}" alt="${b.name}">
          <div class="birthday-text">
            <h3>🎉 Happy Birthday, ${b.name}! 🎉</h3>
            <p>Wishing you many many happy returns of the day. We all love you from the heart. You are such a pookie 🎀! <br>- Pinky Way family.</p>
          </div>
        </div>
        <canvas id="birthday-confetti"></canvas>
      `));
      launchConfetti();
    } else if (birthDate > today) {
      upcomingDiv.appendChild(el(`
        <div class="upcoming-card">
          <img class="birthday-avatar" src="${b.avatar}" alt="${b.name}">
          <p><strong>${b.name}</strong><br>${birthDate.toLocaleDateString('en-GB', { day:'2-digit', month:'short' })}</p>
        </div>
      `));
    }
  });
}

// ------------------ Confetti ------------------
function launchConfetti() {
  const canvas = document.getElementById("birthday-confetti");
  if (!canvas) return;
  const myConfetti = confetti.create(canvas, { resize: true });
  myConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}

// ------------------ Initialize Everything ------------------
(async () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const members = await loadJSON("/data/members.json");
  renderMembers(members);

  const pookies = await loadJSON("/data/pookies.json");
  renderPookies(pookies);

  await getCount();
  await renderBirthdays();
})();          </div>
        `));
      }
    });

  } catch(err) {
    console.error("Birthday load error:", err);
  }
}

function launchConfetti() {
  const canvas = document.getElementById("birthday-confetti");
  if (!canvas) return;
  const myConfetti = confetti.create(canvas, { resize: true });
  myConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}

// ------------------ Total Pookies Count ------------------
async function getCount() {
  let total = 0;
  try {
    const membersRes = await fetch("/data/members.json", { cache: "no-store" });
    const membersData = await membersRes.json();
    total += membersData.length;

    const pookiesRes = await fetch("/data/pookies.json", { cache: "no-store" });
    const pookiesData = await pookiesRes.json();
    total += pookiesData.length;

    document.getElementById("totalCount").textContent = total;
  } catch (err) {
    console.error("Count লোড করার সময় error:", err);
    document.getElementById("totalCount").textContent = "Error";
  }
}

// ------------------ Initialize ------------------
(async () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const members = await loadJSON("/data/members.json");
  renderMembers(members);

  const pookies = await loadJSON("/data/pookies.json");
  renderPookies(pookies);

  await renderBirthdays(); // <-- New feature added safely

  await getCount();
})();      }
    });

  } catch(err) {
    console.error("Birthday load error:", err);
  }
}

// Confetti
function launchConfetti() {
  const canvas = document.getElementById("birthday-confetti");
  if (!canvas) return;
  const myConfetti = confetti.create(canvas, { resize: true });
  myConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}

// Initialize
(async () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const members = await loadJSON("/data/members.json");
  renderMembers(members);

  const pookies = await loadJSON("/data/pookies.json");
  renderPookies(pookies);

  await renderBirthdays();
})();      `);
      todayContainer.appendChild(card);
      createConfetti(card, 40);
    } else if (birthDate > today) {
      // Upcoming Birthday
      const upCard = el(`
        <div class="upcoming-card">
          <p><strong>${b.name}</strong> - ${birthDate.toLocaleDateString()}</p>
        </div>
      `);
      upcomingContainer.appendChild(upCard);
    }
  });
}

// ------------------ Total Pookies Count ------------------
async function getCount() {
  let total = 0;
  try {
    const membersRes = await fetch("/data/members.json", { cache: "no-store" });
    const membersData = await membersRes.json();
    total += membersData.length;

    const pookiesRes = await fetch("/data/pookies.json", { cache: "no-store" });
    const pookiesData = await pookiesRes.json();
    total += pookiesData.length;

    document.getElementById("totalCount").textContent = total;
  } catch (err) {
    console.error("Count লোড করার সময় error:", err);
    document.getElementById("totalCount").textContent = "Error";
  }
}

// ------------------ Init ------------------
(async () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const members = await loadJSON("/data/members.json");
  renderMembers(members);

  const pookies = await loadJSON("/data/pookies.json");
  renderPookies(pookies);

  const birthdays = await loadJSON("/data/birthdays.json");
  renderBirthdays(birthdays);

  await getCount();
})();
