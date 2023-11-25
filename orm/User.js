const { Model } = require('./model');

class User extends Model {
    static $table = 'users';
    static $primaryKey = 'id';
    static $fillable = null;
}

module.exports = User;