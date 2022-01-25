module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log("Auuuuuuuuuuuuuu 🌙 Client: " + client.user.id + " logged in");
    }
}