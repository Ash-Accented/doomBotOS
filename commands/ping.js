const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Replies with ping and latency information'),
  async execute(interaction) {
    console.log(`hey.`);
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true});
    const pingTime = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`EUREKA! THE BOT'S PING IS :mega: ${pingTime}ms`);
  },
};
