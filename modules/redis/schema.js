const {Client, Entity, Schema, Repository} = require("redis-om");
const {connect} = require("./init");

class Game extends Entity {}

let gameSchema = new Schema(
    Game,
    {
        guild_id: {type: "string"},
        voice_channel_id: {type: "string"},
        text_channel_id: {type: "string"},
        creator: {type: "string"},
        wolfs_alive: {type: "array"},
        villagers_alive: {type: "array"},
        seer_alive: {type: "array"},
        wolfs_vote: {type: "array"},
        villagers_vote: {type: "array"},
        wolfs_dead: {type: "array"},
        villagers_dead: {type: "array"},
        state: {type: "number"}
    },
    {
        dataStructure: "JSON",
    }
);

async function getRepository(gameSchema){

    const client = await connect();
    return client.fetchRepository(gameSchema);

}

/**
 *
 * @param data PLAIN JS OBJECT
 * @returns {Promise<string>}
 */

module.exports = {


    async createGame(data) {
        const client = await connect();

        const repository = getRepository(gameSchema);

        if(await client.execute(['DBSIZE']) === 0){
            await repository.createIndex();
        }

        const game = repository.createEntity(data);

        const id = await repository.save(game);

        return repository;
    },

    async getGame(voiceID) {

        const repository = getRepository(gameSchema);

        return await repository.search().where('voice_channel_id').equals(voiceID).return.first();

    },

    async modifyGame(game){

        const client = await connect();

        const repository = new Repository(gameSchema, client);

        await repository.save(game);

    }

}