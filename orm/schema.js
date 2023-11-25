const { columnDataType, maxColumnStrLength } = require('./assets');
const util = require('./util');

class Schema {
    /**
     * @param {("create"|"alter")} mode 
     * @param {Object} qStructure 
     */
    static #buildQuery(mode, tableName, qStructure) {
        const { column } = qStructure;
        const qAry = ['CREATE', 'TABLE', tableName];
        let primaryCol = null;
        
        const columns = Object.entries(column).reduce((colAry, [colName, { dataType, modifier }]) => {
            const ary = [colName, dataType];

            if(modifier.default !== undefined)
                ary.push(`DEFAULT ${modifier.default === null ? 'NULL' : util.colValue(modifier.default)}`);

            if(!modifier.isNullable) 
                ary.push('NOT NULL');

            if(modifier.autoInc) 
                ary.push('AUTO_INCREMENT');

            if(modifier.unique) 
                ary.push('UNIQUE');

            if(modifier.isPrimary) 
                primaryCol = colName;

            colAry.push(ary.join(' '));
            return colAry;
        }, []);

        primaryCol && (columns.push(`PRIMARY KEY(${primaryCol})`));
        qAry.push(`(${columns.join(', ')})`);

        return qAry.join(' ');
    }

    /**
     * @callback schemaStructure
     * @param {Table} table
     */

    /**
     * @param {String} tableName 
     * @param {schemaStructure} define 
     */
    static create(tableName, define) {
        const newTable = new Table();
        define(newTable);
        const createQuery = this.#buildQuery("create", tableName, newTable.getStructure());
        console.log(createQuery);
    }
}

class Table {
    #structure = {
        column: {}
    };

    #pushNewColumn(col, dataType) {
        this.#structure.column[col] = { dataType, modifier: {} };
    }

    id(column='id') {
        if(typeof column !== 'string') throw new Error('Argument must be string');

        this.#pushNewColumn(column, columnDataType.BIGINT);

        return new ColumnModifier(this.#structure.column[column].modifier);
    }

    char(column, length=250) {
        if(typeof column !== 'string') throw new Error('Argument must be string');
        if(typeof length !== 'number') throw new Error('Argument must be number');

        this.#pushNewColumn(column, `${columnDataType.CHAR}(${length > maxColumnStrLength.CHAR ? maxColumnStrLength.CHAR : length})`);
        
        return new ColumnModifier(this.#structure.column[column].modifier);
    }

    string(column, length=250) {
        if(typeof column !== 'string') throw new Error('Argument must be string');
        if(typeof length !== 'number') throw new Error('Argument must be number');

        this.#pushNewColumn(column, `${columnDataType.VARCHAR}(${length > maxColumnStrLength.VARCHAR ? maxColumnStrLength.VARCHAR : length})`);
        
        return new ColumnModifier(this.#structure.column[column].modifier);
    }

    integer(column) {
        if(typeof column !== 'string') throw new Error('Argument must be string');

        this.#pushNewColumn(column, columnDataType.INT);

        return new ColumnModifier(this.#structure.column[column].modifier)
    }

    getStructure() {
        return this.#structure;
    }
}

class ColumnModifier {
    #modifierPrototype = {
        isNullable: true,
        default: undefined,
        autoInc: false,
        unique: false,
        isPrimary: false
    }
    
    #modifier;

    constructor(modifier) {
        Object.assign(modifier, this.#modifierPrototype);
        this.#modifier = modifier;
    }

    primary() {
        this.#modifier.isPrimary = true;
        return this;
    }

    autoIncrement() {
        this.#modifier.autoInc = true;
        return this;
    }

    unique() {
        this.#modifier.unique = true;
        return this;
    }

    nullable(val=true) {
        if(typeof val !== 'boolean') throw new Error('Argument must be boolean');

        this.#modifier.isNullable = val;
        return this;
    }

    default(val=null) {
        this.#modifier.default = val;
        return this;
    }
}

class ForeignColumnModifier {
    #modifierPrototype = {
        refTable: null,
        refColumn: null
    }

    #modifier;

    constructor(modifier) {
        Object.assign(modifier, this.#modifierPrototype);
        this.#modifier = modifier;
    }

    references(column='id') {
        this.#modifier.refColumn = column;
        return this;
    }

    on(table='') {
        this.#modifier.refTable = table;
        return this;
    }
}

module.exports = Schema;