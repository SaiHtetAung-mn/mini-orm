const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    port: '3306',
    database: 'test'
});

connection.connectDB = () => {
    connection.connect((err) => {
        if(err) throw err;

        console.log('Database connected successfully')
    });
}

connection.disconnect = () => {
    connection.end(err => {
        if(err) throw err;
    })
}

module.exports = connection;