const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Grrrr 🐺'),
    async execute(interaction) {
        await interaction.reply('Auuuuuuuuuuuuuu 🌙');
    },
};