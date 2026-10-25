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
