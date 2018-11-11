const _ = require('lodash');
const Discord = require('discord.js');
const config = require('./configuration');
const utils = require('./utils');



/**
 * Classe gérant le BOT.
 */
class Bot {

	/**
	 * Construit un nouveau BOT.
	 *
	 * @constructor
	 *
	 * @param config Configuration du BOT
	 */
	constructor(config = utils.defaultConfig) {
		this._config = config;
		this._client = new Discord.Client();
		this._enabled = config.startup.enabled;
		this._ttsEnabled = config.startup.tts_enabled;

		this._client.on('ready', () => {
			console.log('Dibot is online');
			this._client.user.setActivity(`!${config.command}`);
		});
		this._client.on('error', (err) => {
			console.error(err.message);
		});

		this._client.on('message', (msg) => {
			if (msg.content.startsWith(`!${this._config.command}`)) { // Si c'est une commande
				this._processCommand(msg);
			} else {
				this._enabled && this._processMessage(msg);
			}
		});
	}

	_processCommand(msg) {
		const channel = msg.channel;
		const content = msg.content;
		const args = content.toLowerCase().substring(this._config.command.length + 2, content.length).split(' ');

		switch (args[0]) {
			default:
				channel.send(utils.helpMsg);
				break;
			case 'info':
			case 'infos':
				channel.send(utils.infoMsg);
				break;
			case 'status':
				switch (args[1]) {
					default:
						channel.send(`État du BOT : ${this._enabled ? ':white_check_mark: activé' : ':x: désactivé'}`);
						break;
					case 'on':
					case 'enable':
					case 'enabled':
						this._enabled = true;
						channel.send('BOT activé');
						break;
					case 'off':
					case 'disable':
					case 'disabled':
						this._enabled = false;
						channel.send('BOT désactivé');
						break;
				}
				break;
			case 'tts':
				switch (args[1]) {
					default:
						channel.send(`Messages TTS pour le BOT : ${this.ttsEnabled ? ':white_check_mark: activés' : ':x: désactivés'}`);
						break;
					case 'on':
					case 'enable':
					case 'enabled':
						this._ttsEnabled = true;
						channel.send('Messages TTS pour le BOT activés');
						break;
					case 'off':
					case 'disable':
					case 'disabled':
						this._ttsEnabled = false;
						channel.send('Messages TTS pour le BOT désactivés');
						break;
				}
				break;
		}
	}

	_processMessage(msg) {
		const author = msg.author;
		const channel = msg.channel;
		const content = msg.content;

		if (author === this._client.user) {
			return;
		}

		const triggers = this._searchTriggers(content);
		for (let i = 0; i < triggers.length; i++) {
			if (i === this._config.max_trigger_count) {
				const maxTriggerMessages = this._config.max_trigger_messages;
				maxTriggerMessages.length > 0 && channel.send(maxTriggerMessages[_.random(0, maxTriggerMessages.length - 1)], { tts: this._ttsEnabled });
				break;
			}

			const trigger = triggers[i];
			let reply = content.substring(trigger.index, content.length);
			if (trigger.data.transform_function) {
				reply = reply[trigger.data.transform_function]();
			}

			reply !== '' && channel.send(reply, { tts: this._ttsEnabled });
		}
	}

	_searchTriggers(content) {
		const contentLowerCase = content.toLowerCase();
		const triggers = [];

		// Récupération des index des triggers dans le contenu
		this._config.triggers.forEach((trigger) => {
			const word = trigger.word;
			let currentIndex = contentLowerCase.indexOf(word);
			if (currentIndex !== -1) {
				triggers.push({
					data: trigger,
					index: currentIndex + word.length
				});
			}
			while (currentIndex !== -1) {
				currentIndex = contentLowerCase.indexOf(word, currentIndex + word.length);
				if (currentIndex !== -1) {
					triggers.push({
						data: trigger,
						index: currentIndex + word.length
					});
				}
			}
		});
		triggers.sort((a, b) => {
			return (a.index < b.index) ? -1 : (a.index > b.index) ? 1 : 0;
		});

		return triggers;
	}

	connect() {
		this._client.login(this._config.token);
	}

	disconnect() {
		this._client.destroy();
		console.log('Dibot is offline');
	}

	get enabled() {
		return this._enabled;
	}

	set enabled(enabled = config.startup.enabled) {
		this._enabled = enabled;
	}

	get ttsEnabled() {
		return this._ttsEnabled;
	}

	set ttsEnabled(ttsEnabled = config.startup.ttsEnabled) {
		this._ttsEnabled = ttsEnabled;
	}
}

module.exports = Bot;