const events = require('events');
const eventEmitter = new events.EventEmitter();

module.exports = {
     gameCoordinator (discordClient){

        discordClient.customEvents.on("phase_1", (voiceID) => {
            console.log("EVENT PHASE 1 " + voiceID)
        })
    }



}