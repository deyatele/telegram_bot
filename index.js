const token = '1991658928:AAEKCK09XXETBaOgTKEvn184uqoFEZtne0E';
process.env.NTBA_FIX_319 = 1;
const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');

const bot = new TelegramApi(token, {
  polling: true,
});

const chats = [];

const gameStart = async (chatId) => {
  try {
    await bot.sendMessage(
      chatId,
      `Сейчас я загадаю цифру от 0 до 9, а ты должен угадать`,
    );
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Выбери число:`, gameOptions);
  } catch (e) {
    console.log('///////////////', e);
  }
};

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Приветствие' },
    { command: '/info', description: 'Информация о пользователе' },
    { command: '/game', description: 'Игра' },
  ]);

  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/050/4f7/0504f773-c9bf-45ca-85be-dc7f70109dc8/10.webp',
      );
      return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот Деятеля`);
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
    }
    if (text === '/game') {
      return gameStart(chatId);
    }
    return bot.sendMessage(chatId, `Я тебя не понимаю`);
  });

  bot.on('callback_query', (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return gameStart(chatId);
    }
    if (data == chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты угадал цифру ${data}`,
        againOptions,
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению ты не угадал загаданную цифру: ${chats[chatId]}, а ты ответил: ${data}`,
        againOptions,
      );
    }
  });
};

start();
