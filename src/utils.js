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
!dibot status [on|off] : Gestion du BOT
!dibot tts [on|off]    : Gestion des messages TTS pour le BOT
\`\`\``;

module.exports = {
	defaultConfig: defaultConfig,
	helpMsg: helpMsg
}