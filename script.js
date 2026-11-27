/* ==========================================================
   Rezia Portfolio - script.js
   Semua ID dan class memakai prefix "rezia_"
   ========================================================== */

// ====== PENGATURAN (ubah sesuai kebutuhan) ======
const rezia_config = {
  email: "mohreziarahmatuloh@gmail.com",
  roles: ["klip game momen lucu", "meme edit absurd", "fail compilation", "video .exe penuh glitch"]
};

// helper
const rezia_$ = (sel, root = document) => root.querySelector(sel);
const rezia_$$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- 1. Tema gelap / terang ---------- */
const rezia_themeBtn = rezia_$("#rezia_theme_btn");
function rezia_setTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
  rezia_themeBtn.textContent = mode === "dark" ? "🌙" : "☀️";
  try { localStorage.setItem("rezia_theme", mode); } catch (e) {}
}
let rezia_saved = "dark";
try { rezia_saved = localStorage.getItem("rezia_theme") || "dark"; } catch (e) {}
rezia_setTheme(rezia_saved);
rezia_themeBtn.addEventListener("click", () => {
  const now = document.documentElement.getAttribute("data-theme");
  rezia_setTheme(now === "dark" ? "light" : "dark");
});

/* ---------- 2. Menu hamburger (mobile) ---------- */
const rezia_menu = rezia_$("#rezia_menu");
rezia_$("#rezia_burger").addEventListener("click", () => rezia_menu.classList.toggle("rezia_open"));
rezia_$$(".rezia_menu_link").forEach(link =>
  link.addEventListener("click", () => rezia_menu.classList.remove("rezia_open"))
);

/* ---------- 3. Efek mengetik di Home ---------- */
(function rezia_typing() {
  const el = rezia_$("#rezia_typed");
  let r = 0, c = 0, deleting = false;
  function tick() {
    const word = rezia_config.roles[r];
    el.textContent = word.slice(0, c);
    if (!deleting && c < word.length) { c++; setTimeout(tick, 90); }
    else if (!deleting) { deleting = true; setTimeout(tick, 1400); }
    else if (c > 0) { c--; setTimeout(tick, 45); }
    else { deleting = false; r = (r + 1) % rezia_config.roles.length; setTimeout(tick, 300); }
  }
  tick();
})();

/* ---------- 4. Scroll: progress bar, tombol atas, menu aktif ---------- */
const rezia_progress = rezia_$("#rezia_progress");
const rezia_topBtn = rezia_$("#rezia_top");
const rezia_sections = rezia_$$("main section");
const rezia_links = rezia_$$(".rezia_menu_link");

function rezia_onScroll() {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  rezia_progress.style.width = pct + "%";
  rezia_topBtn.classList.toggle("rezia_visible", h.scrollTop > 500);

  let current = rezia_sections[0].id;
  rezia_sections.forEach(s => { if (h.scrollTop + 120 >= s.offsetTop) current = s.id; });
  rezia_links.forEach(l => l.classList.toggle("rezia_active", l.getAttribute("href") === "#" + current));
}
window.addEventListener("scroll", rezia_onScroll, { passive: true });
rezia_onScroll();
rezia_topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ---------- 5. Animasi muncul saat scroll + counter + progress bar skill ---------- */
function rezia_countUp(el) {
  const target = +el.dataset.target;
  let n = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const timer = setInterval(() => {
    n += step;
    if (n >= target) { n = target; clearInterval(timer); }
    el.textContent = n + (target >= 10 ? "+" : "");
  }, 40);
}
const rezia_observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add("rezia_show");
    rezia_$$(".rezia_count", el).forEach(rezia_countUp);
    rezia_$$(".rezia_bar_fill", el).forEach(b => (b.style.width = b.dataset.level + "%"));
    rezia_observer.unobserve(el);
  });
}, { threshold: 0.15 });
rezia_$$(".rezia_reveal").forEach(el => rezia_observer.observe(el));

/* ---------- 6. Filter galeri proyek ---------- */
const rezia_filterBtns = rezia_$$(".rezia_filter_btn");
const rezia_cards = rezia_$$("#rezia_grid .rezia_card");
rezia_filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    rezia_filterBtns.forEach(b => b.classList.remove("rezia_active"));
    btn.classList.add("rezia_active");
    const f = btn.dataset.filter;
    rezia_cards.forEach(card => card.classList.toggle("rezia_hide", f !== "all" && card.dataset.category !== f));
  });
});

/* ---------- 7. Lightbox pemutar video ----------
   data-video bisa berisi:
   - ID YouTube      -> contoh: "dQw4w9WgXcQ"
   - file lokal .mp4 -> contoh: "video/vlog.mp4"
   - kosong          -> tampil pesan placeholder                    */
const rezia_lightbox = rezia_$("#rezia_lightbox");
const rezia_lbBody = rezia_$("#rezia_lightbox_body");
const rezia_lbTitle = rezia_$("#rezia_lightbox_title");

