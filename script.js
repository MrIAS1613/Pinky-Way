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

function renderMembers(admins) {
  const grid = document.getElementById("members-grid");
  if (!grid) return;
  grid.innerHTML = "";
  admins.forEach(m => {
    const links = [];

    if (m.links?.portfolio) {
      links.push(`
        <a href="${m.links.portfolio}" target="_blank" rel="noreferrer">
          <i class="fa-solid fa-globe"></i>
        </a>
      `);
    }
    if (m.links?.facebook) {
      links.push(`
        <a href="${m.links.facebook}" target="_blank" rel="noreferrer">
          <i class="fa-brands fa-facebook"></i>
        </a>
      `);
    }
    if (m.links?.instagram) {
      links.push(`
        <a href="${m.links.instagram}" target="_blank" rel="noreferrer">
          <i class="fa-brands fa-instagram"></i>
        </a>
      `);
    }
    if (m.links?.email) {
      links.push(`
        <a href="mailto:${m.links.email}">
          <i class="fa-solid fa-envelope"></i>
        </a>
      `);
    }

    grid.appendChild(el(`
      <article class="item">
        <div class="row">
          ${m.avatar ? `<img class="avatar" src="${m.avatar}" alt="${m.name}">` : ""}
          <div>
            <h3>${m.name}</h3>
            <p>${m.role ?? "Member"}</p>
          </div>
        </div>

        ${m.bio ? `<p style="margin-top:10px">${m.bio}</p>` : ""}

        ${links.length ? `<div class="social-links">${links.join("")}</div>` : ""}

        ${m.tags?.length ? `<div class="badge">${m.tags.join(" • ")}</div>` : ""}
      </article>
    `));
  });
}

(async () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const members = await loadJSON("/data/admins.json");

  renderMembers(admins);
})();
