# 🎥 Telegram Movie Bot

A Telegram bot that allows users to search for movies and get download links. Users must subscribe to a specific channel to use the bot.

🌐 **Live Bot:** [@sinhalasubDLbot](https://t.me/sinhalasubDLbot)

---

## 🚀 Features

- Search for movies by name.
- Get download links for movies.
- Restrict bot usage to channel subscribers.
- Modern and user-friendly interface.

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/rasanjanapiumal99/sinhalasub-dl-telegram.git
cd sinhalasub-dl-telegram
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Rename `.env.example` to `.env` and fill in the required values:

```plaintext
BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
CHANNEL_ID=YOUR_CHANNEL_ID
API_KEY=YOUR_API_KEY
```

- **BOT_TOKEN**: Get your bot token from [BotFather](https://t.me/BotFather).
- **CHANNEL_ID**: Your Telegram channel username (e.g., `@myawesomechannel`).
- **API_KEY**: Get a free API key from [SkyMansion API](https://api.skymansion.site/movies-dl/).

### 4. Run the Bot

```bash
node index.js
```

---

## 🌐 Deploy to Koyeb

1. Push your code to GitHub.
2. Go to the [Koyeb Dashboard](https://app.koyeb.com/).
3. Create a new app and connect your GitHub repository.
4. Set the **Port** to `8000`.
5. Add your environment variables (`BOT_TOKEN`, `CHANNEL_ID`, `API_KEY`).
6. Click **Deploy**.

---

## 📄 API Documentation

Get a free API key and learn more about the API at [SkyMansion API](https://api.skymansion.site/movies-dl/).

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

- [Sinhalasub.lk](https://sinhalasub.lk/) for providing movie data and resources.
- [SkyMansion API](https://api.skymansion.site/movies-dl/) for providing the movie search and download API.
- [Node.js](https://nodejs.org/) and [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) for building the bot.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

