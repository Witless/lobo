const wait = require('util').promisify(setTimeout);
const {createGame} = require("../redis/schema");
const {gamePreparation} = require("../services/preparation")
const {Permissions, MessageActionRow, MessageButton} = require("discord.js")
let senderID = "";
let commandID = "";
let voiceID = "";




module.exports = {
    async buttonsHandler(client, interaction) {

        const args = interaction.customId.split(',');

        senderID = args[1]
        commandID = args[0]
        voiceID = args[2]

        if (senderID === interaction.member.id) {

            if (commandID === "public") {


                const botones = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('public,' + interaction.member.id)
                            .setLabel('Público')
                            .setStyle('PRIMARY')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId('private,' + interaction.member.id)
                            .setLabel('Privado')
                            .setStyle('SECONDARY')
                            .setDisabled(true),
                    )

                await interaction.guild.channels.create('Lobo (#12)',
                    {
                        type: 'GUILD_VOICE',
                        parent: '931592973500706867',
                        permissionOverwrites: [
                            {
                                id: senderID,
                                allow: [Permissions.FLAGS.MANAGE_ROLES, Permissions.FLAGS.MOVE_MEMBERS],
                            },
                        ],
                    }).then(async vc => {
                    await vc.setUserLimit(18)

                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('start,' + senderID + ',' + vc.id)
                                .setLabel('Comenzar')
                                .setStyle('SUCCESS'),
                        )

                    await interaction.update({
                        content: "Haz click en el botón cuando estéis todos los jugadores en el canal de voz",
                        components: [row],
                        ephemeral: true
                    })

                })

            } else if (commandID === "start") {

                //TODO mínimo de jugadores controlarlo aquí

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('start,finished')
                            .setLabel('Comenzar')
                            .setStyle('SUCCESS')
                            .setDisabled(true),
                    )

                await interaction.update({content: "La partida se ha creado y los roles han sido asignados", components:[row], ephemeral: true})

                const repository = await createGame({
                    guild_id: interaction.guild.id,
                    voice_channel_id: voiceID,
                    text_channel_id: interaction.channel.id,
                    creator: senderID,
                    wolfs_alive: [],
                    villagers_alive: [],
                    seer_alive: [],
                    wolfs_dead: [],
                    villagers_dead: [],
                    wolfs_vote: [],
                    villagers_vote: [],
                    state: 0
                })

                gamePreparation(voiceID, client, repository);
            }
        }
    }
}