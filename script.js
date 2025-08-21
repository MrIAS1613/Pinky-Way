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

function renderMembers(members) {
  const grid = document.getElementById("members-grid");
  grid.innerHTML = "";
  if (!members || members.length === 0) {
    grid.innerHTML = "<p>No members yet! Join us!</p>";
    return;
  }
  members.forEach(m => {
    const links = [];
if (m.links?.portfolio) links.push(`<a href="${m.links.portfolio}" target="_blank">Portfolio</a>`);
if (m.links?.facebook) links.push(`<a href="${m.links.facebook}" target="_blank">Facebook</a>`);
if (m.links?.instagram) links.push(`<a href="${m.links.instagram}" target="_blank">Instagram</a>`);
if (m.links?.email) links.push(`<a href="mailto:${m.links.email}">Email</a>`);

    grid.appendChild(el(`
      <article class="item">
        <div class="row">
          ${m.avatar ? `<img class="avatar" src="${m.avatar}" alt="${m.name}">` : ""}
          <div>
            <h3>${m.name || "Unknown"}</h3>
            <p>${m.role ?? "Member"}</p>
          </div>
        </div>
        <p style="margin-top:10px">${m.bio ?? ""}</p>
        <div class="link-icons">${links.join("")}</div>
        ${m.tags?.length ? `<div class="badge">${m.tags.join(" • ")}</div>` : ""}
      </article>
    `));
  });
}

function renderProjects(projects) {
  const grid = document.getElementById("projects-grid");
  grid.innerHTML = "";
  projects.forEach(p => {
    grid.appendChild(el(`
      <article class="item">
        <h3>${p.title}</h3>
        <p>${p.description ?? ""}</p>
        ${p.link ? `<a href="${p.link}" target="_blank" rel="noreferrer">View</a>` : ""}
      </article>
    `));
  });
}

function renderSummaries(summaries) {
  const list = document.getElementById("summaries-list");
  list.innerHTML = "";
  summaries.forEach(s => {
    list.appendChild(el(`
      <li>
        <strong>${s.title}</strong> — ${s.period}
        ${s.link ? ` · <a href="${s.link}" target="_blank" rel="noreferrer">Open</a>` : ""}
      </li>
    `));
  });
}

(async () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  const members = await loadJSON("./data/members.json");
  renderMembers(members);
  
})();
