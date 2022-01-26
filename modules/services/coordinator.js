const cicles = require('./cicles');

module.exports = {
     gameCoordinator (discordClient){

        discordClient.customEvents.on("phase_1", (voiceID) => {

            //Enviar Primera noche, lobos votan, y vidente ve
            discordClient.customEvents.emit("night", (voiceID));

        })

        discordClient.customEvents.on("night", async (voiceID) => {

            await cicles.night(voiceID, discordClient);

            //discordClient.customEvents.emit("day", voiceID);

        })

         /**
          * end var is used to determine whether the game should end or not / true > game must end
          */
         discordClient.customEvents.on("day", async (voiceID) => {

            let end = await cicles.day(voiceID, discordClient)

            if(!end){
                discordClient.customEvents.emit("night", voiceID);
            }else{
                discordClient.customEvents.emit("end", voiceID);
            }

        })


         discordClient.customEvents.on("end", async (voiceID) => {

             cicles.end(voiceID, discordClient);

         })
    }



}