const { MessageEmbed } = require("discord.js");

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function buildRoleBasedEmbeds(name, image, description){
    return new MessageEmbed().setImage(image).setTitle('¡Tu rol es '+ name + '!').setDescription(description)
}

module.exports = {
    async gamePreparation (voiceID, discordClient, repository){

        let gameObject = await repository.search().where('voice_channel_id').equals(voiceID).return.all();
        

        gameObject[0].state = 56;


        await discordClient.guilds.cache.get(gameObject[0].guild_id).channels.cache.get(gameObject[0].voice_channel_id).fetch(true).then(
            voiceChannel => {

                

                const voiceMembersSize = voiceChannel.members.size;
                voiceChannel.setUserLimit(voiceMembersSize, 'Juego comenzado')

                if(voiceMembersSize < 3){
                    return;
                }

                

                
                let lobosSize = 1 //TODO Cambiar esto, solo está puesto por motivos de tests

                if(voiceMembersSize >= 12 && voiceMembersSize <= 17){
                    lobosSize = 3;
                }else if(voiceMembersSize >= 18){
                    lobosSize = 4;
                }

                let rolesArray = []

                //Villagers are considered 0 in the "rolesArray", Wolfs are considered 1, Seer is 2

                for(let i = 0; i < voiceMembersSize; i++){
                    rolesArray[i] = 0
                }
                while(lobosSize > 0){
                    const randomNumber = randomIntFromInterval(0, voiceMembersSize-1);
                    if(rolesArray[randomNumber] !== 1){
                        rolesArray[randomNumber] = 1;
                        lobosSize--;
                    }
                }

                let exitFlag = true;

                while(exitFlag){
                    const randomNumber = randomIntFromInterval(0, voiceMembersSize-1);
                    if(rolesArray[randomNumber] !== 1){
                        rolesArray[randomNumber] = 2;
                        exitFlag = false;
                    }
                }

                let i = 0;
                let ctrlFlag = 1;

                voiceChannel.members.forEach((member) => {
                        if (rolesArray[i] === 0) {
                            gameObject[0].villagers_alive.push(member.id);
                            member.send({embeds: [buildRoleBasedEmbeds('Aldeano', 'https://i.imgur.com/1r5cKGG.png', 'Junto a tus compañeros, acaba con los lobos')]}).catch(() => {
                                ctrlFlag = 0;
                                discordClient.guilds.cache.get(gameObject[0].guild_id).channels.cache.get(gameObject[0].text_channel_id).send({embeds:[new MessageEmbed().setTitle('Juego Cancelado').setDescription('Error a la hora de enviar un rol por MD, todos debéis tenerlos abiertos' +
                                        '\n\nPersona que tiene los MDs cerrados: <@'+member.id+'>')]})
                                discordClient.guilds.cache.get(gameObject[0].guild_id).channels.cache.get(gameObject[0].voice_channel_id).delete("Error provocado por jugador")
                            })
                        } else if (rolesArray[i] === 1) {
                            gameObject[0].wolfs_alive.push(member.id);
                            member.send({embeds: [buildRoleBasedEmbeds('Lobo', 'https://i.imgur.com/W0Fzfcv.png', 'Debes acabar con el resto de aldeanos')]}).catch(() => {
                                ctrlFlag = 0;
                                discordClient.guilds.cache.get(gameObject[0].guild_id).channels.cache.get(gameObject[0].text_channel_id).send({embeds:[new MessageEmbed().setTitle('Juego Cancelado').setDescription('Error a la hora de enviar un rol por MD, todos debéis tenerlos abiertos' +
                                        '\n\nPersona que tiene los MDs cerrados: <@'+member.id+'>')]})
                                discordClient.guilds.cache.get(gameObject[0].guild_id).channels.cache.get(gameObject[0].voice_channel_id).delete("Error provocado por jugador")
                            })
                        } else if (rolesArray[i] === 2){
                            gameObject[0].seer_alive.push(member.id);
                            member.send({embeds: [buildRoleBasedEmbeds('Vidente', 'https://i.imgur.com/0jv7iac.png', 'Podrás ver el rol de un jugador cada noche')]}).catch(() => {
                                ctrlFlag = 0;
                                discordClient.guilds.cache.get(gameObject[0].guild_id).channels.cache.get(gameObject[0].text_channel_id).send({embeds:[new MessageEmbed().setTitle('Juego Cancelado').setDescription('Error a la hora de enviar un rol por MD, todos debéis tenerlos abiertos' +
                                        '\n\nPersona que tiene los MDs cerrados: <@'+member.id+'>')]})
                                discordClient.guilds.cache.get(gameObject[0].guild_id).channels.cache.get(gameObject[0].voice_channel_id).delete("Error provocado por jugador")
                            })
                        }
                        i++;
                })

                if(ctrlFlag) {

                    

                    repository.save(gameObject[0])

                    const messageEmbed = new MessageEmbed()
                        .setColor("AQUA")
                        .setTitle('Comienza el juego')
                        .setDescription('Los roles ya se han repartido por MD\n\nTenéis un tiempo para verlo, en 30 segundos comenzará la primera noche...')
                        .setImage('https://i.imgur.com/bro6J8Q.png')

                    discordClient.guilds.cache.get(gameObject[0].guild_id).channels.cache.get(gameObject[0].text_channel_id).send({embeds: [messageEmbed]})

                    discordClient.customEvents.emit("phase_1", [11111])

                }
            }
        )


    }
}
