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
  members.forEach(m => {
    const links = [];
    if (m.links?.github) links.push(`<a href="${m.links.github}" target="_blank">GitHub</a>`);
    if (m.links?.portfolio) links.push(`<a href="${m.links.portfolio}" target="_blank">Portfolio</a>`);
    if (m.links?.x) links.push(`<a href="${m.links.x}" target="_blank">X</a>`);

    grid.appendChild(el(`
      <article class="item">
        <div class="row">
          ${m.avatar ? `<img class="avatar" src="${m.avatar}" alt="${m.name}">` : ""}
          <div>
            <h3>${m.name}</h3>
            <p>${m.role ?? "Member"}</p>
          </div>
        </div>
        <p style="margin-top:10px">${m.bio ?? ""}</p>
        <div>${links.join(" · ")}</div>
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
  const members = await loadJSON("/data/members.json");
  const projects = await loadJSON("/data/projects.json");
  const summaries = await loadJSON("/data/summaries.json");
  renderMembers(members);
  renderProjects(projects);
  renderSummaries(summaries);
})();
