import { Client, Intents, TextChannel } from 'discord.js';
import { Bot } from './bot';
import config from './config';

const bot = new Bot();

const client = new Client({ intents: [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES
]});

client.once('ready', () => {
  console.log('Connected');
});

client.on('messageCreate', (message) => {
  bot.searchTriggers(message, client);
});

client.login(config.clientSecret);
