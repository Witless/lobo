require('dotenv').config();
const config = require("./config.json")
const fs = require('fs');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const {Client, Intents, Collection} = require("discord.js");
const {gameCoordinator} = require('./modules/services/coordinator');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES]});

client.commands = new Collection();

client.customEvents = eventEmitter;

gameCoordinator(client);

const commandFiles = fs.readdirSync('./modules/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./modules/commands/${file}`);
    client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./modules/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./modules/events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
    }
}


client.login(config.token);
