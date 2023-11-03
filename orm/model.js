const QueryBuilder = require('./query-builder');

class Model {
    static $table;
    static $primaryKey = 'id';
    static $fillable = null;

    static query() {
        return (new QueryBuilder(this.$table))
            .setPrimaryKey(this.$primaryKey)
            .setFillable(this.$fillable);
    }
}

/**
 * @param {String} tableName Table Name
 * @param {Object} config
 * @param {String} config.primaryKey Primary Key
 * @param {Array<String>} config.fillable Insertable columns
 * @returns 
 */
function createModel(tableName, { primaryKey='id', fillable=null }) {
    return class extends Model {
        static $table = tableName;
        static $primaryKey = primaryKey;
        static $fillable = fillable;
    }
}

module.exports = { createModel, Model }