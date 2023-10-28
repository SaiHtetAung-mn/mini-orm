const { operators, orderDirection, whereType, havingType } = require('./assets');

class QueryBuilder {
    #queryObj = {
        selects: [],
        distinct: false,
        from: null,
        wheres: [],
        groups: [],
        havings: [],
        orders: [],
        limit: null,
        offset: null
    };

    constructor(tableName) {
        this.#queryObj.from = tableName;
    }

    #getSelectQuery() {
        if(this.#queryObj.selects.length === 0) return '*';

        return this.#queryObj.selects.join(', ');
    }

    #getWhereQuery() {
        const whereAry = this.#queryObj.wheres.map((where, index) => {
            const { type, column, operator, value, values, boolean } = where;

            if(type == whereType.BASIC)
                return `${index == 0 ? '' : boolean} ${column} ${operator} ${value}`.trim();

            if(type == whereType.IN)
                return `${index == 0 ? '' : boolean} ${column} in (${values})`.trim();
        });

        return whereAry.join(' ') || null;
    }

    #getGroupByQuery() {
        return this.#queryObj.groups.join(' ') || null;
    }

    #getHavingQuery() {
        const havingAry = this.#queryObj.havings.map((having, index) => {
            const { type, column, operator, value, value1, value2, boolean, not } = having;

            if(type == havingType.BASIC) 
                return `${index == 0 ? '' : boolean} ${column} ${operator} ${value}`.trim();

            if(type == havingType.BETWEEN) 
                return `${index == 0 ? '' : boolean} ${column} ${not ? 'not' : ''} between ${value1} and ${value2}`.trim();
        });

        return havingAry.join(' ') || null;
    }

    #getOrderQuery() {
        return this.#queryObj.orders
            .map(order => `'${order.column}' ${order.direction}`)
            .join(', ')
            || null;
    }

    #build() {
        const qAry = [
            'SELECT',
            this.#queryObj.distinct ? 'DISTINCT' : null,
            this.#getSelectQuery(),
            'FROM',
            `'${this.#queryObj.from}'`,
            ...(this.#queryObj.wheres.length > 0 ? ['WHERE', this.#getWhereQuery()] : [null]),
            ...(this.#queryObj.orders.length > 0 ? ['ORDER BY', this.#getOrderQuery()] : [null]),
            ...(this.#queryObj.groups.length > 0 ? ['GROUP BY', this.#getGroupByQuery()] : [null]),
            ...(this.#queryObj.havings.length > 0 ? ['HAVING', this.#getHavingQuery()] : [null]),
            ...(this.#queryObj.limit ? ['LIMIT', this.#queryObj.limit] : [null])
        ];

        return qAry.filter(item => item).join(' ');
    }

    #commonWhere({ type, column, operator, value=undefined, values=undefined, boolean="and"}) {
        if(type == whereType.BASIC) {
            if(!operators.includes(operator)) throw new Error(`Invalid operator '${operator}'.`);
        }

        if(type == whereType.IN) {
            if(!Array.isArray(values)) throw new Error(`Argument must be iteratable array for where in clause`);
        }

        const whereObj = { type, column: `'${column}'`, boolean };

        if(type == whereType.BASIC) {
            whereObj.operator = operator;
            whereObj.value = typeof value == 'string' ? `'${value}'` : value;
        }
        else if(type == whereType.IN) {
            whereObj.values = values.map(val => typeof val == 'string' ? `'${val}'` : val);
        }

        this.#queryObj.wheres.push(whereObj);
        return this;
    }

    #commonHaving({ type, column, operator, value=undefined, value1=undefined, value2=undefined, boolean="and", not=false }) {
        if(type == havingType.BASIC) {
            if(!operators.includes(operator)) throw new Error(`Invalid operator '${operator}'.`);
        }

        const havingObj = { type, column: `'${column}'`, boolean };
        if(type == havingType.BASIC) {
            havingObj.operator = operator;
            havingObj.value = typeof value == 'string' ? `'${value}'` : value;
        }
        else if(type == havingType.BETWEEN) {
            havingObj.not = not;
            havingObj.value1 = typeof value1 == 'number' ? value1 : value1.toString();
            havingObj.value2 = typeof value2 == 'number' ? value2 : value2.toString();
        }

        this.#queryObj.havings.push(havingObj);
        return this;
    }

    /**
     * @param {Array|String} columns
     */
    select(columns=[]) {
        this.#queryObj.selects.push(
            ...(Array.isArray(columns) ? columns.map(col => `'${col}'`) : [columns])
        );

        return this;
    }

    distinct() {
        this.#queryObj.distinct = true;

        return this;
    }

    /**
     * @param {String} column
     * @param {String} operator Operator like =, <=, >=, etc
     * @param {String|Number} value  
     */
    where(column, operator, value=null) {
        return this.#commonWhere({ type: whereType.BASIC, column, operator, value });
    }

    /**
     * @param {String} column
     * @param {String} operator Operator like =, <=, >=, etc
     * @param {String|Number} value  
     */
    orWhere(column, operator, value=null) {
        return this.#commonWhere({ type: whereType.BASIC, column, operator, value, boolean:"or" });
    }

    /**
     * @param {String} column 
     * @param {Array} values 
     * @returns 
     */
    whereIn(column, values=[]) {
        return this.#commonWhere({ type: whereType.IN, column, values });
    }

    /**
     * @param {String} column 
     * @param {Array} values 
     * @returns 
     */
    orWhereIn(column, values=[]) {
        return this.#commonWhere({ type: whereType.IN, column, values, boolean: 'or' });
    }

    /**
     * @param {String|Array<String>} columns
     */
    groupBy(columns=undefined) {
        const addGroup = (col) => {
            if(['number', 'string'].includes(typeof col))
                this.#queryObj.groups.push(`'${col.toString()}'`);
        }

        if(Array.isArray(columns)) 
            columns.forEach(col => addGroup(col));
        else 
            addGroup(columns);

        return this;
    }

    /**
     * @param {String} column 
     * @param {String} operator Operator like =, <=, >=, etc
     * @param {String|Number} value 
     */
    having(column, operator, value) {
        return this.#commonHaving({ type: havingType.BASIC, column, operator, value });
    }

    /**
     * @param {String} column 
     * @param {String} operator Operator like =, <=, >=, etc
     * @param {String|Number} value 
     * @returns 
     */
    orHaving(column, operator, value) {
        return this.#commonHaving({ type: havingType.BASIC, column, operator, value, boolean: 'or' });
    }

    /**
     * @param {String} column 
     * @param {String|Number} value1 
     * @param {String|Number} value2 
     */
    havingBetween(column, value1, value2) {
        return this.#commonHaving({ type: havingType.BETWEEN, column, value1, value2 });
    }

    /**
     * @param {String} column 
     * @param {String|Number} value1 
     * @param {String|Number} value2 
     */
    orHavingBetween(column, value1, value2) {
        return this.#commonHaving({ type: havingType.BETWEEN, column, value1, value2, boolean: 'or' });
    }

    /**
     * @param {String} column 
     * @param {String|Number} value1 
     * @param {String|Number} value2 
     */
    havingNotBetween(column, value1, value2) {
        return this.#commonHaving({ type: havingType.BETWEEN, column, value1, value2, not: true });
    }

    /**
     * @param {String} column 
     * @param {String|Number} value1 
     * @param {String|Number} value2 
     */
    orHavingNotBetween(column, value1, value2) {
        return this.#commonHaving({ type: havingType.BETWEEN, column, value1, value2, not: true, boolean: 'or' });
    }

    /**
     * @param {String} column 
     * @param {("asc"|"desc")} direction 
     */
    orderBy(column, direction="asc") {
        if(!Object.values(orderDirection).includes(direction)) 
            throw new Error(`Invalid direction value! Must be either asc or desc`);

        this.#queryObj.orders.push({
            column,
            direction
        });

        return this;
    }

    /**
     * @param {Number} value
     */
    limit(value) {
        this.#queryObj.limit = parseInt(value) || 0;
        return this;
    }

    toRawSQL() {
        return this.#build();
    }

}

module.exports = QueryBuilder;