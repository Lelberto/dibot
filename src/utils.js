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
}

const helpMsg =
`\`\`\`
!dibot                 : Affiche ce message (wow, incroyable)
!dibot info            : Affiche les informations à propos du BOT
!dibot status [on|off] : Gestion du BOT
!dibot tts [on|off]    : Gestion des messages TTS pour le BOT\`\`\``;

const infoMsg =
`Dibot - Made with :heart: by Lelberto
> Twitter : https://twitter.com/Lelberto
> Source code : https://github.com/Lelberto/dibot
`;

module.exports = {
	defaultConfig: defaultConfig,
	helpMsg: helpMsg,
	infoMsg: infoMsg
}