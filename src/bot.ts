import { Channel, Client, Message, TextChannel } from 'discord.js';
import config from './config';

export class Bot {



  public constructor() {

  }

  public searchTriggers(message: Message, client: Client): void {
    const { channel, author, content } = message;

    if (author.id === client.user?.id) {
      return;
    }

    const lowerCaseContent = content.toLowerCase();
    const triggerData: { trigger: Trigger, index: number }[] = [];

    config.bot.triggers.forEach(trigger => {
      const triggerKey = typeof trigger === 'string' ? trigger : trigger.key;
      let currentIndex = lowerCaseContent.indexOf(triggerKey);

      if (currentIndex !== -1) {
        triggerData.push({ trigger, index: currentIndex + triggerKey.length});
      }

      while (currentIndex !== -1) {
        currentIndex = lowerCaseContent.indexOf(triggerKey, currentIndex + triggerKey.length);

        if (currentIndex !== -1) {
          triggerData.push({ trigger, index: currentIndex + triggerKey.length });
        }
      }
    });

    triggerData.sort((a, b) => a.index - b.index);

    triggerData.forEach((data, i) => {
      if (i > config.bot.max_triggers.max) {
        return;
      }

      if (i === config.bot.max_triggers.max) {
        channel.send(config.bot.max_triggers.messages[Math.floor(Math.random() * config.bot.max_triggers.messages.length)]);
        return;
      }

      const trigger = data.trigger;
      let reply = content.substring(data.index, content.length);
      if (typeof trigger !== 'string') {
        reply = trigger.transform(reply);
      }

      if (reply !== '') {
        channel.send(reply);
      }
    });
  }
}

export type Trigger = string | { key: string; transform: (value: string) => string };
