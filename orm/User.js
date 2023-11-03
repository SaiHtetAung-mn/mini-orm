const { Model } = require('./model');

class User extends Model {
    static $table = 'users';
    static $primaryKey = 'id';
    static $fillable = ['name', 'email']
}

module.exports = User;