const { operators, order } = require('./assets');

class QueryBuilder {
    query = {
        selects: ['*'],
        distinct: false,
        from: null,
        wheres: [],
        groups: [],
        having: [],
        orders: [],
        limit: null
    };

    constructor(tableName) {
        this.query.from = tableName;
    }
}

module.exports = QueryBuilder;