const http = require('http');
const app = require('express')();
const User = require('./orm/User');
const Schema = require('./orm/schema');
let user = new User();

Schema.create('users', (table) => {
    table.integer('id')
         .primary()
         .autoIncrement()
         .unique();
    table.string('name', 30)
         .default(null);
})

app.get('/user', async (req, res) => {
    res.json(
        await User.query().create({ name: 'Sai Htet Aung', email: 'sha@gmail.com' })
    )
})

const server = http.createServer(app);

server.listen(3000, () => console.log('Server running'));