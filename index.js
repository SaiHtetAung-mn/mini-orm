const http = require('http');
const app = require('express')();

const Builder = require('./orm/query-builder');
const QueryBuilder = new Builder('users');

app.get('/', (req, res) => {
    res.end(
        QueryBuilder
            .where('name', '=', 'Sai Htet Aung')
            .where('email', '=', 'sha@gmail.com')
            .where('age', '>', 22)
            .orWhere('password', '=', '1232')
            .whereIn('name', [1, 2, 4])
            .select(['name', 'email', 'password'])
            .distinct()
            .groupBy('name')
            .havingNotBetween('id', 1, 2)
            .having('name', '=', 'sai')
            .orderBy('id', 'desc')
            .orderBy('name')
            .limit(10)
            .toRawSQL()
    );
})

const server = http.createServer(app);

server.listen(3000, () => console.log('Server running'));