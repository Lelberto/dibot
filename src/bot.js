// Dépendances
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
		this._disabled = {
			status: new Set(),	// BOT désactivé si le GuildID est dans l'ensemble
			tts: new Set()		// Messages TTS activés si le GuildID est dans l'ensemble
		};

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
				!this._disabled.status.has(msg.guild.id) && this._processMessage(msg);
			}
		});
	}

	/**
	 * Traite une commande.
	 *
	 * @private
	 *
	 * @param msg Message de la commande
	 */
	_processCommand(msg) {
		const guild = msg.guild;
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
						channel.send(`État du BOT sur ce serveur : ${!this._disabled.status.has(guild.id) ? ':white_check_mark: activé' : ':x: désactivé'}`);
						break;
					case 'on':
					case 'enable':
					case 'enabled':
						this._disabled.status.delete(guild.id);
						channel.send('BOT activé sur ce serveur');
						break;
					case 'off':
					case 'disable':
					case 'disabled':
						this._disabled.status.add(guild.id);
						channel.send('BOT désactivé sur ce serveur');
						break;
				}
				break;
			case 'tts':
				switch (args[1]) {
					default:
						channel.send(`Messages TTS pour le BOT sur ce serveur : ${this._disabled.tts.has(guild.id) ? ':white_check_mark: activés' : ':x: désactivés'}`);
						break;
					case 'on':
					case 'enable':
					case 'enabled':
						this._disabled.tts.delete(guild.id);
						channel.send('Messages TTS pour le BOT activés sur ce serveur');
						break;
					case 'off':
					case 'disable':
					case 'disabled':
						this._disabled.status.add(guild.id);
						channel.send('Messages TTS pour le BOT désactivés sur ce serveur');
						break;
				}
				break;
		}
	}

	/**
	 * Traite un message.
	 *
	 * @private
	 *
	 * @param msg Message à traiter
	 */
	_processMessage(msg) {
		const guild = msg.guild;
		const author = msg.author;
		const channel = msg.channel;
		const content = this._removeLinks(msg.content);

		if (author === this._client.user) {
			return;
		}

		const triggers = this._searchTriggers(content);
		for (let i = 0; i < triggers.length; i++) {
			if (i === this._config.max_trigger_count) {
				const maxTriggerMessages = this._config.max_trigger_messages;
				maxTriggerMessages.length > 0 && channel.send(maxTriggerMessages[_.random(0, maxTriggerMessages.length - 1)], { tts: this._disabled.tts.has(guild.id) });
				break;
			}

			const trigger = triggers[i];
			let reply = content.substring(trigger.index, content.length);
			if (trigger.data.transform_function) {
				reply = reply[trigger.data.transform_function]();
			}

			reply !== '' && channel.send(reply, { tts: this._disabled.tts.has(guild.id) });
		}
	}

	/**
	 * Supprime les liens contenus dans un message.
	 *
	 * @param content Contenu du message
	 */
	_removeLinks(content) {
		let elements = content.split(' ');
		if (elements.length === 0) {
			elements.push(content); // Ajout du contenu entier s'il n'y a aucun espace
		}

		let i = elements.length;
		while (i--) {
			const element = elements[i];
			if (element.startsWith('http')) {
				elements.splice(i, 1);
			}
		}
		return elements.join(' ');
	}

	/**
	 * Cherche les triggers dans un message.
	 * Cette méthode retourne une liste composé d'objets triggers ainsi que leur index dans le contenu du message.
	 *
	 * @private
	 *
	 * @param {String} content Contenu du message
	 *
	 * @return Liste de triggers
	 */
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

	/**
	 * Connecte le BOT à Discord.
	 */
	connect() {
		this._client.login(this._config.token);
	}

	/**
	 * Déconnecte le BOT de Discord.
	 */
	disconnect() {
		this._client.destroy();
		console.log('Dibot is offline');
	}
}

module.exports = Bot;