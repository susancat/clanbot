const config = require("./config");
const { Client, EmbedBuilder, IntentsBitField } = require('discord.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers, 
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.DirectMessages,
		IntentsBitField.Flags.DirectMessageReactions 
  ]
});

const General = config.generalChannelId;
const GuildID = config.guildId;
const Welcome = config.welcomeChannelId;
const Clan1 = config.clan1ChannelId;
const Clan2 = config.clan2ChannelId;
const Clan3 = config.clan3ChannelId;
// const Verified = config.Verified;
const TBC_holder = config.TBC_holder;
const MAP_holder = config.MAP_holder;
const TOWER_owner = config.TOWER_owner;

const VerifiedRoleIDs = [TBC_holder, MAP_holder, TOWER_owner];

const clans = [
  { name: 'Clan_1', id: Clan1 },
  { name: 'Clan_2', id: Clan2 },
  { name: 'Clan_3', id: Clan3 }
];

const hasClanRole = (user) => {
  return clans.some((clan) => user.roles.cache.has(clan.id));
};

client.on("ready", async() => {
  client.users.cache.clear();
  const guild = client.guilds.cache.get(GuildID);

  await guild.roles.fetch();
  client.guilds.cache.forEach(guild => {
    guild.members.cache.forEach(member => {
      guild.members.fetch();
      member.roles.cache.clear();
    });
  });
  console.log("The bot is ready!");
});

client.on("guildMemberAdd", async (member) => {
  // Send a message to the member in the welcome channel
  const welcomeChannel = client.channels.cache.get(Welcome);
  welcomeChannel.send(
    `Welcome to the server, ${member}! Please complete the verification process on Collab.land to get started.`
  );
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
  const generalChannel = client.channels.cache.get(General);
  const oldRoles = await oldMember.roles.cache;
  const newRoles = await newMember.roles.cache;
  //will return a role from the current server
  const Clan1Role = await newMember.guild.roles.cache.find(role => role.name === "Clan_1");
  const Clan2Role = await newMember.guild.roles.cache.find(role => role.name === "Clan_2");
  const Clan3Role = await newMember.guild.roles.cache.find(role => role.name === "Clan_3");
  const clanRolesToRemove = [Clan1Role, Clan2Role, Clan3Role]; 

    const oldHasRoleA = oldRoles.some((role) => role.id === VerifiedRoleIDs[0]);//return a boolean
    const newHasRoleA = newRoles.some((role) => role.id === VerifiedRoleIDs[0]);
    const oldHasRoleB = oldRoles.some((role) => role.id === VerifiedRoleIDs[1]);
    const newHasRoleB = newRoles.some((role) => role.id === VerifiedRoleIDs[1]);
    const oldHasRoleC = oldRoles.some((role) => role.id === VerifiedRoleIDs[2]);
    const newHasRoleC = newRoles.some((role) => role.id === VerifiedRoleIDs[2]);

    if (!oldHasRoleA && newHasRoleA || !oldHasRoleB && newHasRoleB || !oldHasRoleC && newHasRoleC) {
      await generalChannel.send(
        `Congratulations, ${newMember} to be a hero!`
      );

      if (hasClanRole(newMember)) {
        console.log(`${newMember} already has a clan role, skipping role selection`);
      } else {
      const embed = new EmbedBuilder()
      .setTitle('Please click to choose a clan')
      .setDescription('React with the corresponding emoji to make your selection')
      .addFields(
        { name: ':one: Clan 1', value: 'the first clan' },
        { name: ':two: Clan 2', value: 'the second clan' },
        { name: ':three: Clan 3', value: 'the third clan' }
      )

    const message = await generalChannel.send({ embeds: [embed] });
    await message.react('1️⃣');
    await message.react('2️⃣');
    await message.react('3️⃣');

    const collectorFilter = (reaction, user) => {
      const isEmojiValid = ['1️⃣', '2️⃣', '3️⃣'].includes(reaction.emoji.name);
      const isUserNotBot = !user.bot;
      const isUserNewMember = user.id === newMember.id;//doesn't work---line 116 works
      return isEmojiValid && isUserNotBot && isUserNewMember;
    };
    
    const collector = message.createReactionCollector(collectorFilter, { time: 60000 });
    
    collector.on('collect', async(reaction, user) => {
      if (user == newMember.id) {
        switch (reaction.emoji.name) {
          case '1️⃣':
            newMember.roles.add(Clan1Role);
            const clan1Channel = client.channels.cache.get(Clan1);
            await clan1Channel.send(
              `Welcom, ${newMember} to join our clan!`
            );
            break;
          case '2️⃣': 
            newMember.roles.add(Clan2Role);
            const clan2Channel = client.channels.cache.get(Clan2);
            await clan2Channel.send(
              `Welcom, ${newMember} to join our clan!`
            );
            break;
          case '3️⃣':
            newMember.roles.add(Clan3Role);
            const clan3Channel = client.channels.cache.get(Clan3);
            await clan3Channel.send(
              `Welcom, ${newMember} to join our clan!`
            );
            break;
          default:
            break;
        }
        collector.stop(); 
      }
    });
  } 
} else if (oldHasRoleA && !newHasRoleA || oldHasRoleB && !newHasRoleB || oldHasRoleC && !newHasRoleC) {
    clanRolesToRemove.forEach(role => {
      if (newMember.roles.cache.has(role.id)) {
        console.log("clan role: " + role);
        newMember.roles.remove(role);
        generalChannel.send(
          `${newMember}, You've lost your verified role and clan role!`
        );
      }
    });
  }
})
// Log the bot in using the token
client.login(config.token);