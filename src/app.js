// Dépendances
const config = require('./configuration');
const Bot = require('./bot');



// Chargement de la configuration
config.load('config/config.yml', (err, config) => {
	if (err) {
		console.error(err);
		return;
	}

	// Création du BOT
	const bot = new Bot(config);
	process.on('SIGINT', () => {
		bot.disconnect();
		process.exit();
	});
	bot.connect();
});
