const {buttonsHandler} = require('../handlers/buttons')

module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction){

        if(!interaction.isCommand()){
            console.log("No te olvides cambiarme");
            if(interaction.isButton()){
              buttonsHandler(client, interaction);
            }
            return;
        }

        const command = client.commands.get(interaction.commandName);

        if(!command){
            return;
        }

        try{
            await command.execute(interaction);
        }catch (e){
            console.error(e);
            await interaction.reply({ content: 'Ha ocurrido un error, repórtalo si crees que es un bug:\n\n' +  e.name, ephemeral: true });
        }

    }
}