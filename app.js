/**
 * Nova — AI Chat Assistant
 * Vanilla JS chat client for the Anthropic Messages API.
 * Runs fully in the browser; works in demo mode without an API key.
 * Author: Iqra Zainab (https://github.com/Dev-IqraZainab)
 */

const API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-sonnet-4-5";
const DEFAULT_SYSTEM =
  "You are Nova, a friendly and concise AI assistant. Use short paragraphs and markdown code blocks for code.";

const els = {
  chat: document.getElementById("chat"),
  welcome: document.getElementById("welcome"),
  form: document.getElementById("composer"),
  input: document.getElementById("input"),
  send: document.getElementById("sendBtn"),
  newChat: document.getElementById("newChatBtn"),
  settingsBtn: document.getElementById("settingsBtn"),
  dialog: document.getElementById("settings"),
  apiKey: document.getElementById("apiKey"),
  model: document.getElementById("model"),
  system: document.getElementById("systemPrompt"),
  save: document.getElementById("saveSettings"),
};

/** Conversation history in Anthropic message format. */
let history = [];

// ---------- Settings (localStorage, wrapped in try/catch) ----------
const store = {
  get(key, fallback = "") {
    try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
  },
};

function loadSettings() {
  els.apiKey.value = store.get("nova_api_key");
  els.model.value = store.get("nova_model", DEFAULT_MODEL);
  els.system.value = store.get("nova_system", DEFAULT_SYSTEM);
}

els.settingsBtn.addEventListener("click", () => {
  loadSettings();
  els.dialog.showModal();
});

els.save.addEventListener("click", () => {
  store.set("nova_api_key", els.apiKey.value.trim());
  store.set("nova_model", els.model.value.trim() || DEFAULT_MODEL);
  store.set("nova_system", els.system.value.trim() || DEFAULT_SYSTEM);
});

// ---------- Rendering ----------
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/** Tiny, safe markdown: code blocks, inline code, bold. */
function renderMarkdown(text) {
  let html = escapeHtml(text);
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => `<pre><code>${code.trim()}</code></pre>`);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return html;
}

function addMessage(role, text, { error = false } = {}) {
  els.welcome?.remove();
  const msg = document.createElement("div");
  msg.className = `msg ${role}`;
  msg.innerHTML = `
    <div class="avatar">${role === "user" ? "🙂" : "✦"}</div>
    <div class="bubble ${error ? "error" : ""}">${renderMarkdown(text)}</div>`;
  els.chat.appendChild(msg);
  els.chat.scrollTop = els.chat.scrollHeight;
  return msg;
}

function addTyping() {
  const msg = document.createElement("div");
  msg.className = "msg bot";
  msg.innerHTML = `<div class="avatar">✦</div><div class="bubble typing"><span></span><span></span><span></span></div>`;
  els.chat.appendChild(msg);
  els.chat.scrollTop = els.chat.scrollHeight;
  return msg;
}

// ---------- AI ----------
async function askClaude(messages) {
  const apiKey = store.get("nova_api_key");
  if (!apiKey) return demoReply(messages.at(-1).content);

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: store.get("nova_model", DEFAULT_MODEL),
      max_tokens: 1024,
      system: store.get("nova_system", DEFAULT_SYSTEM),
      messages,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `Request failed (${res.status})`);
  return data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
}

/** Offline demo answers so the live demo works without a key. */
function demoReply(prompt) {
  const p = prompt.toLowerCase();
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let reply;
  if (p.includes("unity") || p.includes("game")) {
    reply = "Here are 3 quick Unity mobile game ideas:\n\n1. **Frog Hop Rush**: endless hopper across lily pads that sink after 2 seconds.\n2. **Color Stack**: tap to drop blocks; matching colors merge and score combos.\n3. **Maze Gravity**: tilt the phone to roll a ball through rotating mazes.\n\n(Demo mode: add your API key in ⚙ Settings for real AI answers.)";
  } else if (p.includes("neural")) {
    reply = "A neural network is like a team of tiny decision-makers. Each one looks at numbers, weighs them, and passes a signal forward. During training, the network adjusts those weights until its guesses match the right answers.\n\n(Demo mode: add your API key for real AI answers.)";
  } else if (p.includes("metaverse") || p.includes("land")) {
    reply = "A metaverse land parcel is a plot of virtual space, usually owned as an NFT, in worlds like Decentraland or The Sandbox. Owners can build on it, rent it out, or sell it.\n\n(Demo mode: add your API key for real AI answers.)";
  } else if (p.includes("python") || p.includes("reverse")) {
    reply = "```python\ndef reverse_string(s: str) -> str:\n    return s[::-1]\n\nprint(reverse_string(\"Nova\"))  # avoN\n```\n\n(Demo mode: add your API key for real AI answers.)";
  } else {
    reply = "I'm running in **demo mode** right now ✨\n\nOpen ⚙ Settings and add your Anthropic API key, and I'll answer anything with real AI.";
  }
  return wait(700).then(() => reply);
}

// ---------- Events ----------
async function sendMessage(text) {
  const content = text.trim();
  if (!content) return;

  addMessage("user", content);
  history.push({ role: "user", content });
  els.input.value = "";
  autoResize();
  els.send.disabled = true;

  const typing = addTyping();
  try {
    const reply = await askClaude(history);
    typing.remove();
    addMessage("bot", reply);
    history.push({ role: "assistant", content: reply });
  } catch (err) {
    typing.remove();
    addMessage("bot", `⚠️ ${err.message}`, { error: true });
    history.pop(); // drop the failed user turn so the user can retry
  } finally {
    els.send.disabled = false;
    els.input.focus();
  }
}

els.form.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage(els.input.value);
});

els.input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    els.form.requestSubmit();
  }
});

function autoResize() {
  els.input.style.height = "auto";
  els.input.style.height = `${els.input.scrollHeight}px`;
}
els.input.addEventListener("input", autoResize);

document.querySelectorAll(".chip").forEach((chip) =>
  chip.addEventListener("click", () => sendMessage(chip.textContent))
);

els.newChat.addEventListener("click", () => window.location.reload());
