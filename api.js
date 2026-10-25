// Funciones compartidas por todas las páginas
async function rpc(fn, args) {
  const c = window.APP_CONFIG || {};
  if (!c.SUPABASE_URL || c.SUPABASE_URL.includes("TU-PROYECTO")) {
    throw new Error("Falta configurar config.js con los datos de Supabase");
  }
  const r = await fetch(c.SUPABASE_URL + "/rest/v1/rpc/" + fn, {
    method: "POST",
    headers: { apikey: c.SUPABASE_ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(args || {})
  });
  if (!r.ok) throw new Error("Error de conexión (" + r.status + ")");
  return r.json();
}

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
  });
}

function param(name) {
  return (new URLSearchParams(location.search).get(name) || "").trim().toLowerCase();
}

function safeColor(c) {
  return /^#[0-9a-fA-F]{6}$/.test(c || "") ? c : "#e4572e";
}

function pageUrl(file, slug) {
  return new URL(file + "?r=" + encodeURIComponent(slug), location.href).href;
}

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-CL", {
    timeZone: "America/Santiago", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
  });
}

// ---------- Diseño por restaurante ----------
var FONTS = {
  "system": { label: "Sistema (neutra)", css: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
  "Poppins": { label: "Poppins · moderna", css: '"Poppins", system-ui, sans-serif', gf: "Poppins:wght@400;600;700" },
  "Montserrat": { label: "Montserrat · limpia", css: '"Montserrat", system-ui, sans-serif', gf: "Montserrat:wght@400;600;700" },
  "Playfair Display": { label: "Playfair Display · elegante", css: '"Playfair Display", Georgia, serif', gf: "Playfair+Display:wght@400;700" },
  "Merriweather": { label: "Merriweather · clásica", css: '"Merriweather", Georgia, serif', gf: "Merriweather:wght@400;700" },
  "Pacifico": { label: "Pacifico · manuscrita", css: '"Pacifico", cursive', gf: "Pacifico" },
  "Lobster": { label: "Lobster · retro", css: '"Lobster", cursive', gf: "Lobster" },
  "Oswald": { label: "Oswald · letrero", css: '"Oswald", Impact, sans-serif', gf: "Oswald:wght@400;600" },
  "Baloo 2": { label: "Baloo 2 · redondeada", css: '"Baloo 2", system-ui, sans-serif', gf: "Baloo+2:wght@400;700" },
  "Abril Fatface": { label: "Abril Fatface · titular", css: '"Abril Fatface", Georgia, serif', gf: "Abril+Fatface" }
};

function safeUrl(u) {
  return /^https:\/\/[^\s"'()<>\\]+$/.test(u || "") ? u : "";
}

function onColor(hex) {
  var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) > 160 ? "#1f1f1f" : "#ffffff";
}

function loadFont(name) {
  var f = FONTS[name];
  if (!f || !f.gf) return;
  var id = "gf-" + name.replace(/\s+/g, "-");
  if (document.getElementById(id)) return;
  var l = document.createElement("link");
  l.id = id;
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=" + f.gf + "&display=swap";
  document.head.appendChild(l);
}

// Aplica colores, tipografía, fondo y forma de un restaurante a una página (o a un contenedor de vista previa)
function applyTheme(t, el) {
  t = t || {};
  el = el || document.documentElement;
  var brand = safeColor(t.color);
  var brand2 = /^#[0-9a-fA-F]{6}$/.test(t.color2 || "") ? t.color2 : brand;
  var dark = !!t.dark;
  var font = FONTS[t.font] ? t.font : "system";
  var square = t.card_style === "square";
  loadFont(font);

  var s = el.style;
  s.setProperty("--brand", brand);
  s.setProperty("--brand2", brand2);
  s.setProperty("--on-brand", onColor(brand));
  s.setProperty("--font", FONTS[font].css);
  s.setProperty("--radius", square ? "6px" : "18px");
  s.setProperty("--stamp-radius", square ? "8px" : "50%");
  s.setProperty("--ink", dark ? "#f4f1ea" : "#1f1f1f");
  s.setProperty("--muted", dark ? "#b9b3a6" : "#6b6b6b");
  s.setProperty("--card", dark ? "#1d1b19" : "#ffffff");
  s.setProperty("--line", dark ? "#3a3733" : "#e6e2da");

  var base = dark ? "#0f0e0d" : "#f5f3ef";
  var mix = dark ? "#0f0e0d" : "#ffffff";
  var img = safeUrl(t.bg_image_url);
  var bg = base;
  if (t.bg_style === "image" && img) {
    var a = dark ? ".6" : ".3";
    bg = "linear-gradient(rgba(0,0,0," + a + "), rgba(0,0,0," + a + ")), url(\"" + img + "\") center / cover no-repeat";
  } else if (t.bg_style === "gradient") {
    bg = "linear-gradient(170deg, color-mix(in srgb, " + brand2 + " 38%, " + mix + "), color-mix(in srgb, " + brand + " 30%, " + mix + "))";
  }
  s.setProperty("--pagebg", bg);

  if (el === document.documentElement) {
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", brand);
  }
}
