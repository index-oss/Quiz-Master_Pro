# Quiz-Master_Pro
A responsive, real-time multiplayer quiz game built with Supabase and TailwindCSS, featuring avatar selection, room-based gameplay, AI-powered answer explanations, live leaderboard, faculty dashboard, and gamified achievement badges | Perfect for improving grammar,  thinking skills, and having fun

# 🌐 Real-Time Multiplayer Quiz Game 🧠✨

An engaging, responsive multiplayer quiz game built for **learning**, **grammar improvement**, and **fun competitions**. Powered by **Supabase**, **TailwindCSS**, and **AI explanations** from **OpenRouter's Mistral 7B**.

---

## 🚀 Features

| Category                     | Feature Description                                                |
|-----------------------------|---------------------------------------------------------------------|
| 🎨 Theme & UI               | Professional UI with gradient themes and full mobile responsiveness |
| 🧑 Profile Customization    | Select username + fun emoji avatars                                 |
| 🏠 Room Management          | Create/join quiz rooms via Room ID                                  |
| ⏳ Waiting Room             | See other players join in real-time                                 |
| 🧠 AI-Enhanced Quiz         | Trivia + grammar questions with explanations from Mistral 7B        |
| ⌛ Countdown & Timer        | Visual timers synced across players                                 |
| 🎮 Multiplayer Ready        | WebSocket-ready structure for real-time game play                   |
| 📊 Leaderboard             | Live score updates, ranking, and emoji highlights                    |
| 🏅 Achievement Badges       | 4 Custom badges like 🧠 Grammar Guru & ⚡ Fast Thinker              |
| 🧑‍🏫 Faculty Dashboard      | View all player scores and stats in a clean UI                        |
| 📈 Game Summary             | Post-game recap of scores, answers, and badge awards                |
| 🔐 Auth & Database          | Supabase-powered login and game data                                |
| 🎨 Fully Responsive         | Optimized for mobile, tablet, and desktop                           |

---

## 🏗️ Tech Stack

- ⚙️ **Supabase** – Auth, DB, Realtime
- 💨 **TailwindCSS** – Beautiful, clean styling
- 🤖 **OpenRouter + Mistral 7B** – AI-powered answer explanations
- 🌐 **HTML + JS (Vanilla)** – Simple and modular SPA structure
- 🔌 **WebSockets (or Supabase Realtime)** – Real-time multiplayer sync

---

## 📁 File Structure

```

quiz-app/
│
├── public/                  → Static files & avatars
├── src/                     → Frontend SPA code
│   ├── components/          → Reusable UI (e.g. AvatarPicker, TimerBar)
│   ├── pages/               → SPA screens (e.g. JoinRoom, Game, Result)
│   ├── supabase/            → Auth, DB, Realtime logic
│   └── utils/               → Helpers (colors, badges, formatting)
│
├── backend/                 → Express server for secure OpenRouter calls
│   ├── routes/
│   │   └── explain.js
│   └── .env
│
├── .env                     → Supabase keys
├── tailwind.config.js
└── README.md

````

---

## 📸 Screenshots

> _(Coming soon)_ Responsive previews of:
- 📱 Mobile player view
- 💻 Desktop waiting room
- 🧠 Quiz question + timer
- 🏆 Leaderboard
- 🧑‍🏫 Admin Dashboard

---

## 🔑 Environment Setup

### 🔐 `.env` (Frontend)

```env
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_KEY=public-anon-key
````

### 🔐 `backend/.env`

```env
OPENROUTER_API_KEY=sk-your-openrouter-key
```

---

## 🧪 For Local Testing

* ✅ All features work with mock data (no Supabase needed initially)
* 🧑 Create fake players and join fake rooms
* 🧠 Questions fetched from [Open Trivia API](https://opentdb.com)

---

## 🧠 Badges System

| Badge            | Criteria                            |
| ---------------- | ----------------------------------- |
| 🧠 Grammar Guru  | Answers grammar questions correctly |
| ⚡ Fast Thinker   | Answers quickly & accurately        |
| 🎯 Accuracy Ace  | High overall accuracy               |
| 🔥 Streak Master | Multiple correct answers in a row   |

---

## 🎯 Roadmap

* [x] Avatar + Username Select
* [x] Room Create & Join
* [x] Waiting Room
* [x] Quiz Flow (Timer + Answer)
* [x] Leaderboard & Rank View
* [x] Faculty View & Scoreboard
* [x] Achievement Badge Logic
* [x] Mistral 7B AI Answer Explainer
* [ ] 🎉 Final Game Summary Screen
* [ ] 🔄 WebSocket Real-Time Quiz Flow
* [ ] 📈 Detailed Answer Stats Page

---

## 🤝 Contributing

Want to add new badges, game modes, or UI animations?
Feel free to fork and PR! This project is open for contributions. 💡

---

## 📜 License

MIT License © 2025 – Educational + Fun only

---

## 🙌 Made with ❤️ by You + ChatGPT

```

---

Would you like this `README.md` downloaded as a file or added to a starter template ZIP?
```

