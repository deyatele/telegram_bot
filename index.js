const { token } = require('./procesEnv');
const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');
const sequelize = require('./db');
const UserModel = require('./models');
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
    chats.gameQ = randomNumber;
    console.log(chats.gameQ)
    await bot.sendMessage(chatId, `Выбери число:`, gameOptions);
  } catch (e) {
    console.log(e);
  }
};

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (error) {
    console.log(error);
  }

  bot.setMyCommands([
    { command: '/start', description: 'Запуск бота' },
    { command: '/info', description: 'Информация о пользователе' },
    { command: '/game', description: 'Игра' },
    // { command: '/location', description: 'Место положение' },
    // { command: '/contact', description: 'Контакт' },
    // { command: '/venue', description: 'Место встречи' },
  ]);
  try {
    bot.on('message', async (msg) => {
      const text = msg.text;
      const chatId = msg.chat.id;
      if (text === '/start' || text === 'start') {
        console.log(chatId)
        await UserModel.create({ chatId });
        chats.chatId = chatId;
        await bot.sendSticker(
          chatId,
          'https://tlgrm.ru/_/stickers/050/4f7/0504f773-c9bf-45ca-85be-dc7f70109dc8/10.webp',
        );
        return bot.sendMessage(
          chatId,
          `Добро пожаловать в телеграм бот Деятеля`,
        );
      }
      if (text === '/contact' || text === 'contact') {
        return bot.sendContact(chatId, '+7-999-999-99-99', msg.chat.first_name);
      }
      if (text === '/location' || text === 'location') {
        return bot.sendLocation(msg.chat.id, 56.328436, 44.003112);
      }
      if (text === '/venue' || text === 'venue') {
        return bot.sendVenue(
          chatId,
          56.328436,
          44.003112,
          'Место встречи',
          'Кремль',
          ['Другие ....'],
        );
      }

      if (text === '/info' || text === 'info') {
        const user = await UserModel.findOne({ chatId });
        return bot.sendMessage(
          chatId,
          `${msg.from.first_name}, в игре у тебя правильных ответов ${user.right}, а неправильных: ${user.wrong} `,
        );
      }
      if (text === '/game' || text === 'game') {
        return gameStart(chatId);
      }
      return bot.sendMessage(chatId, `Я тебя не понимаю`);
    });
  } catch (error) {
    return bot.sendMessage(
      chatId,
      'Произошла какая то ошибка, попробуйте еще раз',
    );
  }

  bot.on('callback_query', async(msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return gameStart(chatId);
    }
    const user = await UserModel.findOne({ chatId });
    if (data == chats.gameQ) {
      user.right += 1;
      await bot.sendMessage(
        chatId,
        `Поздравляю, ты угадал цифру ${data}`,
        againOptions,
      );
    } else {
      user.wrong += 1;
      await bot.sendMessage(
        chatId,
        `К сожалению ты не угадал загаданную цифру: ${chats.gameQ}, а ты ответил: ${data}`,
        againOptions,
      );
    }
    await user.save();
  });
};

start();
