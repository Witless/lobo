const db = require("../redis/schema");
const {MessageEmbed} = require("discord.js");


module.exports = {

    async night(voiceID, discordClient){

        let game = await db.getGame(voiceID);

        game.wolfs_alive.forEach(loboID => {
            discordClient.users.cache.get(loboID).send({
                embeds: [new MessageEmbed().setTitle("Votal al aldeano").setDescription("De la siguiente lista")]
            })
        })

    }

}