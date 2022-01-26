const {Client, Entity, Schema, Repository} = require("redis-om");

const client = new Client();

module.exports = {
    async connect() {
        if (!client.isOpen()) {
            await client.open(process.env.REDIS_URL);
        }
        return client;
    },


}