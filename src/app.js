// Dépendances
const { defaultConfig, skippedElements } = require('./utils');
const config = require('./configuration');
const Bot = require('./bot');



// Chargement de la configuration
config.load('config/config-test.yml', (err, result) => {
	if (err) {
		console.error(err);
		return;
	}

	config.apply(result, defaultConfig, skippedElements);

	// Création du BOT
	const bot = new Bot(result);
	process.on('SIGINT', () => {
		bot.disconnect();
		process.exit();
	});
	bot.connect();
});
