// Dépendances
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
		callback && callback(null, yaml.safeLoad(fs.readFileSync(path), 'utf-8'));
	} catch (err) {
		callback && callback(err);
	}
}

/**
 * Applique une configuration avec une configuration par défaut.
 * Cette fonction valide une configuration en ajoutant les éléments par défaut s'ils n'existent pas.
 *
 * @param config Configuration à appliquer
 * @param defaultConfig Configuration par défaut
 * @param skippedElements {Array} Éléments de configuration à éviter lors de l'applications
 */
function apply(config, defaultConfig, skippedElements = []) {
	for (const key in defaultConfig) {
		if (skippedElements.includes(key)) {
			continue;
		}
		const defaultConfigKey = defaultConfig[key];
		const configKey = config[key];
		if (configKey instanceof Object) {
			apply(configKey, defaultConfigKey); // Ré-application de la section de configuration
		} else if (configKey === undefined) {
			config[key] = defaultConfigKey; // Application par défaut
		}
	}
}

module.exports = {
	load: load,
	apply: apply
}