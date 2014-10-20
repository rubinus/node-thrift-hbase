/**
 * Created by rubinus on 14-10-20.
 */
'use strict';

var Client = function(options) {
    if (!(this instanceof Client)) {
        return new Client(options);
    }

};

Client.create = function (options) {
    return new Client(options);
};

Client.prototype.get = function (tableName,callback) {
//    this._action('get', tableName, get, true, 0, callback);
    callback('testing');
};

module.exports = Client;