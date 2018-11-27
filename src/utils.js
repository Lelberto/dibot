/** Version */
const version = '1.0.2';

/** Configuration par défaut */
const defaultConfig = {
	token: 'invalid',
	command: 'dibot',
	startup: {
		enabled: true,
		tts_enabled: false
	},
	triggers: [
		{ word: 'di' },
		{ word: 'cri', transform_function: 'toUpperCase' }
	],
	max_trigger_count: 3,
	max_trigger_messages: []
};

/** Éléments à passer lors de l'application de la configuration */
const skippedElements = ['triggers', 'max_trigger_messages'];

/** Message d'aide */
const helpMsg =
`\`\`\`
!dibot                 : Affiche ce message (wow, incroyable)
!dibot info            : Affiche les informations à propos du BOT
!dibot status [on|off] : Gestion du BOT
!dibot tts [on|off]    : Gestion des messages TTS pour le BOT\`\`\``;

/** Message d'informations */
const infoMsg =
`Dibot (version ${version}) - Made with :heart: by Lelberto
> Source code : https://github.com/Lelberto/dibot
`;

module.exports = {
	version: version,
	defaultConfig: defaultConfig,
	skippedElements: skippedElements,
	helpMsg: helpMsg,
	infoMsg: infoMsg,
}