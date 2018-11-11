const config = require('./configuration');
const Bot = require('./bot');


config.load('config/config.yml', (err, config) => {
	if (err) {
		console.error(err);
		return;
	}

	const bot = new Bot(config);
	process.on('SIGINT', () => {
		bot.disconnect();
		process.exit();
	});
	bot.connect();
});
