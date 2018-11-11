const fs = require('fs');
const yaml = require('js-yaml');



/**
 * Charge une configuration dans un fichier (YAML uniquement)
 *
 * @param path Chemin vers le fichier de configuration
 * @param {Function} callback Fonction de callback (paramètres : erreur, configuration chargée)
 */
function load(path, callback) {
	try {
		callback && callback(null, yaml.safeLoad(fs.readFileSync('config/config.yml'), 'utf-8'));
	} catch (err) {
		callback && callback(err);
	}
}

module.exports = {
	load: load
}