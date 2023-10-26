const connection = require('./connection');
connection.connectDB();

class Model {
    static _table;

    static primaryKey = 'id';

    static create(data) {
        if(typeof data !== 'object') throw new Error('Invalid parameter passed! Parameter must be object');

        const valueStr = Object.values(data).map(val => isNaN(val) ? `"${val}"` : val).join(',');
        const query = `insert into ${this._table} (${Object.keys(data).join(',')}) values(${valueStr})`;

        connection.query(query, (err, result) => {
            if(err) throw err;
            return result;
        })
    }

    static all() {
        return new Promise((resolve, reject) => {
            const query = `select * from ${this._table}`;
            connection.query(query, (err, result) => {
                if(err) return reject(err);

                resolve(result);
            })
        })
    }

    static findOne(id) {
        return new Promise((resolve, reject) => {
            const query = `select * from ${this._table} where ${this.primaryKey}=${id}`;
            connection.query(query, (err, result) => {
                if(err) return reject(err);

                if(!result[0]) return null;

                const newObj = Object.assign({}, result[0]);
                resolve(newObj);
            })
        })
    }
}

function createModel(tableName) {
    return class extends Model {
        static _table = tableName;
    }
}

module.exports = { createModel }