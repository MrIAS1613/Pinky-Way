// Load JSON safely
async function loadJSON(path) {
  try {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// Create element from HTML string
function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

// Render Admins
function renderMembers(members) {
  const grid = document.getElementById("members-grid");
  if (!grid) return;
  grid.innerHTML = "";

  members.forEach(m => {
    const links = [];
    if (m.links?.portfolio) links.push(`<a href="${m.links.portfolio}" target="_blank"><i class="fa-solid fa-globe"></i></a>`);
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

// Render Pookies
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

// Initialize
(async () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const members = await loadJSON("/data/members.json");
  renderMembers(members);

  const pookies = await loadJSON("/data/pookies.json");
  renderPookies(pookies);
})();
