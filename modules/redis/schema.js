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

/**
 *
 * @param data PLAIN JS OBJECT
 * @returns {Promise<string>}
 */

module.exports = {

    async createGame(data) {
        const client = await connect();

        const repository = new Repository(gameSchema, client)


        if(await client.execute(['DBSIZE']) === 0){
            await repository.createIndex();
        }

        const game = repository.createEntity(data);

        const id = await repository.save(game);

        return repository;
    }

}