function rezia_openVideo(src, title) {
  rezia_lbTitle.textContent = title || "Video";
  rezia_lbBody.innerHTML = "";
  if (!src) {
    rezia_lbBody.textContent = "Video belum dipasang. Isi atribut data-video dengan ID YouTube atau path file .mp4.";
  } else if (src.toLowerCase().endsWith(".mp4")) {
    const v = document.createElement("video");
    v.src = src; v.controls = true; v.autoplay = true; v.playsInline = true;
    rezia_lbBody.appendChild(v);
  } else {
    const f = document.createElement("iframe");
    f.src = "https://www.youtube.com/embed/" + encodeURIComponent(src) + "?autoplay=1";
    f.allow = "autoplay; encrypted-media; picture-in-picture";
    f.allowFullscreen = true;
    rezia_lbBody.appendChild(f);
  }
  rezia_lightbox.classList.add("rezia_open");
  rezia_lightbox.setAttribute("aria-hidden", "false");
}
function rezia_closeVideo() {
  rezia_lightbox.classList.remove("rezia_open");
  rezia_lightbox.setAttribute("aria-hidden", "true");
  rezia_lbBody.innerHTML = "";   // hentikan video
}
rezia_$$(".rezia_play").forEach(btn =>
  btn.addEventListener("click", () => rezia_openVideo(btn.dataset.video, btn.dataset.title))
);
rezia_$("#rezia_lightbox_close").addEventListener("click", rezia_closeVideo);
rezia_lightbox.addEventListener("click", e => { if (e.target === rezia_lightbox) rezia_closeVideo(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") rezia_closeVideo(); });

/* ---------- 8. Slider before / after ---------- */
const rezia_ba = rezia_$("#rezia_ba");
rezia_$("#rezia_ba_range").addEventListener("input", e => {
  rezia_ba.style.setProperty("--pos", e.target.value + "%");
});

/* ---------- 8b. Meme Stash: tempel stiker di sisi EDIT ---------- */
const rezia_stickers = rezia_$("#rezia_stickers");
rezia_$$(".rezia_sticker_btn[data-sticker]").forEach(btn => {
  btn.addEventListener("click", () => {
    if (rezia_stickers.children.length >= 14) rezia_stickers.firstChild.remove();
    const s = document.createElement("span");
    s.className = "rezia_sticker";
    s.textContent = btn.dataset.sticker;
    s.style.left = (52 + Math.random() * 34) + "%";   // muncul di sisi kanan (EDIT)
    s.style.top = (10 + Math.random() * 60) + "%";
    s.style.transform = "rotate(" + (Math.random() * 30 - 15) + "deg)";
    rezia_stickers.appendChild(s);
  });
});
rezia_$("#rezia_clear_stickers").addEventListener("click", () => (rezia_stickers.innerHTML = ""));

/* ---------- 8c. Popup error palsu ala .exe ---------- */
const rezia_exe = rezia_$("#rezia_exe");
const rezia_exeMsgs = [
  "Terlalu banyak meme terdeteksi. Skill issue ditemukan di 3 file.",
  "Error 404: konsentrasi tidak ditemukan.",
  "Fatal: musuh terakhir ternyata teman sendiri.",
  "Warning: bass boost melebihi batas wajar.",
  "NPC.exe mencoba menjadi karakter utama."
];
let rezia_exeIdx = 0;
function rezia_openExe() {
  rezia_$("#rezia_exe_msg").textContent = rezia_exeMsgs[rezia_exeIdx % rezia_exeMsgs.length];
  rezia_exe.classList.add("rezia_open");
  rezia_exe.setAttribute("aria-hidden", "false");
  document.body.classList.add("rezia_glitching");
  setTimeout(() => document.body.classList.remove("rezia_glitching"), 520);
}
function rezia_closeExe() {
  rezia_exe.classList.remove("rezia_open");
  rezia_exe.setAttribute("aria-hidden", "true");
}
rezia_$("#rezia_exe_btn").addEventListener("click", rezia_openExe);
rezia_$("#rezia_exe_retry").addEventListener("click", () => { rezia_exeIdx++; rezia_openExe(); });
rezia_$("#rezia_exe_ok").addEventListener("click", rezia_closeExe);
rezia_$("#rezia_exe_x").addEventListener("click", rezia_closeExe);
document.addEventListener("keydown", e => { if (e.key === "Escape") rezia_closeExe(); });

/* ---------- 9. Form kontak: validasi + kirim ---------- */
const rezia_form = rezia_$("#rezia_form");
const rezia_msg = rezia_$("#rezia_message");
const rezia_status = rezia_$("#rezia_form_status");

rezia_msg.addEventListener("input", () => {
  rezia_$("#rezia_msg_count").textContent = rezia_msg.value.length + " / 500";
});

function rezia_setError(id, errId, text) {
  const field = rezia_$("#" + id).closest(".rezia_field");
  rezia_$("#" + errId).textContent = text;
  field.classList.toggle("rezia_invalid", !!text);
  return !text;
}

rezia_form.addEventListener("submit", e => {
  e.preventDefault();
  const name = rezia_$("#rezia_name").value.trim();
  const email = rezia_$("#rezia_email").value.trim();
  const subject = rezia_$("#rezia_subject").value.trim();
  const message = rezia_msg.value.trim();

  const okName = rezia_setError("rezia_name", "rezia_err_name", name.length < 2 ? "Nama minimal 2 karakter." : "");
  const okEmail = rezia_setError("rezia_email", "rezia_err_email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Format email tidak valid.");
  const okSubject = rezia_setError("rezia_subject", "rezia_err_subject", subject.length < 3 ? "Subjek minimal 3 karakter." : "");
  const okMessage = rezia_setError("rezia_message", "rezia_err_message", message.length < 10 ? "Pesan minimal 10 karakter." : "");

  rezia_status.className = "rezia_form_status";
  if (!(okName && okEmail && okSubject && okMessage)) {
    rezia_status.textContent = "Periksa kembali isian yang berwarna merah.";
    return;
  }

  // Buka aplikasi email dengan isi pesan terisi otomatis
  const body = "Nama: " + name + "\nEmail: " + email + "\n\n" + message;
  window.location.href = "mailto:" + rezia_config.email +
    "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

  rezia_status.classList.add("rezia_ok");
  rezia_status.textContent = "Terima kasih, " + name + "! Aplikasi email kamu akan terbuka untuk mengirim pesan.";
  rezia_form.reset();
  rezia_$("#rezia_msg_count").textContent = "0 / 500";
});
