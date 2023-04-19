const {IntentsBitField} = require("discord.js");

class Intents {
	static LIST =
		[
			IntentsBitField.Flags.Guilds, // We need it for roles
			IntentsBitField.Flags.GuildMembers, // For tops
			IntentsBitField.Flags.GuildMessages, // We need to receive, send, update and delete messages
			IntentsBitField.Flags.GuildMessageReactions, // We need to add reactions
			IntentsBitField.Flags.DirectMessages, // We need to send and receive direct messages
			IntentsBitField.Flags.DirectMessageReactions // We need to receive direct messages reaction
		];
}

module.exports = Intents;