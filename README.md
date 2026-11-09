<h1 align="center">✦ Nova: AI Chat Assistant</h1>

<p align="center">
  <b>A clean, fast AI chat app powered by Claude, built with plain HTML, CSS and JavaScript.</b>
</p>

<p align="center">
  <a href="https://dev-iqrazainab.github.io/ai-chat-assistant/"><img src="https://img.shields.io/badge/▶%20Live-Demo-B46BFF?style=for-the-badge" /></a>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Claude%20API-D97757?style=for-the-badge&logo=anthropic&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-00C9FF?style=for-the-badge" />
</p>

---

## ✨ Features

- 💬 **Multi-turn chat** with full conversation memory
- 🧠 **Real AI answers** through the Anthropic Messages API (bring your own key)
- 🎭 **Demo mode** that works without any key, so the live demo always runs
- ⚙️ **Settings panel** for the API key, model and a custom system prompt
- 🧩 **Markdown rendering** for code blocks, inline code and bold, with HTML escaping for safety
- 💡 **Prompt suggestions** to start a chat in one click
- 📱 **Responsive, dark UI** that works on mobile and desktop
- 🔐 **Privacy-first:** the key stays in your browser and goes only to `api.anthropic.com`

## 🚀 Live Demo

👉 **[dev-iqrazainab.github.io/ai-chat-assistant](https://dev-iqrazainab.github.io/ai-chat-assistant/)**

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| UI | HTML5, CSS3 (custom properties, grid, animations) |
| Logic | Vanilla JavaScript (ES2022, `fetch`, `async/await`) |
| AI | Anthropic Claude Messages API |
| Hosting | GitHub Pages |

## 📁 Project Structure

```
ai-chat-assistant/
├── index.html   # Layout: header, chat, composer, settings dialog
├── style.css    # Dark gradient theme + responsive styles
├── app.js       # Chat logic, API calls, demo mode, markdown rendering
└── README.md
```

## 💻 Run Locally

```bash
git clone https://github.com/Dev-IqraZainab/ai-chat-assistant.git
cd ai-chat-assistant
npx serve .      # or just open index.html in your browser
```

1. Open the app, then click **⚙ Settings**
2. Paste your Anthropic API key (get one from the [Anthropic Console](https://console.anthropic.com/))
3. Start chatting 🎉

## 🧠 How It Works

```
User message ──► history[] ──► fetch(api.anthropic.com/v1/messages)
                                  │
             ◄── render markdown ◄┘   (no key? ──► demoReply())
```

- Each message is pushed to a `history` array in the Messages API format (`{ role, content }`).
- The whole history is sent on every request, so the model remembers the conversation.
- If no key is saved, `demoReply()` returns canned answers so the UI is always demoable.

## 🗺️ Roadmap

- [ ] Streaming responses (token by token)
- [ ] Save chats to local storage
- [ ] Voice input with the Web Speech API
- [ ] Light/dark theme toggle

## 👩‍💻 Author

**Iqra Zainab**: AI & Unity Game Developer | Metaverse & Web3

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github)](https://github.com/Dev-IqraZainab)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/iqra-zainab/)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=flat-square&logo=googlechrome&logoColor=white)](https://dev-iqrazainab.blogspot.com/)

📄 Licensed under the [MIT License](LICENSE).
