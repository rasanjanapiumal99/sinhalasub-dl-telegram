require('dotenv').config(); // Load environment variables
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Load environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const API_KEY = process.env.API_KEY;

// Validate environment variables
if (!BOT_TOKEN || !CHANNEL_ID || !API_KEY) {
  console.error('Missing required environment variables. Please check your .env file.');
  process.exit(1);
}

// Initialize the bot with retry logic
function createBot() {
  const bot = new TelegramBot(BOT_TOKEN, { polling: true });

  // Handle polling errors (e.g., ECONNRESET)
  bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
    console.log('Retrying in 5 seconds...');
    setTimeout(createBot, 5000); // Retry after 5 seconds
  });

  // Utility function to check if a user is subscribed to the channel
  async function isUserSubscribed(chatId, userId) {
    try {
      const chatMember = await bot.getChatMember(CHANNEL_ID, userId);
      return ['member', 'administrator', 'creator'].includes(chatMember.status);
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  }

  // Function to search movies using the API
  async function searchMovies(query) {
    try {
      const response = await axios.get(
        `https://api.skymansion.site/movies-dl/search/?api_key=${API_KEY}&q=${encodeURIComponent(query)}`
      );
      return response.data.SearchResult?.result || [];
    } catch (error) {
      console.error('Error fetching movie data:', error.message);
      return null;
    }
  }

  // Function to fetch download links using the API
  async function fetchDownloadLinks(movieId) {
    try {
      const response = await axios.get(
        `https://api.skymansion.site/movies-dl/download/?id=${movieId}&api_key=${API_KEY}`
      );
      return response.data.downloadLinks?.result || null;
    } catch (error) {
      console.error('Error fetching download links:', error.message);
      return null;
    }
  }

  // Handle /start command
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = `🎬 *Welcome to the Movie Bot!* 🎬\n\n` +
      `This bot allows you to search for movies and get download links. To get started, simply type the name of a movie.\n\n` +
      `For example: *Deadpool*\n\n` +
      `Use /help for more information.`;

    bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
  });

  // Handle /help command
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `🆘 *Help Guide* 🆘\n\n` +
      `1. To search for a movie, simply type the name of the movie. For example: *Inception*\n\n` +
      `2. The bot will display search results with a "Download" button.\n\n` +
      `3. Click the "Download" button to get the download links.\n\n` +
      `4. Make sure you are subscribed to the channel to use this bot.\n\n` +
      `If you have any issues, please contact the bot administrator.`;

    bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
  });

  // Listen for any message
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    // Ignore commands (messages starting with '/')
    if (text.startsWith('/')) {
      return;
    }

    // Check if the user is subscribed to the channel
    const isSubscribed = await isUserSubscribed(chatId, userId);

    if (!isSubscribed) {
      // If not subscribed, send a message asking them to join
      bot.sendMessage(
        chatId,
        `Please subscribe to the channel to use this bot.`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Join Channel',
                  url: `https://t.me/${CHANNEL_ID.slice(1)}`, // Remove the '@' from the username
                },
              ],
            ],
          },
        }
      );
      return;
    }

    // If subscribed, search for movies using the API
    const movieData = await searchMovies(text);

    if (movieData && movieData.length > 0) {
      // Send each movie as a separate message with a "Download" button
      movieData.forEach((movie) => {
        const message = `🎬 *${movie.title}*\n📅 *Type:* ${movie.type}\n`;

        bot.sendPhoto(chatId, movie.img, {
          caption: message,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Download',
                  callback_data: `download_${movie.id}`,
                },
              ],
            ],
          },
        });
      });
    } else {
      bot.sendMessage(chatId, 'No results found or an error occurred.');
    }
  });

  // Handle "Download" button clicks
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const movieId = query.data.split('_')[1]; // Extract movie ID from callback data

    // Fetch download links for the selected movie
    const downloadData = await fetchDownloadLinks(movieId);

    if (downloadData) {
      // Format and send the download links
      let message = `🎬 *By skymansion.site*\n\n📅 *Date:* ${downloadData.date}\n🌍 *Country:* ${downloadData.country}\n⏱️ *Duration:* ${downloadData.duration}\n🎭 *Genres:* ${downloadData.genres.join(', ')}\n⭐ *IMDB:* ${downloadData.IMDB}\n🌟 *TMDB:* ${downloadData.TMDB}\n\n`;

      // Add Telegram download links
      if (downloadData.links.telegramLinks.length > 0) {
        message += '*Download Links:*\n';
        downloadData.links.telegramLinks.forEach((link) => {
          message += `📥 *${link.quality}* (${link.size}) - [Download](${link.link})\n`;
        });
      } else {
        message += 'No download links available.';
      }

      bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      });
    } else {
      bot.sendMessage(chatId, 'Failed to fetch download links.');
    }
  });

  console.log('Bot is running...');
}

// Start the bot
createBot();
