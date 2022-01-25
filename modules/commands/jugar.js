const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageActionRow, MessageButton} = require('discord.js')



module.exports = {
    data: new SlashCommandBuilder()
        .setName('jugar')
        .setDescription('Comienza un nuevo juego de lobo'),
    async execute(interaction) {

        let button0 = new MessageButton()
            .setCustomId('public,' + interaction.member.id + ',' + '0')
            .setLabel('Público')
            .setStyle('PRIMARY')
            .setDisabled(false);
        let button1 = new MessageButton()
            .setCustomId('private,' + interaction.member.id)
            .setLabel('Privado')
            .setStyle('SECONDARY')
            .setDisabled(false);

        button0['v'] = 0
        button1.v = 0

        const row = new MessageActionRow()
            .addComponents(
                button0,
                button1
            )


        await interaction.reply({
            content: "Selecciona si quieres que la partida sea Pública o Privada",
            components: [row],
            ephemeral: true
        });
    },
};