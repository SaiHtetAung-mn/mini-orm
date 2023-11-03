const http = require('http');
const app = require('express')();
const User = require('./orm/User');

app.get('/user', async (req, res) => {
    res.json(
        await User.query().first()
    )
})

const server = http.createServer(app);

server.listen(3000, () => console.log('Server running'));